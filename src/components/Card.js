// Card component for displaying a card in hand or deck
import React from 'react';
import { ARCHETYPES } from '../gameLogic/helpers';

const Card = ({ card, selected, onClick, disabled }) => {
  const archetype = ARCHETYPES[card.type];
  return (
    <div
      onClick={() => !disabled && onClick(card)}
      className={`w-28 h-40 border-2 rounded-xl relative overflow-hidden transition-all duration-200 transform 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105 hover:-translate-y-1'}
        ${selected ? `border-yellow-400 shadow-lg ${archetype.highlightColor}` : 'border-gray-600'}
        ${archetype.color}
      `}
    >
      {/* Cost badge */}
      <div className="absolute top-1 left-1 w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center border-2 border-blue-400">
        <span className="text-white font-bold">{card.cost}</span>
      </div>
      {/* Archetype icon */}
      <div className="absolute top-1 right-1 text-2xl">
        {archetype.icon}
      </div>
      {/* Taunt indicator */}
      {card.hasTaunt && (
        <div className="absolute top-8 right-1 text-xl" title="Taunt: Enemies must attack this unit first">
          🛡️
        </div>
      )}
      {/* Card content */}
      <div className="mt-10 px-2">
        <div className="text-sm font-bold text-white text-center mb-1 truncate">
          {card.name}
        </div>
        <div className="absolute bottom-2 left-2 right-2">
          <div className="flex justify-between text-white">
            <div className="bg-red-700/80 px-2 py-1 rounded">
              <span className="text-xs font-bold">⚔️ {card.attack}</span>
            </div>
            <div className="bg-green-700/80 px-2 py-1 rounded">
              <span className="text-xs font-bold">❤️ {card.health}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Card); 