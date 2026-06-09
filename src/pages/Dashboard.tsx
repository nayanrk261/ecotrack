import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  TrendingUp,
  TrendingDown,
  Calculator,
  BarChart3,
  Leaf,
  Globe,
  CalendarDays,
} from 'lucide-react';

import { useCarbon } from '../hooks/useCarbon';
import { getScoreEmoji, getScoreColor } from '../lib/carbonCalculations';
import { AVERAGES } from '../lib/constants';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const { footprints, latest } = useCarbon();

  // Derived stats
  const stats = useMemo(() => {
    if (!latest) return null;
    const r = latest.result;
    const vsIndia = ((r.totalMonthly - AVERAGES.india.monthly) / AVERAGES.india.monthly) * 100;
    const vsGlobal = ((r.totalMonthly - AVERAGES.global.monthly) / AVERAGES.global.monthly) * 100;
    return {
      monthly: r.totalMonthly,
      annual: r.totalAnnual,
      vsIndia: Math.round(vsIndia),
      vsGlobal: Math.round(vsGlobal),
      score: r.score,
      breakdown: r.breakdown,
    };
  }, [latest]);

  // Line chart – last 6 entries (reversed for chronological)
  const lineData = useMemo(() => {
    const last6 = footprints.slice(0, 6).reverse();
    return {
      labels: last6.map((f) =>
        new Date(f.date).toLocaleDateString('en-IN', {
          month: 'short',
          day: 'numeric',
        })
      ),
      datasets: [
        {
          label: 'kg CO₂/month',
          data: last6.map((f) => f.result.totalMonthly),
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34,197,94,0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#22c55e',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
        },
      ],
    };
  }, [footprints]);

  // Doughnut chart
  const doughnutData = useMemo(() => {
    if (!stats) return null;
    return {
      labels: ['Transport', 'Energy', 'Diet', 'Lifestyle'],
      datasets: [
        {
          data: [
            stats.breakdown.transport,
            stats.breakdown.energy,
            stats.breakdown.diet,
            stats.breakdown.lifestyle,
          ],
          backgroundColor: ['#3b82f6', '#f97316', '#22c55e', '#a855f7'],
          borderColor: ['#2563eb', '#ea580c', '#16a34a', '#9333ea'],
          borderWidth: 2,
          hoverOffset: 8,
        },
      ],
    };
  }, [stats]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#a1a1aa', font: { size: 12 } } },
    },
  };

  const lineOptions = {
    ...chartOptions,
    scales: {
      x: { ticks: { color: '#a1a1aa' }, grid: { color: '#1a1a1a' } },
      y: { ticks: { color: '#a1a1aa' }, grid: { color: '#1a1a1a' } },
    },
  };

  // ===== Empty state =====
  if (!latest || !stats) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h2 className="empty-title">No Data Yet</h2>
            <p className="empty-desc">
              Calculate your carbon footprint first to see your dashboard with
              charts and insights.
            </p>
            <Link to="/calculator" className="btn btn-primary btn-lg">
              <Calculator size={20} />
              Calculate Your Footprint
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="page-title">
          Your <span className="text-gradient">Dashboard</span>
        </h1>
        <p className="page-subtitle">
          Track your carbon footprint trends and compare with averages
        </p>

        {/* ===== Carbon Score Card ===== */}
        <div
          className="score-card"
          style={{ borderColor: getScoreColor(stats.score) + '40' }}
        >
          <div className="score-emoji">{getScoreEmoji(stats.score)}</div>
          <div className="score-info">
            <div
              className="score-badge"
              style={{
                backgroundColor: getScoreColor(stats.score) + '20',
                color: getScoreColor(stats.score),
              }}
            >
              {stats.score}
            </div>
            <p className="score-desc">
              {stats.score === 'Eco Warrior' &&
                'Amazing! You are well below average. Keep it up!'}
              {stats.score === 'Green Learner' &&
                'Good start! Small changes can make a big difference.'}
              {stats.score === 'Average' &&
                'Room for improvement. Check out our action plans!'}
              {stats.score === 'Carbon Heavy' &&
                'Your footprint is high. Let us help you reduce it.'}
            </p>
          </div>
        </div>

        {/* ===== Stat Cards ===== */}
        <div className="dashboard-stats-grid">
          <div className="card stat-card-dashboard">
            <div className="stat-card-icon">
              <BarChart3 size={20} />
            </div>
            <div className="stat-card-value">
              {stats.monthly.toFixed(1)}
              <span className="stat-card-unit">kg/mo</span>
            </div>
            <div className="stat-card-label">Current Monthly</div>
          </div>

          <div className="card stat-card-dashboard">
            <div className="stat-card-icon">
              <CalendarDays size={20} />
            </div>
            <div className="stat-card-value">
              {stats.annual.toFixed(2)}
              <span className="stat-card-unit">tons/yr</span>
            </div>
            <div className="stat-card-label">Annual Estimate</div>
          </div>

          <div className="card stat-card-dashboard">
            <div className="stat-card-icon">
              <Leaf size={20} />
            </div>
            <div className="stat-card-value">
              {stats.vsIndia > 0 ? '+' : ''}
              {stats.vsIndia}%
            </div>
            <div className="stat-card-label">vs India Average</div>
            <div className={`stat-trend ${stats.vsIndia <= 0 ? 'trend-good' : 'trend-bad'}`}>
              {stats.vsIndia <= 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
              {stats.vsIndia <= 0 ? 'Below' : 'Above'}
            </div>
          </div>

          <div className="card stat-card-dashboard">
            <div className="stat-card-icon">
              <Globe size={20} />
            </div>
            <div className="stat-card-value">
              {stats.vsGlobal > 0 ? '+' : ''}
              {stats.vsGlobal}%
            </div>
            <div className="stat-card-label">vs Global Average</div>
            <div className={`stat-trend ${stats.vsGlobal <= 0 ? 'trend-good' : 'trend-bad'}`}>
              {stats.vsGlobal <= 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
              {stats.vsGlobal <= 0 ? 'Below' : 'Above'}
            </div>
          </div>
        </div>

        {/* ===== Charts ===== */}
        <div className="charts-grid">
          <div className="card">
            <h3 className="card-title">Monthly Trend</h3>
            <div className="chart-container">
              {footprints.length > 1 ? (
                <Line data={lineData} options={lineOptions} />
              ) : (
                <div className="chart-placeholder">
                  <p>Save more calculations to see your trend line</p>
                </div>
              )}
            </div>
          </div>
          <div className="card">
            <h3 className="card-title">Category Breakdown</h3>
            <div className="chart-container">
              {doughnutData && <Doughnut data={doughnutData} options={chartOptions} />}
            </div>
          </div>
        </div>

        {/* ===== History Table ===== */}
        <div className="card">
          <h3 className="card-title">Recent History</h3>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Monthly (kg)</th>
                  <th>Annual (tons)</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {footprints.slice(0, 5).map((f) => (
                  <tr key={f.id}>
                    <td>
                      {new Date(f.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td>{f.result.totalMonthly.toFixed(1)}</td>
                    <td>{f.result.totalAnnual.toFixed(2)}</td>
                    <td>
                      <span
                        className="table-badge"
                        style={{
                          backgroundColor: getScoreColor(f.result.score) + '20',
                          color: getScoreColor(f.result.score),
                        }}
                      >
                        {getScoreEmoji(f.result.score)} {f.result.score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
