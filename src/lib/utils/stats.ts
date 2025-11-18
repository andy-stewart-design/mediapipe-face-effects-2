import Stats from "stats-gl";

function createStats(render = true) {
  const stats = new Stats({
    trackGPU: false,
    trackHz: false,
    trackCPT: false,
    logsPerSecond: 4,
    graphsPerSecond: 30,
    samplesLog: 40,
    samplesGraph: 10,
    precision: 2,
    horizontal: true,
    minimal: false,
    mode: 0,
  });

  if (render) document.body.appendChild(stats.dom);

  return stats;
}

export { createStats };
