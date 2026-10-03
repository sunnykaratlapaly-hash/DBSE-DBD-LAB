import React, { useState } from 'react';

// Responsive SVG Area Chart
export const AreaChart = ({ data = [], height = 220, color = '#0284c7' }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data.length) return null;

  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 600;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map((d) => d.value)) * 1.15 || 100;
  const minVal = 0;

  const getX = (index) => padding.left + (index / (data.length - 1)) * chartWidth;
  const getY = (val) => padding.top + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;

  // Generate SVG path
  const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`);
  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `${linePath} L ${getX(data.length - 1)},${padding.top + chartHeight} L ${getX(0)},${padding.top + chartHeight} Z`;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding.top + chartHeight * (1 - ratio);
          const val = Math.round(minVal + (maxVal - minVal) * ratio);
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="#94a3b8"
                fontFamily="sans-serif"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Shaded Area */}
        <path d={areaPath} fill="url(#areaGradient)" />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points & X axis labels */}
        {data.map((d, i) => {
          const x = getX(i);
          const y = getY(d.value);
          const isHovered = hoveredIdx === i;

          return (
            <g key={i} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
              {/* Bottom label */}
              <text
                x={x}
                y={height - 8}
                textAnchor="middle"
                fontSize="11"
                fill="#64748b"
                fontWeight="500"
              >
                {d.label}
              </text>

              {/* Point Circle */}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 6 : 4}
                fill="#ffffff"
                stroke={color}
                strokeWidth={isHovered ? 3 : 2}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              />

              {/* Tooltip on hover */}
              {isHovered && (
                <g>
                  <rect
                    x={x - 36}
                    y={y - 32}
                    width="72"
                    height="24"
                    rx="4"
                    fill="#0f172a"
                  />
                  <text
                    x={x}
                    y={y - 16}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    {d.value}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Responsive SVG Bar Chart
export const BarChart = ({ data = [], height = 220, color = '#0ea5e9' }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  if (!data.length) return null;

  const padding = { top: 20, right: 20, bottom: 35, left: 45 };
  const width = 600;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map((d) => d.value)) * 1.15 || 100;
  const barWidth = Math.min(36, (chartWidth / data.length) * 0.55);

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {/* Horizontal grid lines */}
        {[0, 0.33, 0.66, 1].map((ratio, i) => {
          const y = padding.top + chartHeight * (1 - ratio);
          const val = Math.round(maxVal * ratio);
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="#94a3b8"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const slotWidth = chartWidth / data.length;
          const x = padding.left + i * slotWidth + (slotWidth - barWidth) / 2;
          const barHeight = (d.value / maxVal) * chartHeight;
          const y = padding.top + chartHeight - barHeight;
          const isHovered = hoveredIdx === i;

          return (
            <g
              key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="4"
                fill={isHovered ? '#0284c7' : (d.color || color)}
                style={{ transition: 'fill 0.2s' }}
              />

              {/* Label */}
              <text
                x={x + barWidth / 2}
                y={height - 12}
                textAnchor="middle"
                fontSize="10"
                fill="#64748b"
                fontWeight="500"
              >
                {d.label}
              </text>

              {/* Hover Value */}
              {isHovered && (
                <g>
                  <rect
                    x={x + barWidth / 2 - 28}
                    y={y - 28}
                    width="56"
                    height="22"
                    rx="4"
                    fill="#0f172a"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={y - 13}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {d.value}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Responsive SVG Donut Chart
export const DonutChart = ({ data = [], size = 180, strokeWidth = 24 }) => {
  const total = data.reduce((acc, d) => acc + d.value, 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((d, i) => {
          const ratio = d.value / total;
          const strokeDasharray = `${ratio * circumference} ${circumference}`;
          const strokeDashoffset = -accumulated * circumference;
          accumulated += ratio;

          return (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke={d.color || '#0ea5e9'}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: `${center}px ${center}px`,
                transition: 'stroke-dasharray 0.3s'
              }}
            />
          );
        })}
        <text
          x={center}
          y={center - 4}
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fill="#0f172a"
        >
          {total}
        </text>
        <text
          x={center}
          y={center + 14}
          textAnchor="middle"
          fontSize="10"
          fill="#64748b"
          style={{ textTransform: 'uppercase' }}
        >
          Total
        </text>
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: d.color || '#0ea5e9'
              }}
            />
            <span style={{ color: '#475569', minWidth: '90px' }}>{d.label}</span>
            <span style={{ fontWeight: '600', color: '#0f172a' }}>{d.value}</span>
            <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
              ({Math.round((d.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
