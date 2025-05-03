'use client';

import React from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  title: string;
  data: { date: string; count: number }[];
}

interface BarChartProps {
  title: string;
  data: { label: string; value: number }[];
}

interface DoughnutChartProps {
  title: string;
  data: { label: string; value: number }[];
}

export function FeedbackLineChart({ title, data }: LineChartProps) {
  const chartData = {
    labels: data.map(item => {
      // Format date as MM/DD
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: 'Feedback Received',
        data: data.map(item => item.count),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <Line data={chartData} options={options} />
    </div>
  );
}

export function FeedbackBarChart({ title, data }: BarChartProps) {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: 'Count',
        data: data.map(item => item.value),
        backgroundColor: [
          'rgba(99, 102, 241, 0.6)',
          'rgba(139, 92, 246, 0.6)',
          'rgba(168, 85, 247, 0.6)',
          'rgba(217, 70, 239, 0.6)',
          'rgba(236, 72, 153, 0.6)',
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(139, 92, 246)',
          'rgb(168, 85, 247)',
          'rgb(217, 70, 239)',
          'rgb(236, 72, 153)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <Bar data={chartData} options={options} />
    </div>
  );
}

export function FeedbackDoughnutChart({ title, data }: DoughnutChartProps) {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: [
          'rgba(99, 102, 241, 0.6)',
          'rgba(139, 92, 246, 0.6)',
          'rgba(168, 85, 247, 0.6)',
          'rgba(217, 70, 239, 0.6)',
          'rgba(236, 72, 153, 0.6)',
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(139, 92, 246)',
          'rgb(168, 85, 247)',
          'rgb(217, 70, 239)',
          'rgb(236, 72, 153)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}

export function KeywordCloud({ keywords }: { keywords: { text: string; count: number }[] }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Common Keywords</h3>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <span
            key={index}
            className="px-3 py-1 rounded-full"
            style={{
              backgroundColor: `rgba(99, 102, 241, ${Math.min(keyword.count / 10, 0.9)})`,
              fontSize: `${Math.max(0.8 + keyword.count / 10, 1)}rem`,
              color: keyword.count > 5 ? 'white' : 'black',
            }}
          >
            {keyword.text}
          </span>
        ))}
      </div>
    </div>
  );
} 