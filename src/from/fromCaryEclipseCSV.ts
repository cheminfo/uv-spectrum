import type { TextData } from 'cheminfo-types';
import { Analysis } from 'common-spectrum';
import { ensureString } from 'ensure-string';

import { spectrumCallback } from './utils/spectrumCallback.ts';

/**
 * Parses a Cary Eclipse CSV file containing multiple samples with metadata.
 * Each sample gets its own spectrum in the returned Analysis, with instrument
 * parameters stored as meta.
 * @param data - CSV file content as string or ArrayBuffer.
 * @returns A new Analysis with one spectrum per sample.
 */
export function fromCaryEclipseCSV(data: TextData): Analysis {
  const text = ensureString(data);

  const lines = text.split(/\r?\n/);

  const { sampleNames, headerLine } = parseHeader(lines);
  const dataEndIndex = findDataEnd(lines);
  const dataRows = parseDataRows(lines, dataEndIndex);
  const metadataBlocks = parseMetadataBlocks(lines, dataEndIndex, sampleNames);

  const xLabel = extractLabel(headerLine, 0);
  const yLabel = extractLabel(headerLine, 1);
  const xUnits = extractUnits(headerLine, 0);
  const yUnits = extractUnits(headerLine, 1);

  const analysis = new Analysis({ spectrumCallback });

  for (let sampleIndex = 0; sampleIndex < sampleNames.length; sampleIndex++) {
    const xData: number[] = [];
    const yData: number[] = [];

    for (const row of dataRows) {
      const xValue = row[sampleIndex * 2];
      const yValue = row[sampleIndex * 2 + 1];
      if (xValue !== undefined && yValue !== undefined) {
        xData.push(xValue);
        yData.push(yValue);
      }
    }

    const sampleName = sampleNames[sampleIndex] ?? `Sample ${sampleIndex + 1}`;
    const meta = metadataBlocks.get(sampleName) ?? {};

    analysis.pushSpectrum(
      {
        x: { data: xData, label: xLabel, units: xUnits },
        y: { data: yData, label: yLabel, units: yUnits },
      },
      {
        dataType: 'UV spectrum',
        title: sampleName,
        meta,
      },
    );
  }

  return analysis;
}

function parseHeader(lines: string[]): {
  sampleNames: string[];
  headerLine: string;
} {
  const firstLine = lines[0] ?? '';
  const headerLine = lines[1] ?? '';

  const nameParts = firstLine.split(',');
  const sampleNames: string[] = [];
  // Sample names appear at even indices (0, 2, 4, ...) in the header row
  for (let i = 0; i < nameParts.length; i += 2) {
    const name = nameParts[i]?.trim();
    if (name) {
      sampleNames.push(name);
    }
  }

  return { sampleNames, headerLine };
}

function findDataEnd(lines: string[]): number {
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i]?.trim() ?? '';
    if (line === '') return i;
    // Check if line starts with a number (data row)
    if (!/^\d/.test(line)) return i;
  }
  return lines.length;
}

function parseDataRows(lines: string[], endIndex: number): number[][] {
  const rows: number[][] = [];
  for (let i = 2; i < endIndex; i++) {
    const line = lines[i]?.trim() ?? '';
    if (line === '') continue;
    const values = line.split(',').map(Number).filter(Number.isFinite);
    if (values.length > 0) {
      rows.push(values);
    }
  }
  return rows;
}

function parseMetadataBlocks(
  lines: string[],
  dataEndIndex: number,
  sampleNames: string[],
): Map<string, Record<string, string>> {
  const blocks = new Map<string, Record<string, string>>();

  let currentSample: string | undefined;
  let currentMeta: Record<string, string> = {};

  for (let i = dataEndIndex; i < lines.length; i++) {
    const line = lines[i] ?? '';
    const trimmed = line.trim();

    // Detect a new metadata block: a line matching a sample name (possibly with trailing comma)
    const cleanName = trimmed.replace(/,+$/, '').trim();
    if (sampleNames.includes(cleanName) && !trimmed.includes(':')) {
      // Save previous block
      if (currentSample !== undefined) {
        blocks.set(currentSample, currentMeta);
      }
      currentSample = cleanName;
      currentMeta = {};
      continue;
    }

    if (currentSample === undefined) continue;

    // Skip method modifications section
    if (trimmed === 'Method Modifications:') {
      // Skip until "End Method Modifications"
      while (i + 1 < lines.length) {
        i++;
        if (lines[i]?.trim() === 'End Method Modifications') break;
      }
      continue;
    }

    // Parse "Key: Value" or "Key                     Value" lines
    const colonMatch = /^(?<key>[^:]+):\s*(?<value>.*)$/.exec(trimmed);
    if (colonMatch?.groups) {
      const key = colonMatch.groups.key?.trim();
      const value = colonMatch.groups.value?.trim();
      if (key && value) {
        currentMeta[key] = value;
      }
      continue;
    }

    // Parse lines with wide spacing (instrument parameter style)
    const spacedMatch = /^(?<key>\S[\s\S]*?)\s{2,}(?<value>\S[\s\S]*)$/.exec(
      trimmed,
    );
    if (spacedMatch?.groups) {
      const key = spacedMatch.groups.key?.trim();
      const value = spacedMatch.groups.value?.trim();
      if (key && value) {
        currentMeta[key] = value;
      }
    }
  }

  // Save last block
  if (currentSample !== undefined) {
    blocks.set(currentSample, currentMeta);
  }

  return blocks;
}

function extractLabel(headerLine: string, columnIndex: number): string {
  const parts = headerLine.split(',');
  const header = parts[columnIndex]?.trim() ?? '';
  // Remove units in parentheses: "Wavelength (nm)" -> "Wavelength"
  return header.replace(/\s*\(.*\)\s*$/, '');
}

function extractUnits(headerLine: string, columnIndex: number): string {
  const parts = headerLine.split(',');
  const header = parts[columnIndex]?.trim() ?? '';
  const match = /\((?<units>[^)]+)\)/.exec(header);
  return match?.groups?.units ?? '';
}
