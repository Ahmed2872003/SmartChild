import { Activity, TrendingUp, Brain, Zap, Palette, Ear, Lightbulb } from 'lucide-react';
import {
  ColorChartVisual,
  HearingChartVisual,
  MemoryChartVisual,
  MiniLineChart,
  ReactionChartVisual,
  IqChartVisual,
} from '@/components/charts/Charts';

const UI_CONFIG = {
  memory: {
    title: 'Memory Match',
    icon: Brain,
    color: 'bg-green-500',
    textColor: 'text-green-500',
    insight:
      'The blue bars show accuracy in finding pairs. Watch the orange line—if it goes down while the blue bars stay high, the child is getting faster and remembering pairs automatically!',
  },
  reaction: {
    title: 'Reaction Speed',
    icon: Zap,
    color: 'bg-red-500',
    textColor: 'text-red-500',
    insight:
      'A downward orange line is great—it means the child is reacting faster! The blue bars show accuracy, helping us see if they are focused.',
  },
  color: {
    title: 'Color Recognition',
    icon: Palette,
    color: 'bg-blue-500',
    textColor: 'text-blue-500',
    insight:
      'The triangle chart shows how well the child spots different colors. If it looks balanced, color vision is great! If one corner is pulled in, they might need practice with that specific color.',
  },
  hearing: {
    title: 'Hearing Test',
    icon: Ear,
    color: 'bg-purple-500',
    textColor: 'text-purple-500',
    insight:
      'Kids often get the sounds right easily, shown by the blue bars. The orange line is the real clue—a downward trend means the child is recognizing the sounds faster and with less effort!',
  },
  iq: {
    title: 'IQ & Logic',
    icon: Lightbulb,
    color: 'bg-orange-500',
    textColor: 'text-orange-500',
    insight:
      'The blue bars track correct answers. Keep an eye on the orange line—if it trends downward while the blue bars stay high, the child is thinking through complex logic much faster!',
  },
};

const ProgressSection = ({ reportsData }) => {
  // Extract real data safely
  const reportData = reportsData?.overallReport || {};
  const dailyReports = reportData?.dailyReports || [];
  const radar = reportData?.color_radar_profile || { red: 0, green: 0, blue: 0 };

  // Map backend JSON to the format charts expect
  const formattedData = {
    memory: {
      ...UI_CONFIG.memory,
      history: dailyReports.map((r) => ({
        ar: r.memory?.averageAccuracy || 0,
        arl: (r.memory?.averageSpeedMs || 0) / 1000,
        difficulty: r.memory?.overallDifficulty || null,
      })),
    },
    reaction: {
      ...UI_CONFIG.reaction,
      history: dailyReports.map((r) => ({
        mrt: (r.reactionSpeed?.averageSpeedMs || 0) / 1000,
        pi: r.reactionSpeed?.averageAccuracy || 0,
        difficulty: r.reactionSpeed?.overallDifficulty || null,
      })),
    },
    color: {
      ...UI_CONFIG.color,
      history: dailyReports.map((r) => ({
        accuracy: r.colorExplore?.averageAccuracy || 0,
        difficulty: r.colorExplore?.overallDifficulty || null,
      })),
      rgbProfile: { r: radar.red, g: radar.green, b: radar.blue },
    },
    hearing: {
      ...UI_CONFIG.hearing,
      history: dailyReports.map((r) => ({
        isr: r.hearing?.averageAccuracy || 0,
        aarl: (r.hearing?.averageSpeedMs || 0) / 1000,
        difficulty: r.hearing?.overallDifficulty || null,
      })),
    },
    iq: {
      ...UI_CONFIG.iq,
      history: dailyReports.map((r) => ({
        accuracy: r.iq?.averageAccuracy || 0,
        speed: (r.iq?.averageSpeedMs || 0) / 1000,
        difficulty: r.iq?.overallDifficulty || null,
      })),
    },
  };

  const renderChart = (key, data) => {
    switch (key) {
      case 'memory':
        return <MemoryChartVisual rtVisual data={data.history} />;
      case 'reaction':
        return <ReactionChartVisual data={data.history} />;
      case 'color':
        return <ColorChartVisual history={data.history} rgb={data.rgbProfile} />;
      case 'hearing':
        return <HearingChartVisual data={data.history} />;
      case 'iq':
        return <IqChartVisual data={data.history} />;
      default:
        return <MiniLineChart data={data.history} colorClass={data.textColor} />;
    }
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
        <TrendingUp size={24} className="text-blue-500" /> General Progress (Last 5 Sessions)
      </h2>

      {/* {!dailyReports?.length ? ( */}
      {/* <p className="p-8 text-center text-gray-500 font-bold">No progress.</p> */}
      {/* ) : ( */}
      <>
        <div className="bg-blue-50 p-5 rounded-2xl mb-6 border border-blue-100 text-blue-900">
          <h3 className="font-black text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
            <Activity size={16} className="text-blue-500" /> General System Recommendation
          </h3>
          <p className="text-sm font-medium leading-relaxed">
            {reportData.overall_system_recommendation || 'No recommendation available yet.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(formattedData).map(([key, data]) => {
            const Icon = data.icon;

            return (
              <div
                key={key}
                className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col h-full print:break-inside-avoid"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`w-12 h-12 rounded-2xl ${data.color} flex items-center justify-center text-white shadow-sm`}
                  >
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">{data.title}</h3>
                    <p className="text-xs font-bold text-gray-400 flex items-center gap-1 uppercase tracking-wider">
                      Metrics & Trends
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 min-h-[180px] rounded-xl p-5 relative flex-none mb-6">
                  {renderChart(key, data)}
                </div>
                <div className="mt-auto p-4 bg-blue-50/50 rounded-xl text-sm text-gray-700 font-medium leading-relaxed border border-blue-100/50">
                  <strong className="text-blue-900 block mb-1 flex items-center gap-1.5">
                    <Activity size={16} /> Insight:
                  </strong>
                  {data.insight}
                </div>
              </div>
            );
          })}
        </div>
      </>
      {/* )} */}
    </section>
  );
};

export default ProgressSection;
