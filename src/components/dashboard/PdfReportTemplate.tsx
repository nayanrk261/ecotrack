/**
 * @file PdfReportTemplate.tsx
 * @description Hidden HTML template rendered as the source layout for PDF export reports.
 */

import type { SavedFootprint } from '../../types';
import { generateInsights } from '../../lib/insights';

interface PdfReportTemplateProps {
  stats: {
    monthly: number;
    annual: number;
    score: string;
  };
  latest: SavedFootprint;
}

export default function PdfReportTemplate({ stats, latest }: PdfReportTemplateProps) {
  const pdfTips = generateInsights(latest.result.breakdown, latest.result.totalMonthly).slice(0, 3);

  return (
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
            <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#a1a1aa' }}>Annual Projection</p>
            <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: '#22c55e' }}>{stats.annual.toFixed(2)} <span style={{ fontSize: '14px' }}>tons/yr</span></p>
          </div>
          <div style={{ flex: '1', backgroundColor: '#18181b', border: '1px solid #27272a', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#a1a1aa' }}>Score Level</p>
            <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}>{stats.score}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
        <div style={{ flex: '1.2' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', color: '#a1a1aa', margin: '0 0 12px 0' }}>Emissions Breakdown</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                { label: 'Transportation', value: latest.result.breakdown.transport },
                { label: 'Home Energy', value: latest.result.breakdown.energy },
                { label: 'Diet Habits', value: latest.result.breakdown.diet },
                { label: 'Lifestyle & Shopping', value: latest.result.breakdown.lifestyle }
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #27272a' }}>
                  <td style={{ padding: '10px 0', fontSize: '14px', color: '#e4e4e7' }}>{row.label}</td>
                  <td style={{ padding: '10px 0', fontSize: '14px', fontWeight: 'bold', textAlign: 'right', color: '#ffffff' }}>{row.value.toFixed(1)} kg CO₂</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ flex: '1', backgroundColor: '#18181b', border: '1px solid #27272a', padding: '20px', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', color: '#22c55e', margin: '0 0 15px 0' }}>Top Action Recommendations</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {pdfTips.map((tip, idx) => (
              <div key={idx} style={{ borderLeft: '3px solid #22c55e', paddingLeft: '10px' }}>
                <p style={{ margin: '0 0 3px 0', fontSize: '14px', fontWeight: 'bold', color: '#ffffff' }}>{tip.icon} {tip.title}</p>
                <p style={{ margin: '0', fontSize: '11px', color: '#a1a1aa', lineHeight: '1.4' }}>{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #27272a', paddingTop: '20px', textAlign: 'center' }}>
        <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#a1a1aa' }}>EcoTrack Carbon Tracker &bull; Privacy-first Footprint Metrics</p>
        <p style={{ margin: '0', fontSize: '10px', color: '#71717a' }}>This report is generated locally inside the browser. No personal data was uploaded to any server.</p>
      </div>
    </div>
  );
}
