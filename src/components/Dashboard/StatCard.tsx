import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'blue' | 'green' | 'orange' | 'purple' | 'emerald' | 'violet' | 'amber';
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color }) => {
  const colorStyles = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      accent: 'border-blue-200',
      hover: 'hover:border-blue-300 hover:shadow-blue-100'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      accent: 'border-green-200',
      hover: 'hover:border-green-300 hover:shadow-green-100'
    },
    emerald: {
      bg: 'bg-emerald-50',
      icon: 'text-emerald-600',
      accent: 'border-emerald-200',
      hover: 'hover:border-emerald-300 hover:shadow-emerald-100'
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'text-orange-600',
      accent: 'border-orange-200',
      hover: 'hover:border-orange-300 hover:shadow-orange-100'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      accent: 'border-purple-200',
      hover: 'hover:border-purple-300 hover:shadow-purple-100'
    },
    violet: {
      bg: 'bg-violet-50',
      icon: 'text-violet-600',
      accent: 'border-violet-200',
      hover: 'hover:border-violet-300 hover:shadow-violet-100'
    },
    amber: {
      bg: 'bg-amber-50',
      icon: 'text-amber-600',
      accent: 'border-amber-200',
      hover: 'hover:border-amber-300 hover:shadow-amber-100'
    }
  };

  return (
    <div className={`card card-interactive p-6 group animate-fade-in border-2 ${colorStyles[color].accent} ${colorStyles[color].hover}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wider">{title}</p>
          <p className="text-4xl font-black text-gray-900 mb-4 tracking-tight">{value}</p>
          {trend && (
            <div className={`status ${
              trend.isPositive 
                ? 'status-success' 
                : 'status-error'
            }`}>
              <span>{trend.isPositive ? '↗' : '↘'} {trend.isPositive ? '+' : ''}{trend.value}%</span>
            </div>
          )}
        </div>
        <div className={`w-16 h-16 rounded-2xl ${colorStyles[color].bg} ${colorStyles[color].accent} border-2 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-8 h-8 ${colorStyles[color].icon}`} />
        </div>
      </div>
    </div>
  );
};