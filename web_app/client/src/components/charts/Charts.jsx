import { DifficultyLabel } from '../common/DifficultyLabel';

// Helper to center the dot if only 1 data point exists
const getX = (i, len, span, offset = 0) => (len <= 1 ? span / 2 + offset : (i / (len - 1)) * span + offset);

const MiniLineChart = ({ data, colorClass }) => {
  const max = Math.max(...data) * 1.1;
  const min = 0;
  const range = max - min || 1;
  const points = data.map((val, i) => `${getX(i, data.length, 200)},${100 - ((val - min) / range) * 100}`).join(' ');

  return (
    <div className="w-full aspect-[4/1] relative">
      <svg viewBox="0 -10 200 120" className="absolute inset-0 w-full h-full overflow-visible block">
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className={colorClass}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((val, i) => (
          <circle
            key={i}
            cx={getX(i, data.length, 200)}
            cy={100 - ((val - min) / range) * 100}
            r="4"
            fill="white"
            stroke="currentColor"
            strokeWidth="2"
            className={colorClass}
          />
        ))}
      </svg>
    </div>
  );
};

const MemoryChartVisual = ({ data }) => {
  const maxArl = Math.ceil(Math.max(5, ...data.map((d) => d.arl || 0)));
  const barW = 10;
  const arlPoints = data.map((d, i) => `${getX(i, data.length, 180, 10)},${100 - (d.arl / maxArl) * 100}`).join(' ');

  return (
    // Increased pt-2 to pt-5 to make room for text labels
    <div className="w-full relative pt-5 pb-8">
      <div className="absolute left-0 top-5 bottom-8 flex flex-col justify-between text-[9px] font-black text-[#3b82f6] z-10">
        <span>100%</span>
        <span>0%</span>
      </div>
      <div className="absolute right-0 top-5 bottom-8 flex flex-col justify-between text-[9px] font-black text-[#f97316] z-10 items-end">
        <span>{maxArl}s</span>
        <span>0s</span>
      </div>
      <div className="w-full px-8">
        <div className="w-full aspect-[2/1] relative">
          <svg viewBox="0 0 200 100" className="absolute inset-0 w-full h-full overflow-visible block">
            {/* Accuracy Bars & Labels */}
            {data.map((d, i) => {
              const x = getX(i, data.length, 180, 10);
              const h = d.ar;
              return (
                <g key={`bar-group-${i}`}>
                  <rect x={x - barW / 2} y={100 - h} width={barW} height={h} fill="#93c5fd" rx="2" opacity="0.8" />
                  <DifficultyLabel x={x} y={100 - h - 5} difficulty={d.difficulty} />
                </g>
              );
            })}
            {/* Speed Line */}
            <polyline
              points={arlPoints}
              fill="none"
              stroke="#f97316"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {data.map((d, i) => {
              const x = getX(i, data.length, 180, 10);
              return (
                <circle
                  key={`dot-${i}`}
                  cx={x}
                  cy={100 - (d.arl / maxArl) * 100}
                  r="3"
                  fill="#f97316"
                  stroke="white"
                  strokeWidth="1.5"
                />
              );
            })}
          </svg>
        </div>
      </div>
      <div className="absolute bottom-0 w-full flex justify-center gap-4 text-[9px] font-bold">
        <span className="text-[#3b82f6] flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#93c5fd] inline-block"></span> Accuracy (AR)
        </span>
        <span className="text-[#f97316] flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#f97316] inline-block"></span> Latency (ARL)
        </span>
      </div>
    </div>
  );
};

