/**
 * Lightweight inline-SVG bar chart. No charting library dependency —
 * consistent with the animated-SVG-bar-chart approach used elsewhere
 * in this project.
 *
 * data: [{ label: string, value: number, color?: string }]
 */
export function BarChart({ data, height = 180, valueFormatter = (v) => v }) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.value), 1);
  const barGap = 12;
  const barWidth = 100 / data.length;

  return (
    <div style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${data.length * 60} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="none"
        role="img"
        aria-label="Bar chart"
      >
        {data.map((d, i) => {
          const barHeight = (d.value / max) * (height - 36);
          const x = i * 60 + barGap / 2;
          const barW = 60 - barGap;
          const y = height - barHeight - 20;
          return (
            <g key={d.label}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barHeight}
                rx={3}
                fill={d.color || 'var(--surface-tint)'}
                style={{
                  transformOrigin: `${x + barW / 2}px ${height - 20}px`,
                  animation: 'bar-grow 0.5s ease-out',
                }}
              />
              <text
                x={x + barW / 2}
                y={y - 6}
                textAnchor="middle"
                fontSize="11"
                fontFamily="var(--font-mono)"
                fill="var(--on-surface)"
              >
                {valueFormatter(d.value)}
              </text>
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', marginTop: 4 }}>
        {data.map((d) => (
          <div
            key={d.label}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 10,
              color: 'var(--on-surface-variant)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              padding: '0 2px',
            }}
            title={d.label}
          >
            {d.label}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes bar-grow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}