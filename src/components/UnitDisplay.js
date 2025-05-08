// UnitDisplay component for displaying a unit on the battlefield
import React, { useState } from 'react';
import { ARCHETYPES } from '../gameLogic/helpers';

const UnitDisplay = ({ unit }) => {
  const [showDetails, setShowDetails] = useState(false);
  const archetype = ARCHETYPES[unit.type];
  const healthPercent = (unit.health / unit.maxHealth) * 100;
  const isDamaged = unit.health < unit.maxHealth;
  const playerBorder = unit.playerIndex === 0 ? 'border-blue-500' : 'border-red-500';

  return (
    <div
      className={`
        relative w-full h-full flex flex-col items-center justify-center
        transition-all duration-200 border-4 ${playerBorder}
        ${showDetails ? 'scale-105 shadow-lg' : ''}
        overflow-hidden rounded-lg
      `}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      {/* Top third - Archetype color with icon */}
      <div className={`w-full h-1/3 flex items-center justify-center bg-gradient-to-br ${archetype.unitColor}`}>
        <span className="text-3xl">{archetype.icon}</span>
      </div>

      {/* Bottom two thirds - Dark theme */}
      <div className="w-full h-2/3 bg-gray-800 flex flex-col items-center justify-between p-2">
        {/* Unit Name */}
        <div className="text-center px-2">
          <div className="font-bold text-sm truncate text-white">{unit.name}</div>
        </div>

        {/* Mana Cost - Upper Right */}
        <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg">
          {unit.cost}
        </div>

        {/* Taunt Indicator - Below Mana */}
        {unit.hasTaunt && (
          <div className="absolute top-8 right-1 text-yellow-400 text-lg">
            🛡️
          </div>
        )}

        {/* Stats Bar - Bottom */}
        <div className="w-full bg-black/50 text-white text-xs px-2 py-1 flex justify-between">
          <span className="text-red-400">⚔️ {unit.attack}</span>
          <span className="text-green-400">❤️ {unit.health}</span>
        </div>
      </div>

      {/* Hover Tooltip */}
      {showDetails && (
        <div className="absolute z-50 bg-gray-900/95 p-3 rounded-lg shadow-xl -top-2 left-full ml-2 w-48 border border-gray-700">
          <div className="font-bold text-yellow-400 mb-1">{unit.name}</div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">Type:</span>
              <span className="text-white">{archetype.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Cost:</span>
              <span className="text-blue-400">{unit.cost}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Attack:</span>
              <span className="text-red-400">{unit.attack}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Health:</span>
              <span className="text-green-400">{unit.health}/{unit.maxHealth}</span>
            </div>
            {unit.hasTaunt && (
              <div className="text-yellow-400 text-sm mt-1">
                🛡️ Has Taunt: Enemies must attack this unit first
              </div>
            )}
            <div className="text-gray-400 text-xs mt-2">
              {unit.description}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitDisplay; 