const ReactionChartVisual = ({ data }) => {
  const maxMrt = Math.ceil(Math.max(2, ...data.map((d) => d.mrt || 0)));
  const barW = 10;
  const mrtPoints = data.map((d, i) => `${getX(i, data.length, 180, 10)},${100 - (d.mrt / maxMrt) * 100}`).join(' ');

  return (
    <div className="w-full relative pt-5 pb-8">
      <div className="absolute left-0 top-5 bottom-8 flex flex-col justify-between text-[9px] font-black text-[#3b82f6] z-10">
        <span>100%</span>
        <span>0%</span>
      </div>
      <div className="absolute right-0 top-5 bottom-8 flex flex-col justify-between text-[9px] font-black text-[#f97316] z-10 items-end">
        <span>{maxMrt}s</span>
        <span>0s</span>
      </div>
      <div className="w-full px-8">
        <div className="w-full aspect-[2/1] relative">
          <svg viewBox="0 0 200 100" className="absolute inset-0 w-full h-full overflow-visible block">
            {/* Accuracy Bars & Labels */}
            {data.map((d, i) => {
              const x = getX(i, data.length, 180, 10);
              const h = d.pi;
              return (
                <g key={`bar-group-${i}`}>
                  <rect x={x - barW / 2} y={100 - h} width={barW} height={h} fill="#93c5fd" rx="2" opacity="0.8" />
                  <DifficultyLabel x={x} y={100 - h - 5} difficulty={d.difficulty} />
                </g>
              );
            })}
            {/* Speed Line */}
            <polyline
              points={mrtPoints}
              fill="none"
              stroke="#f97316"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {data.map((d, i) => {
              const x = getX(i, data.length, 180, 10);
              return (
                <circle
                  key={`dot-${i}`}
                  cx={x}
                  cy={100 - (d.mrt / maxMrt) * 100}
                  r="3"
                  fill="#f97316"
                  stroke="white"
                  strokeWidth="1.5"
                />
              );
            })}
          </svg>
        </div>
      </div>
      <div className="absolute bottom-0 w-full flex justify-center gap-4 text-[9px] font-bold">
        <span className="text-[#3b82f6] flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#93c5fd] inline-block"></span> Precision (PI)
        </span>
        <span className="text-[#f97316] flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#f97316] inline-block"></span> Mean Response (MRT)
        </span>
      </div>
    </div>
  );
};

