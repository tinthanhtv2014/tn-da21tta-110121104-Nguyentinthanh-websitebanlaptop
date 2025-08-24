import { useEffect } from "react";
import { Chart } from "chart.js";
export default function ChartComponent() {
  useEffect(() => {
    // Load Chart.js từ CDN
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    script.onload = () => {
      renderCharts();
    };
    document.body.appendChild(script);
  }, []);

  function renderCharts() {
    // Line Chart
    new Chart(document.getElementById("lineChart"), {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Sales",
            data: [10, 20, 15, 25, 30, 22],
            borderColor: "#007bff",
            backgroundColor: "rgba(0, 123, 255, 0.2)",
            fill: true,
          },
        ],
      },
    });

    // Doughnut Chart
    new Chart(document.getElementById("doughnutChart"), {
      type: "doughnut",
      data: {
        labels: ["Electronics", "Clothes", "Groceries"],
        datasets: [
          {
            data: [30, 50, 20],
            backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"],
          },
        ],
      },
    });
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center">Biểu đồ thống kê</h2>
      <div className="row">
        <div className="col-md-8">
          <canvas id="lineChart"></canvas>
        </div>
        <div className="col-md-4">
          <canvas id="doughnutChart"></canvas>
        </div>
      </div>
    </div>
  );
}
