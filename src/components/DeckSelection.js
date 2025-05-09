// DeckSelection component for choosing a deck/archetype and previewing cards
import React, { useState, useEffect } from 'react';
import { ARCHETYPES, generatePreviewDeck } from '../gameLogic/helpers';
import Card from './Card';
import CardModal from './CardModal';

const DeckSelection = ({ onSelect, onBack, selectedCustomDeck, onCustomDeckSelect }) => {
  const [selectedArchetype, setSelectedArchetype] = useState(null);
  const [previewDeck, setPreviewDeck] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [savedDecks, setSavedDecks] = useState([]);
  const [deckType, setDeckType] = useState('pre-created');
  const [selectedDeckName, setSelectedDeckName] = useState('');

  useEffect(() => {
    // Generate preview decks for all archetypes
    const previews = {};
    Object.keys(ARCHETYPES).forEach(archetype => {
      const deck = generatePreviewDeck(archetype);
      console.log(`Generated preview deck for ${archetype}:`, deck);
      previews[archetype] = deck;
    });
    setPreviewDeck(previews);

    // Load saved custom decks
    const loadedDecks = JSON.parse(localStorage.getItem('customDecks') || '[]');
    console.log('Loaded custom decks:', loadedDecks);
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
        console.error('Invalid deck format:', selectedDeck);
        alert('Invalid deck format');
        return;
      }

      // Filter out invalid cards and ensure required properties
      const validCards = selectedDeck.cards.filter(card => {
        if (!card) {
          console.log('Found null/undefined card');
          return false;
        }
        const requiredProps = ['id', 'name', 'cost', 'attack', 'health', 'icon', 'color', 'unitColor', 'highlightColor', 'type'];
        const missingProps = requiredProps.filter(prop => card[prop] === undefined);
        if (missingProps.length > 0) {
          console.log('Card missing properties:', card, 'Missing:', missingProps);
        }
        return missingProps.length === 0;
      });

      if (validCards.length !== 25) {
        alert(`Deck must have exactly 25 valid cards (found ${validCards.length})`);
        return;
      }

      // Create a validated deck object with correct types
      const validatedDeck = {
        ...selectedDeck,
        cards: validCards.map(card => ({
          ...card,
          type: selectedDeck.archetype
        }))
      };

      console.log('Confirming custom deck:', validatedDeck);
      onCustomDeckSelect(validatedDeck);
    } else {
      if (!selectedArchetype) {
        alert('Please select an archetype');
        return;
      }

      // Validate the preview deck
      const previewCards = previewDeck[selectedArchetype];
      if (!previewCards || !Array.isArray(previewCards)) {
        console.error('Invalid preview deck:', previewCards);
        alert('Invalid preview deck');
        return;
      }

      // Filter out invalid cards
      const validCards = previewCards.filter(card => {
        if (!card) {
          console.log('Found null/undefined card in preview');
          return false;
        }
        const requiredProps = ['id', 'name', 'cost', 'attack', 'health', 'icon', 'color', 'unitColor', 'highlightColor', 'type'];
        const missingProps = requiredProps.filter(prop => card[prop] === undefined);
        if (missingProps.length > 0) {
          console.log('Preview card missing properties:', card, 'Missing:', missingProps);
        }
        return missingProps.length === 0;
      });

      if (validCards.length !== 25) {
        alert(`Deck must have exactly 25 valid cards (found ${validCards.length})`);
        return;
      }

      // Create a validated deck object with correct types
      const validatedDeck = {
        archetype: selectedArchetype,
        cards: validCards.map(card => ({
          ...card,
          type: selectedArchetype
        }))
      };

      console.log('Confirming pre-created deck:', validatedDeck);
      onSelect(selectedArchetype);
    }
  };

  const renderDeckPreview = () => {
    if (deckType === 'custom') {
      const selectedDeck = savedDecks.find(d => d.name === selectedDeckName);
      if (!selectedDeck) return null;

      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-center">Deck Preview</h3>
          <div className="grid grid-cols-5 gap-2">
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
        </div>
      );
    }

    if (!selectedArchetype) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-center">Deck Preview</h3>
        <div className="grid grid-cols-5 gap-2">
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
      </div>
    );
  };

  const renderDeckGrid = (decks, onSelect, selectedValue) => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {decks.map((deck) => {
          const archetype = ARCHETYPES[deck.archetype || deck.key];
          if (!archetype) return null;

          return (
            <button
              key={deck.name || deck.key}
              onClick={() => onSelect(deck.name || deck.key)}
              className={`relative overflow-hidden rounded-xl transition-all duration-300 transform hover:scale-105 ${
                selectedValue === (deck.name || deck.key)
                  ? 'ring-4 ring-blue-500 shadow-lg shadow-blue-500/30'
                  : 'hover:shadow-lg hover:shadow-gray-500/30'
              }`}
            >
              <div
                className={`h-40 ${archetype.color} flex flex-col items-center justify-center p-4`}
              >
                <div className="text-3xl mb-2">{archetype.icon}</div>
                <h3 className="text-lg font-bold mb-1">{deck.name || archetype.name}</h3>
                <p className="text-xs text-center opacity-90">{archetype.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Select Your Deck</h2>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back
          </button>
        </div>

        <div className="space-y-8">
          {/* Deck Type Selection */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setDeckType('pre-created')}
              className={`px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                deckType === 'pre-created'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Pre-created Decks
            </button>
            <button
              onClick={() => setDeckType('custom')}
              className={`px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                deckType === 'custom'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Custom Decks
            </button>
          </div>

          {/* Deck Selection Grid */}
          {deckType === 'pre-created' ? (
            renderDeckGrid(
              Object.entries(ARCHETYPES).map(([key, archetype]) => ({ key, ...archetype })),
              setSelectedArchetype,
              selectedArchetype
            )
          ) : (
            savedDecks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xl text-gray-400">No custom decks saved.</p>
                <p className="text-sm text-gray-500 mt-2">Create a custom deck in the deck builder.</p>
              </div>
            ) : (
              renderDeckGrid(savedDecks, setSelectedDeckName, selectedDeckName)
            )
          )}

          {/* Confirm Button */}
          <div className="flex justify-center">
            <button
              onClick={handleConfirmSelection}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors transform hover:scale-105 shadow-lg shadow-blue-500/30"
            >
              Confirm Selection
            </button>
          </div>

          {/* Deck Preview */}
          {renderDeckPreview()}
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