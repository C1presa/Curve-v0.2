import React, { useState, useEffect } from 'react';
import { ARCHETYPES, generateCard } from '../gameLogic/helpers';
import Card from './Card';
import CardModal from './CardModal';

const CustomDeckBuilder = ({ onBack }) => {
  const [selectedArchetype, setSelectedArchetype] = useState(null);
  const [deck, setDeck] = useState([]);
  const [deckName, setDeckName] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);
  const [savedDecks, setSavedDecks] = useState([]);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    // Load saved decks from localStorage
    const decks = JSON.parse(localStorage.getItem('customDecks') || '[]');
    setSavedDecks(decks);
  }, []);

  const addToDeck = (card) => {
    if (deck.length < 25) {
      setDeck([...deck, { ...card, id: `${card.id}_${deck.length}` }]);
    }
  };

  const removeFromDeck = (index) => {
    setDeck(deck.filter((_, i) => i !== index));
  };

  const saveDeck = () => {
    if (deck.length !== 25) {
      alert('Deck must have exactly 25 cards');
      return;
    }
    if (!deckName) {
      alert('Please enter a deck name');
      return;
    }
    if (!selectedArchetype) {
      alert('Please select an archetype');
      return;
    }

    const newDeck = {
      name: deckName,
      archetype: selectedArchetype,
      cards: deck
    };

    const updatedDecks = savedDecks.filter(d => d.name !== deckName);
    updatedDecks.push(newDeck);
    localStorage.setItem('customDecks', JSON.stringify(updatedDecks));
    setSavedDecks(updatedDecks);
    alert('Deck saved successfully!');
  };

  const loadDeck = (deck) => {
    setDeckName(deck.name);
    setSelectedArchetype(deck.archetype);
    setDeck(deck.cards);
  };

  const deleteDeck = (deckName) => {
    const updatedDecks = savedDecks.filter(d => d.name !== deckName);
    localStorage.setItem('customDecks', JSON.stringify(updatedDecks));
    setSavedDecks(updatedDecks);
  };

  const generateCardForArchetype = (cost, hasTaunt = false) => {
    if (!selectedArchetype) {
      alert('Please select an archetype first');
      return;
    }
    if (deck.length >= 25) {
      alert('Deck is full (25 cards)');
      return;
    }
    
    // Generate card with specific mana cost
    const card = generateCard(
      `custom_${Date.now()}_${Math.random()}`,
      selectedArchetype,
      hasTaunt,
      cost
    );
    
    if (!card) {
      alert('Failed to generate card. Please try again.');
      return;
    }
    
    addToDeck(card);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Custom Deck Builder</h1>
          <button
            onClick={onBack}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
          >
            Back to Menu
          </button>
        </div>

        {/* Saved Decks Section */}
        <div className="mb-8 bg-gray-800/50 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Saved Decks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedDecks.map((savedDeck) => (
              <div key={savedDeck.name} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold">{savedDeck.name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => loadDeck(savedDeck)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => deleteDeck(savedDeck.name)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-300">
                  {ARCHETYPES[savedDeck.archetype].name} • {savedDeck.cards.length} cards
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Deck Building Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Deck Info and Controls */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">Deck Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Deck Name</label>
                  <input
                    type="text"
                    value={deckName}
                    onChange={(e) => setDeckName(e.target.value)}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                    placeholder="Enter deck name"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Archetype</label>
                  <select
                    value={selectedArchetype || ''}
                    onChange={(e) => setSelectedArchetype(e.target.value)}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                  >
                    <option value="">Select Archetype</option>
                    {Object.entries(ARCHETYPES).map(([key, archetype]) => (
                      <option key={key} value={key}>
                        {archetype.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={saveDeck}
                    className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-bold"
                  >
                    Save Deck
                  </button>
                  <span className="text-gray-300">
                    Cards: {deck.length}/25
                  </span>
                </div>
              </div>
            </div>

            {/* Card Generation Controls */}
            {selectedArchetype && (
              <div className="bg-gray-800/50 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4">Generate Cards</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((cost) => (
                    <div key={cost} className="space-y-2">
                      <button
                        onClick={() => generateCardForArchetype(cost)}
                        className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
                      >
                        {cost} Mana
                      </button>
                      <button
                        onClick={() => generateCardForArchetype(cost, true)}
                        className="w-full bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg text-sm"
                      >
                        {cost} Mana Taunt
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Current Deck */}
          <div className="bg-gray-800/50 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Current Deck</h2>
              <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-blue-600' : 'hover:bg-gray-600'}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-blue-600' : 'hover:bg-gray-600'}`}
                >
                  List
                </button>
              </div>
            </div>
            <div className={viewMode === 'grid' ? 'grid grid-cols-5 gap-4' : 'space-y-2'}>
              {deck.map((card, index) => (
                viewMode === 'grid' ? (
                  <div key={card.id} className="relative group">
                    <Card
                      card={card}
                      archetype={selectedArchetype}
                      onClick={() => setExpandedCard(card)}
                    />
                    <button
                      onClick={() => removeFromDeck(index)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div
                    key={card.id}
                    className="bg-gray-700 p-3 rounded-lg flex items-center justify-between hover:bg-gray-600"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-700 w-8 h-8 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{card.cost}</span>
                      </div>
                      <span className="text-white font-bold">{card.name}</span>
                      {card.hasTaunt && (
                        <div className="flex items-center gap-1 text-yellow-400">
                          <span>🛡️</span>
                          <span className="text-sm">Taunt</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-red-400">⚔️ {card.attack}</span>
                      <span className="text-green-400">❤️ {card.health}</span>
                      <button
                        onClick={() => removeFromDeck(index)}
                        className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Expanded card modal */}
        {expandedCard && (
          <CardModal card={expandedCard} onClose={() => setExpandedCard(null)} />
        )}
      </div>
    </div>
  );
};

export default CustomDeckBuilder; 