/**
 * @file Dashboard.tsx
 * @description Orchestrates the personal carbon tracker dashboard.
 * Renders statistical summary panels, historical charts, comparisons, and exposes PDF export features.
 */

import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, FileDown, Trash2 } from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { generateInsights } from '../lib/insights';
import { ROUTES, COLORS, PDF_CONFIG } from '../lib/constants';

import DashboardStats from '../components/dashboard/DashboardStats';
import DashboardHistory from '../components/dashboard/DashboardHistory';
import LeaderboardSection from '../components/dashboard/LeaderboardSection';

// ── Heavy chart dependency: loaded lazily so chart.js stays out of the
//    initial Dashboard chunk and is only fetched when the page mounts. ──────
const DashboardCharts = lazy(
  () => import('../components/dashboard/DashboardCharts')
);

function ChartsFallback() {
  return (
    <div
      style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      role="status"
      aria-label="Loading charts…"
    >
      <div className="page-spinner" />
    </div>
  );
}

export default function Dashboard() {
  const { locale, t } = useLanguage();
  const {
    footprints,
    latest,
    stats,
    handleClearData,
    handleDownloadReport,
  } = useDashboardStats();

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
            <Link to={ROUTES.calculator} className="btn btn-primary btn-lg text-decoration-none">
              <Calculator size={20} />
              {t('calcFootprintBtn')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Generate top tips for PDF Report
  const pdfTips = generateInsights(latest.result.breakdown, latest.result.totalMonthly).slice(0, PDF_CONFIG.tipLimit);

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

        {/* stats section */}
        <DashboardStats stats={stats} />

        {/* charts section — loaded lazily so chart.js is a separate async chunk */}
        <Suspense fallback={<ChartsFallback />}>
          <DashboardCharts footprints={footprints} stats={stats} />
        </Suspense>

        {/* history and leaderboard section */}
        <div className="charts-grid mt-8">
          <DashboardHistory footprints={footprints} />
          <LeaderboardSection userFootprint={stats.monthly} />
        </div>

        {/* Settings Card */}
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
            left: PDF_CONFIG.hiddenOffset,
            top: PDF_CONFIG.hiddenOffset,
            width: '800px',
            backgroundColor: COLORS.bgDark,
            color: COLORS.textLight,
            padding: '40px',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${COLORS.primaryGreen}`, paddingBottom: '20px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '32px' }}>🌿</span>
              <span style={{ fontSize: '28px', fontWeight: 'bold', letterSpacing: '1px', color: COLORS.primaryGreen }}>EcoTrack Report</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0', fontSize: '12px', color: COLORS.textMuted }}>Generated on:</p>
              <p style={{ margin: '0', fontSize: '15px', fontWeight: 'bold', color: COLORS.textLight }}>{new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', color: COLORS.textMuted, margin: '0 0 12px 0' }}>Carbon Footprint Summary</h2>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: '1', backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.borderDark}`, padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: COLORS.textMuted }}>Monthly Footprint</p>
                <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: COLORS.primaryGreen }}>{stats.monthly.toFixed(1)} <span style={{ fontSize: '14px' }}>kg/mo</span></p>
              </div>
              <div style={{ flex: '1', backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.borderDark}`, padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: COLORS.textMuted }}>Annual Projection</p>
                <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: COLORS.primaryGreen }}>{stats.annual.toFixed(2)} <span style={{ fontSize: '14px' }}>tons/yr</span></p>
              </div>
              <div style={{ flex: '1', backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.borderDark}`, padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: COLORS.textMuted }}>Score Level</p>
                <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: COLORS.blueScore }}>{stats.score}</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
            <div style={{ flex: '1.2' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', color: COLORS.textMuted, margin: '0 0 12px 0' }}>Emissions Breakdown</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {[
                    { label: 'Transportation', value: latest.result.breakdown.transport },
                    { label: 'Home Energy', value: latest.result.breakdown.energy },
                    { label: 'Diet Habits', value: latest.result.breakdown.diet },
                    { label: 'Lifestyle & Shopping', value: latest.result.breakdown.lifestyle }
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${COLORS.borderDark}` }}>
                      <td style={{ padding: '10px 0', fontSize: '14px', color: COLORS.textPrimary }}>{row.label}</td>
                      <td style={{ padding: '10px 0', fontSize: '14px', fontWeight: 'bold', textAlign: 'right', color: COLORS.textLight }}>{row.value.toFixed(1)} kg CO₂</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ flex: '1', backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.borderDark}`, padding: '20px', borderRadius: '12px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', color: COLORS.primaryGreen, margin: '0 0 15px 0' }}>Top Action Recommendations</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {pdfTips.map((tip, idx) => (
                  <div key={idx} style={{ borderLeft: `3px solid ${COLORS.primaryGreen}`, paddingLeft: '10px' }}>
                    <p style={{ margin: '0 0 3px 0', fontSize: '14px', fontWeight: 'bold', color: COLORS.textLight }}>{tip.icon} {tip.title}</p>
                    <p style={{ margin: '0', fontSize: '11px', color: COLORS.textMuted, lineHeight: '1.4' }}>{tip.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${COLORS.borderDark}`, paddingTop: '20px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: COLORS.textMuted }}>EcoTrack Carbon Tracker &bull; Privacy-first Footprint Metrics</p>
            <p style={{ margin: '0', fontSize: '10px', color: COLORS.textGray }}>This report is generated locally inside the browser. No personal data was uploaded to any server.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

