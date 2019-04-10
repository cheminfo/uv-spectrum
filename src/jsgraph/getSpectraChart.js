export function getSpectraChart(spectra, options = {}) {
  let chart = {
    title: 'UV spectra superimposition',
    data: []
  };
  for (let spectrum of spectra) {
    let data = spectrum.getData();
    data.styles = {
      unselected: {
        lineColor: spectrum.meta.color,
        lineWidth: 1,
        lineStyle: 1
      },
      selected: {
        lineColor: spectrum.meta.color,
        lineWidth: 3,
        lineStyle: 1
      }
    };
    data.label = spectrum.meta.label || spectra.id;
    chart.data.push(data);
  }
  return chart;
}
