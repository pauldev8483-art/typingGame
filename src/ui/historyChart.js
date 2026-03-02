import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

let chart;

export function renderHistoryChart(canvasEl, history) {
  if (!canvasEl) return;
  const recent = history.slice(-50);
  const labels = recent.map((entry, idx) => entry.completedAt ?? `#${idx + 1}`);
  const wpmData = recent.map((entry) => entry.wpm);
  const accuracyData = recent.map((entry) => entry.accuracy);

  const data = {
    labels,
    datasets: [
      {
        label: "WPM",
        data: wpmData,
        borderColor: "rgba(124, 216, 255, 0.9)",
        backgroundColor: "rgba(124, 216, 255, 0.15)",
        tension: 0.25,
        yAxisID: "y",
      },
      {
        label: "Accuracy (%)",
        data: accuracyData,
        borderColor: "rgba(126, 226, 140, 0.9)",
        backgroundColor: "rgba(126, 226, 140, 0.12)",
        tension: 0.25,
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#e7edf3",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#8ea0b5", maxRotation: 45, minRotation: 0 },
        grid: { color: "rgba(255,255,255,0.04)" },
      },
      y: {
        type: "linear",
        position: "left",
        ticks: { color: "#8ea0b5" },
        grid: { color: "rgba(255,255,255,0.04)" },
      },
      y1: {
        type: "linear",
        position: "right",
        ticks: { color: "#8ea0b5" },
        grid: { drawOnChartArea: false },
        suggestedMin: 80,
        suggestedMax: 100,
      },
    },
  };

  if (!chart) {
    chart = new Chart(canvasEl.getContext("2d"), {
      type: "line",
      data,
      options,
    });
  } else {
    chart.data = data;
    chart.options = options;
    chart.update();
  }
}
