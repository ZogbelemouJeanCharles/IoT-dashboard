import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Graph({ dataPoints = [] }) {
  // Dummy data if nothing is passed
  const labels = dataPoints.length
    ? dataPoints.map((_, i) => `T${i + 1}`)
    : ["T1", "T2", "T3", "T4", "T5"];

  const data = {
    labels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: dataPoints.length ? dataPoints : [20, 22, 23, 21, 24],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.3)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "#fff" } },
      title: { display: true, text: "Temperature Trend", color: "#fff" },
    },
    scales: {
      x: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.1)" } },
      y: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.1)" } },
    },
  };

  return (
    <div className="w-[400px] h-[250px] bg-gray-800 p-4 rounded-2xl shadow-lg">
      <Line data={data} options={options} />
    </div>
  );
}
