import React, { useState, useMemo } from 'react';
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Lightbulb,
} from 'lucide-react';
import { FLASHCARDS } from '../data/flashcards';
import { SUBJECTS } from '../data/subjects';
import { SubjectId } from '../types';
import {
  getMasteredFlashcards,
  toggleFlashcardMastered,
  playSound,
} from '../utils/storage';

export const FlashcardsView: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<string[]>(getMasteredFlashcards());
  const [shuffled, setShuffled] = useState<boolean>(false);

  const filteredCards = useMemo(() => {
    let list =
      selectedSubject === 'all'
        ? [...FLASHCARDS]
        : FLASHCARDS.filter((c) => c.subjectId === selectedSubject);

    if (shuffled) {
      list = [...list].sort(() => Math.random() - 0.5);
    }
    return list;
  }, [selectedSubject, shuffled]);

  const currentCard = filteredCards[currentIndex] || filteredCards[0];
  const isMastered = currentCard ? masteredIds.includes(currentCard.id) : false;

  const handleFlip = () => {
    playSound('click');
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < filteredCards.length - 1) {
      playSound('click');
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setShowHint(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      playSound('click');
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setShowHint(false);
    }
  };

  const handleToggleMastered = () => {
    if (!currentCard) return;
    playSound('correct');
    const updated = toggleFlashcardMastered(currentCard.id);
    setMasteredIds(updated);
  };

  const handleShuffle = () => {
    playSound('click');
    setShuffled(!shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const masteredCount = filteredCards.filter((c) => masteredIds.includes(c.id)).length;
  const progressPct = filteredCards.length > 0 ? Math.round((masteredCount / filteredCards.length) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Exam Terminology Flashcards</h1>
          <p className="text-xs text-slate-500">
            Click or tap the card to flip between exam prompt and standard board answer.
          </p>
        </div>

        {/* Subject Filter Dropdown */}
        <div className="flex items-center space-x-2">
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value as SubjectId | 'all');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold bg-white text-slate-800"
          >
            <option value="all">All Subjects ({FLASHCARDS.length})</option>
            {SUBJECTS.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.shortName}
              </option>
            ))}
          </select>

          <button
            onClick={handleShuffle}
            className={`p-2 rounded-lg border transition-colors ${
              shuffled ? 'bg-rose-50 text-rose-600 border-rose-300' : 'text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Shuffle Cards"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">
            Card {currentIndex + 1} of {filteredCards.length}
          </span>
          <span className="font-semibold text-emerald-700">
            {masteredCount} of {filteredCards.length} Mastered ({progressPct}%)
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Interactive 3D Card Container */}
      {currentCard && (
        <div className="perspective-1000">
          <div
            onClick={handleFlip}
            className={`relative min-h-[340px] sm:min-h-[380px] w-full rounded-3xl p-8 sm:p-10 cursor-pointer transition-all duration-500 transform-style-3d border-2 flex flex-col justify-between shadow-sm select-none ${
              isFlipped
                ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700'
                : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
            }`}
          >
            {/* Top Card Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    isFlipped
                      ? 'bg-slate-800 text-slate-200 border-slate-700'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {currentCard.subjectName}
                </span>
                {currentCard.examTag && (
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      isFlipped
                        ? 'bg-amber-400/20 text-amber-300'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    {currentCard.examTag}
                  </span>
                )}
              </div>

              <span
                className={`text-xs font-semibold px-2 py-1 rounded-md ${
                  isFlipped ? 'text-slate-400' : 'text-slate-400'
                }`}
              >
                {isFlipped ? 'Answer (Click to flip)' : 'Prompt (Click to flip)'}
              </span>
            </div>

            {/* Main Content Area */}
            <div className="py-6 text-center space-y-4">
              <div
                className={`text-lg sm:text-2xl font-extrabold leading-relaxed ${
                  isFlipped ? 'text-white' : 'text-slate-900'
                }`}
              >
                {isFlipped ? currentCard.back : currentCard.front}
              </div>

              {/* Front Hint Toggle */}
              {!isFlipped && currentCard.hint && (
                <div className="pt-2">
                  {showHint ? (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs text-left max-w-md"
                    >
                      <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>{currentCard.hint}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowHint(true);
                      }}
                      className="text-xs font-semibold text-amber-700 hover:text-amber-800 underline inline-flex items-center space-x-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Need a hint?</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Card Footer Status */}
            <div className="flex items-center justify-between pt-4 border-t border-dashed border-slate-200/40 text-xs">
              <span className={isFlipped ? 'text-slate-400' : 'text-slate-400'}>
                Tip: Press Spacebar to flip
              </span>

              {isMastered && (
                <span className="flex items-center space-x-1 text-emerald-500 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mastered</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Controls */}
      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-colors ${
            currentIndex === 0
              ? 'opacity-40 cursor-not-allowed text-slate-400 border-slate-200'
              : 'text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Mastered / Still Learning Toggle */}
        <button
          onClick={handleToggleMastered}
          className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors ${
            isMastered
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
        >
          <CheckCircle2
            className={`w-4 h-4 ${isMastered ? 'text-emerald-600 fill-emerald-100' : 'text-slate-400'}`}
          />
          <span>{isMastered ? 'Marked as Mastered' : 'Mark as Mastered'}</span>
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === filteredCards.length - 1}
          className={`flex items-center space-x-1 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-colors ${
            currentIndex === filteredCards.length - 1
              ? 'opacity-40 cursor-not-allowed text-slate-400 border-slate-200'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
