import React from 'react';
import { Cloud, Sun, CloudRain, Wind } from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Cloud className="w-8 h-8" />
          <div>
            <div className="text-2xl font-semibold">18°C</div>
            <div className="text-sm opacity-90">Paris, France</div>
          </div>
        </div>
        <div className="text-right text-sm opacity-90">
          <div className="flex items-center space-x-1">
            <span>💧</span>
            <span>Humidité 65%</span>
          </div>
          <div className="flex items-center space-x-1 mt-1">
            <Wind className="w-3 h-3" />
            <span>12 km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
};