import React from 'react';
import { LucideIcon } from 'lucide-react';
import { UiMode } from '../../types';

export interface PageStat {
  label: string;
  value: string | number;
  subtext?: string;
  isHighlight?: boolean;
}

interface PageHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
  icon: LucideIcon;
  stats?: PageStat[];
  actions?: React.ReactNode;
  classicGradient?: string;
  uiMode?: UiMode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  icon: Icon,
  stats = [],
  actions,
  classicGradient = 'from-blue-700 via-indigo-700 to-indigo-900',
  uiMode = 'apple'
}) => {
  const isMinimal = uiMode === 'apple';

  // 1. CLEAN MINIMAL STANDARD UI
  if (isMinimal) {
    return (
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 border border-slate-200">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {title}
                </h1>
                {badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            </div>
          </div>

          {actions && (
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              {actions}
            </div>
          )}
        </div>

        {/* Clean Minimal KPI Stat Grid */}
        {stats.length > 0 && (
          <div className={`grid grid-cols-2 ${stats.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-4'} gap-3 pt-4 border-t border-slate-100`}>
            {stats.map((s, idx) => (
              <div key={idx} className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{s.label}</p>
                <p className={`text-lg sm:text-xl font-bold mt-0.5 ${s.isHighlight ? 'text-rose-600' : 'text-slate-900'}`}>
                  {s.value}
                </p>
                {s.subtext && (
                  <p className="text-[10px] text-slate-400 mt-0.5">{s.subtext}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 2. CLASSIC RICH GRADIENT UI
  return (
    <div className={`bg-gradient-to-r ${classicGradient} rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          {badge && (
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-3">
              <Icon className="w-3.5 h-3.5" />
              <span>{badge}</span>
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{title}</h1>
          <p className="text-white/80 text-sm mt-1 max-w-xl">{subtitle}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {stats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-black/25 p-4 rounded-2xl backdrop-blur-md border border-white/10">
              {stats.map((s, idx) => (
                <div key={idx}>
                  <p className="text-xs text-white/70 uppercase font-semibold">{s.label}</p>
                  <p className={`text-xl sm:text-2xl font-black mt-0.5 ${s.isHighlight ? 'text-rose-300' : 'text-white'}`}>
                    {s.value}
                  </p>
                  {s.subtext && (
                    <p className="text-[10px] text-white/60">{s.subtext}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {actions && (
            <div className="flex items-center gap-2 self-start md:self-auto">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
