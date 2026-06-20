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
  Trash2,
  Users,
  FileDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { useCarbon } from '../hooks/useCarbon';
import { getScoreEmoji, getScoreColor } from '../lib/carbonCalculations';
import { AVERAGES, STORAGE_KEYS } from '../lib/constants';
import { useLanguage } from '../context/LanguageContext';
import { calculateTrendRegression } from '../lib/trendAnalysis';
import { generateInsights } from '../lib/insights';

const LEADERBOARD_DEMO = [
  { name: 'Aditya Sharma', footprint: 120.5, avatarBg: 'from-emerald-400 to-teal-600 text-slate-950' },
  { name: 'Priya Patel', footprint: 145.2, avatarBg: 'from-cyan-400 to-blue-600 text-slate-950' },
  { name: 'You', footprint: 0, avatarBg: 'from-green-400 to-emerald-600 text-slate-950', isUser: true },
  { name: 'Rahul Verma', footprint: 210.0, avatarBg: 'from-amber-400 to-orange-600 text-slate-950' },
  { name: 'Sneha Reddy', footprint: 320.8, avatarBg: 'from-pink-500 to-rose-600 text-white' },
];

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
  const { locale, t } = useLanguage();

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

  const sortedLeaderboard = useMemo(() => {
    const list = LEADERBOARD_DEMO.map((item) => {
      if (item.isUser) {
        return { ...item, footprint: stats?.monthly || 0 };
      }
      return item;
    });
    return list
      .sort((a, b) => a.footprint - b.footprint)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [stats?.monthly]);

  const handleClearData = () => {
    const msg = locale === 'en' 
      ? 'Are you sure you want to clear all your local carbon calculations and green actions data? This cannot be undone.'
      : 'क्या आप वाकई अपने सभी स्थानीय कार्बन गणनाओं और हरित एक्शन्स डेटा को हटाना चाहते हैं? इसे पूर्ववत नहीं किया जा सकता है।';
    if (window.confirm(msg)) {
      try {
        localStorage.removeItem(STORAGE_KEYS.footprints);
        localStorage.removeItem(STORAGE_KEYS.actions);
        toast.success(locale === 'en' ? 'Your data has been successfully cleared!' : 'आपका डेटा सफलतापूर्वक हटा दिया गया है!');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (e) {
        console.error('Failed to clear storage:', e);
        toast.error(locale === 'en' ? 'An error occurred while resetting storage.' : 'भंडारण रीसेट करते समय एक त्रुटि हुई।');
      }
    }
  };

  // Trend Regression Projection calculation
  const regressionResult = useMemo(() => {
    const last6 = footprints.slice(0, 6).reverse();
    const yValues = last6.map((f) => f.result.totalMonthly);
    return calculateTrendRegression(yValues);
  }, [footprints]);

  // Line chart – last 6 entries (reversed for chronological)
  const lineData = useMemo(() => {
    const last6 = footprints.slice(0, 6).reverse();
    const yValues = last6.map((f) => f.result.totalMonthly);
    const labels = last6.map((f) =>
      new Date(f.date).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
      })
    );

    if (yValues.length >= 2) {
      labels.push(locale === 'en' ? 'Projected' : 'अनुमानित');
    }

    const datasets: {
      label: string;
      data: (number | null)[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
      tension: number;
      pointBackgroundColor: string;
      pointBorderColor: string;
      pointBorderWidth: number;
      pointRadius: number;
      borderDash?: number[];
    }[] = [
      {
        label: locale === 'en' ? 'kg CO₂/month' : 'किग्रा CO₂/माह',
        data: yValues.length >= 2 ? [...yValues, null] : yValues,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34,197,94,0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#22c55e',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ];

    if (yValues.length >= 2) {
      const regPoints = [
        ...yValues.map((_, idx) => regressionResult.slope * idx + regressionResult.intercept),
        regressionResult.projectedNext,
      ];
      datasets.push({
        label: locale === 'en' ? 'Projected Trend' : 'अनुमानित रुझान',
        data: regPoints,
        borderColor: '#a855f7',
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.2,
        borderDash: [5, 5],
        pointBackgroundColor: '#a855f7',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      });
    }

    return {
      labels,
      datasets,
    };
  }, [footprints, regressionResult, locale]);

  // Doughnut chart
  const doughnutData = useMemo(() => {
    if (!stats) return null;
    return {
      labels: [t('transport'), t('energy'), t('diet'), t('lifestyle')],
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
  }, [stats, t]);

  const aiTips = useMemo(() => {
    if (!latest) return [];
    return generateInsights(latest.result.breakdown, latest.result.totalMonthly);
  }, [latest]);

  const handleDownloadReport = async () => {
    const element = document.getElementById('pdf-report-template');
    if (!element) {
      toast.error(locale === 'en' ? 'Failed to generate report layout.' : 'रिपोर्ट लेआउट बनाने में विफल।');
      return;
    }

    const toastId = toast.loading(locale === 'en' ? 'Generating your PDF report...' : 'आपकी पीडीएफ रिपोर्ट बनाई जा रही है...');
    try {
      element.style.position = 'static';
      element.style.left = '0';
      element.style.top = '0';

      const canvas = await html2canvas(element, {
        useCORS: true,
        backgroundColor: '#09090b',
        scale: 2,
      });

      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.top = '-9999px';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`EcoTrack_Carbon_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success(locale === 'en' ? 'Report downloaded successfully!' : 'रिपोर्ट सफलतापूर्वक डाउनलोड हो गई!', { id: toastId });
    } catch (e) {
      console.error(e);
      toast.error(locale === 'en' ? 'An error occurred while exporting the report.' : 'रिपोर्ट निर्यात करते समय एक त्रुटि हुई।', { id: toastId });
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.top = '-9999px';
    }
  };

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
            <h2 className="empty-title">{t('noDataTitle')}</h2>
            <p className="empty-desc">
              {t('noDataDesc')}
            </p>
            <Link to="/calculator" className="btn btn-primary btn-lg text-decoration-none">
              <Calculator size={20} />
              {t('calcFootprintBtn')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header with Download Report button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div>
            <h1 className="page-title mb-0">
              {locale === 'en' ? 'Your ' : 'आपका '}<span className="text-gradient">{t('dashboard')}</span>
            </h1>
            <p className="page-subtitle mt-1 mb-0">
              {t('dashSubtitle')}
            </p>
          </div>
          <button
            onClick={handleDownloadReport}
            className="btn btn-primary flex items-center gap-2 self-start sm:self-center py-2.5 px-5 rounded-xl cursor-pointer shadow-md shadow-green-500/10 hover:shadow-green-500/20 active:scale-[0.98]"
            title="Download PDF Report"
          >
            <FileDown size={18} />
            {t('downloadReport')}
          </button>
        </div>

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
                (locale === 'en' ? 'Amazing! You are well below average. Keep it up!' : 'अद्भुत! आप औसत से काफी नीचे हैं। इसे जारी रखें!')}
              {stats.score === 'Green Learner' &&
                (locale === 'en' ? 'Good start! Small changes can make a big difference.' : 'अच्छी शुरुआत! छोटे बदलाव बड़ा अंतर ला सकते हैं।')}
              {stats.score === 'Average' &&
                (locale === 'en' ? 'Room for improvement. Check out our action plans!' : 'सुधार की गुंजाइश है। हमारे एक्शन प्लान देखें!')}
              {stats.score === 'Carbon Heavy' &&
                (locale === 'en' ? 'Your footprint is high. Let us help you reduce it.' : 'आपका कार्बन उत्सर्जन अधिक है। आइए हम इसे कम करने में आपकी सहायता करें।')}
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
              <span className="stat-card-unit">{locale === 'en' ? 'kg/mo' : 'किग्रा/माह'}</span>
            </div>
            <div className="stat-card-label">{t('monthly')}</div>
          </div>

          <div className="card stat-card-dashboard">
            <div className="stat-card-icon">
              <CalendarDays size={20} />
            </div>
            <div className="stat-card-value">
              {stats.annual.toFixed(2)}
              <span className="stat-card-unit">{locale === 'en' ? 'tons/yr' : 'टन/वर्ष'}</span>
            </div>
            <div className="stat-card-label">{t('annual')}</div>
          </div>

          <div className="card stat-card-dashboard">
            <div className="stat-card-icon">
              <Leaf size={20} />
            </div>
            <div className="stat-card-value">
              {stats.vsIndia > 0 ? '+' : ''}
              {stats.vsIndia}%
            </div>
            <div className="stat-card-label">{t('vsIndia')}</div>
            <div className={`stat-trend ${stats.vsIndia <= 0 ? 'trend-good' : 'trend-bad'}`}>
              {stats.vsIndia <= 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
              {stats.vsIndia <= 0 ? (locale === 'en' ? 'Below' : 'नीचे') : (locale === 'en' ? 'Above' : 'ऊपर')}
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
            <div className="stat-card-label">{t('vsGlobal')}</div>
            <div className={`stat-trend ${stats.vsGlobal <= 0 ? 'trend-good' : 'trend-bad'}`}>
              {stats.vsGlobal <= 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
              {stats.vsGlobal <= 0 ? (locale === 'en' ? 'Below' : 'नीचे') : (locale === 'en' ? 'Above' : 'ऊपर')}
            </div>
          </div>
        </div>

        {/* ===== Charts ===== */}
        <div className="charts-grid">
          <div className="card">
            <h3 className="card-title">{t('monthlyTrend')}</h3>
            <div className="chart-container">
              {footprints.length > 1 ? (
                <Line data={lineData} options={lineOptions} />
              ) : (
                <div className="chart-placeholder">
                  <p>{locale === 'en' ? 'Save more calculations to see your trend line' : 'अपने रुझान को देखने के लिए और अधिक गणनाएँ सहेजें'}</p>
                </div>
              )}
            </div>
            {/* Linear Regression Trend Insight */}
            {footprints.length >= 2 && (
              <div className="mt-4 p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-center gap-2">
                {regressionResult.isTrendingDown ? (
                  <TrendingDown className="text-green-500 animate-pulse" size={18} />
                ) : (
                  <TrendingUp className="text-red-500 animate-pulse" size={18} />
                )}
                <span className="text-sm font-semibold text-zinc-300">
                  {locale === 'en'
                    ? `Your footprint is trending ${regressionResult.isTrendingDown ? 'down' : 'up'} by ${regressionResult.absoluteSlope} kg/month.`
                    : `आपका कार्बन फुटप्रिंट प्रति माह ${regressionResult.isTrendingDown ? 'कम' : 'अधिक'} (${regressionResult.absoluteSlope} किग्रा/माह) हो रहा है।`}
                </span>
              </div>
            )}
          </div>
          <div className="card">
            <h3 className="card-title">{t('categoryBreakdown')}</h3>
            <div className="chart-container">
              {doughnutData && <Doughnut data={doughnutData} options={chartOptions} />}
            </div>
          </div>
        </div>

        {/* ===== History & Leaderboard Grid ===== */}
        <div className="charts-grid mt-8">
          {/* History Card */}
          <div className="card">
            <h3 className="card-title">{t('recentHistory')}</h3>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{locale === 'en' ? 'Date' : 'दिनांक'}</th>
                    <th>{locale === 'en' ? 'Monthly (kg)' : 'मासिक (किग्रा)'}</th>
                    <th>{locale === 'en' ? 'Annual (tons)' : 'वार्षिक (टन)'}</th>
                    <th>{locale === 'en' ? 'Score' : 'स्कोर'}</th>
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

          {/* Leaderboard Card */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="card-title mb-0 flex items-center gap-2">
                <Users size={18} className="text-green-500" />
                {t('compareFriends')}
              </h3>
              <span className="text-[10px] font-bold tracking-wider uppercase bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-800">
                {locale === 'en' ? 'Demo Data' : 'डेमो डेटा'}
              </span>
            </div>
            <div className="space-y-3">
              {sortedLeaderboard.map((friend) => (
                <div
                  key={friend.name}
                  className={`flex items-center justify-between p-2.5 rounded-xl border ${
                    friend.isUser
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-zinc-900/30 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 text-center text-sm font-bold ${
                        friend.rank === 1
                          ? 'text-yellow-400'
                          : friend.rank === 2
                          ? 'text-zinc-400'
                          : friend.rank === 3
                          ? 'text-amber-600'
                          : 'text-zinc-500'
                      }`}
                    >
                      #{friend.rank}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-tr ${friend.avatarBg} flex items-center justify-center font-bold text-xs shadow-sm`}
                    >
                      {friend.name[0]}
                    </div>
                    <span className={`text-sm font-bold ${friend.isUser ? 'text-green-400' : 'text-zinc-100'}`}>
                      {friend.name} {friend.isUser && `(${locale === 'en' ? 'You' : 'आप'})`}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-zinc-400">
                    {friend.footprint.toFixed(1)} {locale === 'en' ? 'kg/mo' : 'किग्रा/माह'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== Settings Card ===== */}
        <div className="card mt-8 border-zinc-900/50 bg-zinc-950/20 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 settings-card">
          <div>
            <h4 className="text-base font-bold text-white mb-1">{t('dataSettings')}</h4>
            <p className="text-sm text-zinc-400 font-medium">
              {locale === 'en' ? 'Manage your local carbon calculations and actions data.' : 'अपनी स्थानीय कार्बन गणना और एक्शन्स डेटा प्रबंधित करें।'}
            </p>
          </div>
          <button
            onClick={handleClearData}
            className="btn btn-outline border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500 transition-all text-sm py-2 px-4 rounded-xl cursor-pointer self-start sm:self-center flex items-center gap-2"
          >
            <Trash2 size={16} />
            {t('clearData')}
          </button>
        </div>

        {/* Hidden PDF Report Template Container */}
        <div
          id="pdf-report-template"
          style={{
            position: 'absolute',
            left: '-9999px',
            top: '-9999px',
            width: '800px',
            backgroundColor: '#09090b',
            color: '#ffffff',
            padding: '40px',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #22c55e', paddingBottom: '20px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '32px' }}>🌿</span>
              <span style={{ fontSize: '28px', fontWeight: 'bold', letterSpacing: '1px', color: '#22c55e' }}>EcoTrack Report</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0', fontSize: '12px', color: '#a1a1aa' }}>Generated on:</p>
              <p style={{ margin: '0', fontSize: '15px', fontWeight: 'bold', color: '#ffffff' }}>{new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', color: '#a1a1aa', margin: '0 0 12px 0' }}>Carbon Footprint Summary</h2>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: '1', backgroundColor: '#18181b', border: '1px solid #27272a', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#a1a1aa' }}>Monthly Footprint</p>
                <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: '#22c55e' }}>{stats.monthly.toFixed(1)} <span style={{ fontSize: '14px' }}>kg/mo</span></p>
              </div>
              <div style={{ flex: '1', backgroundColor: '#18181b', border: '1px solid #27272a', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#a1a1aa' }}>Annual Estimate</p>
                <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: '#22c55e' }}>{stats.annual.toFixed(2)} <span style={{ fontSize: '14px' }}>tons/yr</span></p>
              </div>
              <div style={{ flex: '1', backgroundColor: '#18181b', border: '1px solid #27272a', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#a1a1aa' }}>Carbon Rating</p>
                <p style={{ margin: '0', fontSize: '20px', fontWeight: 'bold', color: getScoreColor(stats.score) }}>{getScoreEmoji(stats.score)} {stats.score}</p>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', color: '#a1a1aa', margin: '0 0 12px 0' }}>Emission Category Breakdown</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ffffff' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #27272a', textAlign: 'left' }}>
                  <th style={{ padding: '8px 0', color: '#a1a1aa', fontSize: '14px' }}>Category</th>
                  <th style={{ padding: '8px 0', textAlign: 'right', color: '#a1a1aa', fontSize: '14px' }}>Emissions (kg CO₂/mo)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #18181b' }}>
                  <td style={{ padding: '10px 0', fontSize: '14px' }}>Transport</td>
                  <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 'bold', fontSize: '14px' }}>{stats.breakdown.transport.toFixed(1)}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #18181b' }}>
                  <td style={{ padding: '10px 0', fontSize: '14px' }}>Energy</td>
                  <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 'bold', fontSize: '14px' }}>{stats.breakdown.energy.toFixed(1)}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #18181b' }}>
                  <td style={{ padding: '10px 0', fontSize: '14px' }}>Diet</td>
                  <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 'bold', fontSize: '14px' }}>{stats.breakdown.diet.toFixed(1)}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #18181b' }}>
                  <td style={{ padding: '10px 0', fontSize: '14px' }}>Lifestyle</td>
                  <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 'bold', fontSize: '14px' }}>{stats.breakdown.lifestyle.toFixed(1)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', color: '#a1a1aa', margin: '0 0 12px 0' }}>Top AI-Recommended Action Tips</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {aiTips.slice(0, 3).map((tip, idx) => (
                <div key={idx} style={{ backgroundColor: '#18181b', borderLeft: '4px solid #22c55e', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff' }}>{tip.icon} {tip.title}</span>
                    <span style={{ fontSize: '11px', backgroundColor: '#22c55e20', color: '#22c55e', padding: '1px 6px', borderRadius: '10px', fontWeight: 'bold' }}>Savings: {tip.co2Savings} kg/yr</span>
                  </div>
                  <p style={{ margin: '0', fontSize: '12px', color: '#a1a1aa', lineHeight: '1.4' }}>{tip.description}</p>
                </div>
              ))}
              {aiTips.length === 0 && (
                <p style={{ margin: '0', fontSize: '13px', color: '#a1a1aa' }}>No insights available. Complete more logs to trigger AI tips.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
