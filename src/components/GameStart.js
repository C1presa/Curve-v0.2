import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card'; // Adjust import path
import units from '../data/units'; // Adjust import path

function GameStart({ mode }) {
  const [deckType, setDeckType] = useState('pre-created');
  const [selectedDeckName, setSelectedDeckName] = useState('');
  const savedDecks = JSON.parse(localStorage.getItem('customDecks') || '[]');
  const navigate = useNavigate();

  const selectedCustomDeck = savedDecks.find(d => d.name === selectedDeckName)?.units || [];

  const generateRandomDeck = () => {
    if (!units || units.length === 0) {
      console.error('Units data is undefined or empty');
      return [];
    }
    const randomUnits = units.sort(() => Math.random() - 0.5).slice(0, 25);
    return randomUnits.map(unit => ({
      ...unit,
      attack: Math.floor(unit.attack * (0.8 + Math.random() * 0.4)),
      health: Math.floor(unit.health * (0.8 + Math.random() * 0.4)),
      effects: Math.random() > 0.5 ? [...unit.effects, 'random_effect'] : unit.effects,
    }));
  };

  const handleConfirmSelection = () => {
    let deck;
    if (deckType === 'custom') {
      if (!selectedDeckName) {
        alert('Please select a custom deck');
        return;
      }
      deck = selectedCustomDeck;
    } else {
      deck = generateRandomDeck();
    }
    console.log('Selected deck for game:', deck); // Debug log
    if (deck.length === 0) {
      alert('Selected deck is empty or invalid');
      return;
    }
    navigate(`/game/${mode}`, { state: { deck } });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1>{mode === '1v1' ? '1v1' : 'vs AI'}</h1>
      <label>
        <input
          type="radio"
          value="pre-created"
          checked={deckType === 'pre-created'}
          onChange={() => setDeckType('pre-created')}
        />
        Pre-created Deck
      </label>
      <label>
        <input
          type="radio"
          value="custom"
          checked={deckType === 'custom'}
          onChange={() => setDeckType('custom')}
        />
        Custom Deck
      </label>
      {deckType === 'custom' && (
        <select value={selectedDeckName} onChange={(e) => setSelectedDeckName(e.target.value)}>
          <option value="">Select Deck</option>
          {savedDecks.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
        </select>
      )}
      <h2>Deck Preview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
        {(deckType === 'custom' ? selectedCustomDeck : generateRandomDeck()).map((card, index) => (
          card ? <Card key={index} unit={card} /> : null
        ))}
      </div>
      <button onClick={handleConfirmSelection} style={{ backgroundColor: 'green', color: 'white', padding: '10px' }}>
        Confirm Selection
      </button>
    </div>
  );
}

export default GameStart; 