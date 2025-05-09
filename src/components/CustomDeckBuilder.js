import React, { useState, useEffect } from 'react';
import { ARCHETYPES, generateCard } from '../gameLogic/helpers';
import Card from './Card';
import CardModal from './CardModal';

const CustomDeckBuilder = ({ onBack }) => {
  const [selectedArchetype, setSelectedArchetype] = useState('');
  const [deck, setDeck] = useState([]);
  const [deckName, setDeckName] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);
  const [savedDecks, setSavedDecks] = useState([]);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    // Load saved decks from localStorage
    const loadedDecks = JSON.parse(localStorage.getItem('customDecks') || '[]');
    setSavedDecks(loadedDecks);
  }, []);

  const addToDeck = (card) => {
    if (deck.length >= 25) {
      alert('Deck is full (25 cards)');
      return;
    }
    if (!card) {
      console.error('Attempted to add invalid card to deck');
      return;
    }
    setDeck([...deck, card]);
  };

  const removeFromDeck = (index) => {
    const newDeck = [...deck];
    newDeck.splice(index, 1);
    setDeck(newDeck);
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

    // Validate all cards have required properties
    const requiredProps = ['id', 'name', 'cost', 'attack', 'health', 'icon', 'color', 'unitColor', 'highlightColor', 'type'];
    const invalidCards = deck.filter(card => !card || !requiredProps.every(prop => card[prop] !== undefined));
    
    if (invalidCards.length > 0) {
      console.error('Invalid cards found:', invalidCards);
      alert('Some cards are missing required properties. Please regenerate the deck.');
      return;
    }

    // Ensure all cards have the correct type
    const validatedDeck = deck.map(card => ({
      ...card,
      type: selectedArchetype
    }));

    const savedDecks = JSON.parse(localStorage.getItem('customDecks') || '[]');
    const newDecks = savedDecks.filter(d => d.name !== deckName);
    newDecks.push({
      name: deckName,
      archetype: selectedArchetype,
      cards: validatedDeck
    });
    localStorage.setItem('customDecks', JSON.stringify(newDecks));
    setSavedDecks(newDecks);
    alert('Deck saved successfully');
  };

  const loadDeck = (deckName) => {
    const deck = savedDecks.find(d => d.name === deckName);
    if (deck) {
      // Ensure all cards have the correct type
      const validatedDeck = deck.cards.map(card => ({
        ...card,
        type: deck.archetype
      }));
      setDeck(validatedDeck);
      setDeckName(deck.name);
      setSelectedArchetype(deck.archetype);
    }
  };

  const deleteDeck = (deckName) => {
    if (window.confirm(`Are you sure you want to delete ${deckName}?`)) {
      const newDecks = savedDecks.filter(d => d.name !== deckName);
      localStorage.setItem('customDecks', JSON.stringify(newDecks));
      setSavedDecks(newDecks);
    }
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
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Custom Deck Builder</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back to Menu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left side - Deck Info and Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Deck Name</label>
            <input
              type="text"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter deck name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Archetype</label>
            <select
              value={selectedArchetype}
              onChange={(e) => setSelectedArchetype(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select an archetype</option>
              {Object.entries(ARCHETYPES).map(([key, archetype]) => (
                <option key={key} value={key}>
                  {archetype.name} - {archetype.description}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Generate Cards</h3>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((cost) => (
                <React.Fragment key={cost}>
                  <button
                    onClick={() => generateCardForArchetype(cost)}
                    className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Generate {cost} Mana Card
                  </button>
                  <button
                    onClick={() => generateCardForArchetype(cost, true)}
                    className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Generate {cost} Mana Taunt
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div>
            <button
              onClick={saveDeck}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save Deck
            </button>
          </div>

          <div>
            <h3 className="font-medium mb-2">Saved Decks</h3>
            <div className="space-y-2">
              {savedDecks.map((deck) => (
                <div key={deck.name} className="flex items-center space-x-2">
                  <button
                    onClick={() => loadDeck(deck.name)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => deleteDeck(deck.name)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <span>{deck.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Current Deck */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Current Deck ({deck.length}/25)</h3>
            <div className="space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                List
              </button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-3 gap-2">
              {deck.map((card, index) => (
                <div key={index} className="relative">
                  <Card
                    card={card}
                    onClick={() => setExpandedCard(card)}
                    className="cursor-pointer"
                  />
                  <button
                    onClick={() => removeFromDeck(index)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {deck.map((card, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-100 rounded"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{card.name}</span>
                    <span className="text-sm text-gray-600">
                      Cost: {card.cost} | Attack: {card.attack} | Health: {card.health}
                      {card.hasTaunt ? ' | Taunt' : ''}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFromDeck(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {expandedCard && (
        <CardModal
          card={expandedCard}
          onClose={() => setExpandedCard(null)}
        />
      )}
    </div>
  );
};

export default CustomDeckBuilder; 