const ColorChartVisual = ({ history, rgb }) => {
  const barW = 10;
  const rad = Math.PI / 180;
  const getPt = (val, angle) => {
    const r = 35 * (val / 100);
    return `${50 + r * Math.sin(angle * rad)},${50 - r * Math.cos(angle * rad)}`;
  };
  const radarPts = `${getPt(rgb.r || 0, 0)} ${getPt(rgb.g || 0, 120)} ${getPt(rgb.b || 0, 240)}`;
  const radarBg = `${getPt(100, 0)} ${getPt(100, 120)} ${getPt(100, 240)}`;

  return (
    <div className="w-full relative pt-5 pb-8 flex items-center gap-2">
      <div className="flex-[5] relative border-r border-gray-200 pr-4">
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[9px] font-black text-[#3b82f6] z-10">
          <span>100%</span>
          <span>0%</span>
        </div>
        <div className="w-full pl-8">
          <div className="w-full aspect-[2/1] relative">
            <svg viewBox="0 0 200 100" className="absolute inset-0 w-full h-full overflow-visible block">
              {/* Accuracy Bars & Labels */}
              {history.map((val, i) => {
                const x = getX(i, history.length, 180, 10);
                const h = val.accuracy;
                return (
                  <g key={`bar-group-${i}`}>
                    <rect x={x - barW / 2} y={100 - h} width={barW} height={h} fill="#93c5fd" rx="2" opacity="0.8" />
                    <DifficultyLabel x={x} y={100 - h - 5} difficulty={val.difficulty} />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
      <div className="flex-[2] flex justify-center px-2">
        <div className="w-full max-w-[90px] aspect-square relative">
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible block">
            <polygon points={radarBg} fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
            <line x1="50" y1="50" x2={getPt(100, 0).split(',')[0]} y2={getPt(100, 0).split(',')[1]} stroke="#e5e7eb" />
            <line
              x1="50"
              y1="50"
              x2={getPt(100, 120).split(',')[0]}
              y2={getPt(100, 120).split(',')[1]}
              stroke="#e5e7eb"
            />
            <line
              x1="50"
              y1="50"
              x2={getPt(100, 240).split(',')[0]}
              y2={getPt(100, 240).split(',')[1]}
              stroke="#e5e7eb"
            />
            <polygon
              points={radarPts}
              fill="rgba(59, 130, 246, 0.5)"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <text x="50" y="8" fontSize="10" textAnchor="middle" fill="#ef4444" fontWeight="black">
              R
            </text>
            <text x="92" y="80" fontSize="10" textAnchor="middle" fill="#22c55e" fontWeight="black">
              G
            </text>
            <text x="8" y="80" fontSize="10" textAnchor="middle" fill="#3b82f6" fontWeight="black">
              B
            </text>
          </svg>
        </div>
      </div>
      <div className="absolute bottom-0 w-full flex justify-between px-8 text-[9px] font-bold text-gray-500">
        <span className="text-[#3b82f6] flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#93c5fd] inline-block"></span> Accuracy
        </span>
        <span>RGB Profile Radar</span>
      </div>
    </div>
  );
};

const HearingChartVisual = ({ data }) => {
  const maxAarl = Math.ceil(Math.max(5, ...data.map((d) => d.aarl || 0)));
  const barW = 10;
  const latencyPoints = data
    .map((d, i) => `${getX(i, data.length, 180, 10)},${100 - (d.aarl / maxAarl) * 100}`)
    .join(' ');

  return (
    <div className="w-full relative pt-5 pb-8">
      <div className="absolute left-0 top-5 bottom-8 flex flex-col justify-between text-[9px] font-black text-[#3b82f6] z-10">
        <span>100%</span>
        <span>0%</span>
      </div>
      <div className="absolute right-0 top-5 bottom-8 flex flex-col justify-between text-[9px] font-black text-[#f97316] z-10 items-end">
        <span>{maxAarl}s</span>
        <span>0s</span>
      </div>
      <div className="w-full px-8">
        <div className="w-full aspect-[2/1] relative">
          <svg viewBox="0 0 200 100" className="absolute inset-0 w-full h-full overflow-visible block">
            {/* Accuracy Bars & Labels */}
            {data.map((d, i) => {
              const x = getX(i, data.length, 180, 10);
              const h = d.isr;
              return (
                <g key={`bar-group-${i}`}>
                  <rect x={x - barW / 2} y={100 - h} width={barW} height={h} fill="#93c5fd" rx="2" opacity="0.8" />
                  <DifficultyLabel x={x} y={100 - h - 5} difficulty={d.difficulty} />
                </g>
              );
            })}
            {/* Speed Line */}
            <polyline
              points={latencyPoints}
              fill="none"
              stroke="#f97316"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {data.map((d, i) => {
              const x = getX(i, data.length, 180, 10);
              return (
                <circle
                  key={`dot-${i}`}
                  cx={x}
                  cy={100 - (d.aarl / maxAarl) * 100}
                  r="3"
                  fill="#f97316"
                  stroke="white"
                  strokeWidth="1.5"
                />
              );
            })}
          </svg>
        </div>
      </div>
      <div className="absolute bottom-0 w-full flex justify-center gap-4 text-[9px] font-bold">
        <span className="text-[#3b82f6] flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#93c5fd] inline-block"></span> Success Rate (ISR)
        </span>
        <span className="text-[#f97316] flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#f97316] inline-block"></span> Latency (AARL)
        </span>
      </div>
    </div>
  );
};

const IqChartVisual = ({ data }) => {
  const maxSpeed = Math.ceil(Math.max(5, ...data.map((d) => d.speed || 0)));
  const barW = 10;
  const speedPoints = data
    .map((d, i) => `${getX(i, data.length, 180, 10)},${100 - (d.speed / maxSpeed) * 100}`)
    .join(' ');

  return (
    <div className="w-full relative pt-5 pb-8">
      <div className="absolute left-0 top-5 bottom-8 flex flex-col justify-between text-[9px] font-black text-[#3b82f6] z-10">
        <span>100%</span>
        <span>0%</span>
      </div>
      <div className="absolute right-0 top-5 bottom-8 flex flex-col justify-between text-[9px] font-black text-[#f97316] z-10 items-end">
        <span>{maxSpeed}s</span>
        <span>0s</span>
      </div>
      <div className="w-full px-8">
        <div className="w-full aspect-[2/1] relative">
          <svg viewBox="0 0 200 100" className="absolute inset-0 w-full h-full overflow-visible block">
            {/* Accuracy Bars & Labels */}
            {data.map((d, i) => {
              const x = getX(i, data.length, 180, 10);
              const h = d.accuracy;
              return (
                <g key={`bar-group-${i}`}>
                  <rect x={x - barW / 2} y={100 - h} width={barW} height={h} fill="#93c5fd" rx="2" opacity="0.8" />
                  <DifficultyLabel x={x} y={100 - h - 5} difficulty={d.difficulty} />
                </g>
              );
            })}
            {/* Speed Line */}
            <polyline
              points={speedPoints}
              fill="none"
              stroke="#f97316"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {data.map((d, i) => {
              const x = getX(i, data.length, 180, 10);
              return (
                <circle
                  key={`dot-${i}`}
                  cx={x}
                  cy={100 - (d.speed / maxSpeed) * 100}
                  r="3"
                  fill="#f97316"
                  stroke="white"
                  strokeWidth="1.5"
                />
              );
            })}
          </svg>
        </div>
      </div>
      <div className="absolute bottom-0 w-full flex justify-center gap-4 text-[9px] font-bold">
        <span className="text-[#3b82f6] flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#93c5fd] inline-block"></span> Accuracy
        </span>
        <span className="text-[#f97316] flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#f97316] inline-block"></span> Avg Speed
        </span>
      </div>
    </div>
  );
};

export { MiniLineChart, MemoryChartVisual, ReactionChartVisual, ColorChartVisual, HearingChartVisual, IqChartVisual };
