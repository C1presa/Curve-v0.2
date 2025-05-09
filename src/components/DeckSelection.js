// DeckSelection component for choosing a deck/archetype and previewing cards
import React, { useState, useEffect } from 'react';
import { ARCHETYPES, generatePreviewDeck } from '../gameLogic/helpers';
import Card from './Card';
import CardModal from './CardModal';

const DeckSelection = ({ onSelect, onBack, selectedCustomDeck, onCustomDeckSelect }) => {
  const [selectedArchetype, setSelectedArchetype] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [previewDeck, setPreviewDeck] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [savedDecks, setSavedDecks] = useState([]);
  const [deckType, setDeckType] = useState('pre-created');
  const [selectedDeckName, setSelectedDeckName] = useState('');

  useEffect(() => {
    // Generate preview decks for all archetypes
    const previews = {};
    Object.keys(ARCHETYPES).forEach(archetype => {
      previews[archetype] = generatePreviewDeck(archetype);
    });
    setPreviewDeck(previews);

    // Load saved custom decks
    const loadedDecks = JSON.parse(localStorage.getItem('customDecks') || '[]');
    setSavedDecks(loadedDecks);
  }, []);

  const handleConfirmSelection = () => {
    if (deckType === 'custom') {
      if (!selectedDeckName) {
        alert('Please select a custom deck');
        return;
      }
      const selectedDeck = savedDecks.find(d => d.name === selectedDeckName);
      if (!selectedDeck) {
        alert('Selected deck not found');
        return;
      }

      // Validate the deck
      if (!selectedDeck.cards || !Array.isArray(selectedDeck.cards)) {
        alert('Invalid deck format');
        return;
      }

      // Filter out invalid cards and ensure required properties
      const validCards = selectedDeck.cards.filter(card => {
        if (!card) return false;
        const requiredProps = ['id', 'name', 'cost', 'attack', 'health', 'icon', 'color', 'unitColor', 'highlightColor'];
        return requiredProps.every(prop => card[prop] !== undefined);
      });

      if (validCards.length !== 25) {
        alert(`Deck must have exactly 25 valid cards (found ${validCards.length})`);
        return;
      }

      // Create a validated deck object
      const validatedDeck = {
        ...selectedDeck,
        cards: validCards
      };

      console.log('Selected custom deck:', validatedDeck);
      onCustomDeckSelect(validatedDeck);
    } else {
      if (!selectedArchetype) {
        alert('Please select an archetype');
        return;
      }

      // Validate the preview deck
      const previewCards = previewDeck[selectedArchetype];
      if (!previewCards || !Array.isArray(previewCards)) {
        alert('Invalid preview deck');
        return;
      }

      // Filter out invalid cards
      const validCards = previewCards.filter(card => {
        if (!card) return false;
        const requiredProps = ['id', 'name', 'cost', 'attack', 'health', 'icon', 'color', 'unitColor', 'highlightColor'];
        return requiredProps.every(prop => card[prop] !== undefined);
      });

      if (validCards.length !== 25) {
        alert(`Deck must have exactly 25 valid cards (found ${validCards.length})`);
        return;
      }

      console.log('Selected pre-created deck:', selectedArchetype);
      onSelect(selectedArchetype);
    }
  };

  const renderDeckPreview = () => {
    if (deckType === 'custom') {
      const selectedDeck = savedDecks.find(d => d.name === selectedDeckName);
      if (!selectedDeck) return null;

      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Deck Preview</h3>
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
              {selectedDeck.cards.map((card, index) => (
                <div key={index}>
                  <Card
                    card={card}
                    onClick={() => setExpandedCard(card)}
                    className="cursor-pointer"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {selectedDeck.cards.map((card, index) => (
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
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (!selectedArchetype) return null;

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Deck Preview</h3>
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
            {previewDeck[selectedArchetype]?.map((card, index) => (
              <div key={index}>
                <Card
                  card={card}
                  onClick={() => setExpandedCard(card)}
                  className="cursor-pointer"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {previewDeck[selectedArchetype]?.map((card, index) => (
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
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Select Your Deck</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="pre-created"
              checked={deckType === 'pre-created'}
              onChange={(e) => setDeckType(e.target.value)}
              className="form-radio"
            />
            <span>Pre-created Deck</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="custom"
              checked={deckType === 'custom'}
              onChange={(e) => setDeckType(e.target.value)}
              className="form-radio"
            />
            <span>Custom Deck</span>
          </label>
        </div>

        {deckType === 'pre-created' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(ARCHETYPES).map(([key, archetype]) => (
              <button
                key={key}
                onClick={() => setSelectedArchetype(key)}
                className={`p-4 rounded-lg text-center ${
                  selectedArchetype === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{archetype.icon}</div>
                <div className="font-medium">{archetype.name}</div>
                <div className="text-sm mt-1">{archetype.description}</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Custom Deck</label>
              <select
                value={selectedDeckName}
                onChange={(e) => setSelectedDeckName(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a deck</option>
                {savedDecks.map((deck) => (
                  <option key={deck.name} value={deck.name}>
                    {deck.name} ({ARCHETYPES[deck.archetype].name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {renderDeckPreview()}

        <div className="flex justify-end">
          <button
            onClick={handleConfirmSelection}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirm Selection
          </button>
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

export default DeckSelection; 