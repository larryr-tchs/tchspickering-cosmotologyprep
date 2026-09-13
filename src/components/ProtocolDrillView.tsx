import React, { useState } from 'react';
import {
  ShieldAlert,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Award,
} from 'lucide-react';
import { STATE_BOARD_PROTOCOLS } from '../data/flashcards';
import { ProtocolStepItem } from '../types';
import { playSound } from '../utils/storage';

export const ProtocolDrillView: React.FC = () => {
  const [activeProtocolIndex, setActiveProtocolIndex] = useState<number>(0);
  const protocol = STATE_BOARD_PROTOCOLS[activeProtocolIndex];

  // Scramble the steps for the drill
  const [currentSteps, setCurrentSteps] = useState<ProtocolStepItem[]>(() => {
    return [...protocol.steps].sort(() => Math.random() - 0.5);
  });
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleSelectProtocol = (index: number) => {
    playSound('click');
    setActiveProtocolIndex(index);
    const nextProtocol = STATE_BOARD_PROTOCOLS[index];
    setCurrentSteps([...nextProtocol.steps].sort(() => Math.random() - 0.5));
    setIsChecked(false);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    playSound('click');
    const updated = [...currentSteps];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setCurrentSteps(updated);
    setIsChecked(false);
  };

  const handleMoveDown = (index: number) => {
    if (index === currentSteps.length - 1) return;
    playSound('click');
    const updated = [...currentSteps];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setCurrentSteps(updated);
    setIsChecked(false);
  };

  const handleReset = () => {
    playSound('click');
    setCurrentSteps([...protocol.steps].sort(() => Math.random() - 0.5));
    setIsChecked(false);
  };

  const handleVerify = () => {
    const isAllCorrect = currentSteps.every((step, idx) => step.order === idx + 1);
    if (isAllCorrect) {
      playSound('pass');
    } else {
      playSound('incorrect');
    }
    setIsChecked(true);
  };

  const correctPositionsCount = currentSteps.filter((s, idx) => s.order === idx + 1).length;
  const isPerfect = isChecked && correctPositionsCount === currentSteps.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-rose-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-rose-900/40 shadow-sm space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-400/30">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Universal Safety Sequencing Challenge</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          State Board Safety Protocol Drills
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          State board test administrators strictly grade step sequence on safety procedures. Misordering a single step on an exposure incident is considered an immediate health hazard violation.
        </p>
      </div>

      {/* Protocol Selector Tabs */}
      <div className="flex space-x-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        {STATE_BOARD_PROTOCOLS.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => handleSelectProtocol(idx)}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
              activeProtocolIndex === idx
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Protocol Details & Instructions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{protocol.title}</h2>
            <p className="text-xs text-slate-500">{protocol.subtitle}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleReset}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reshuffle</span>
            </button>
            <button
              onClick={handleVerify}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Check Order</span>
            </button>
          </div>
        </div>

        {/* Critical Note */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start space-x-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold text-amber-900">Why Sequence Matters: </strong>
            {protocol.whyCritical}
          </div>
        </div>

        {/* Verification Result Banner if Checked */}
        {isChecked && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isPerfect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-center space-x-2">
              {isPerfect ? (
                <Award className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-rose-600 flex-shrink-0" />
              )}
              <div>
                <div className="font-bold text-sm">
                  {isPerfect
                    ? 'Flawless Sequence! 100% State Board Compliant'
                    : `${correctPositionsCount} of ${currentSteps.length} Steps in Proper Position`}
                </div>
                <div className="text-xs mt-0.5">
                  {isPerfect
                    ? 'You have mastered this exact universal precaution order.'
                    : 'Inspect the red indicators below and adjust step positions using the up and down arrows.'}
                </div>
              </div>
            </div>

            {isPerfect && (
              <span className="hidden sm:inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Examiner Verified</span>
              </span>
            )}
          </div>
        )}

        {/* Step Ordering List */}
        <div className="space-y-2.5 pt-2">
          {currentSteps.map((step, idx) => {
            const isCorrectPosition = isChecked && step.order === idx + 1;
            const isWrongPosition = isChecked && step.order !== idx + 1;

            let cardBorder = 'border-slate-200 bg-white hover:border-slate-300';
            if (isCorrectPosition) cardBorder = 'border-emerald-500 bg-emerald-50/50';
            if (isWrongPosition) cardBorder = 'border-rose-400 bg-rose-50/40';

            return (
              <div
                key={step.id}
                className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-all ${cardBorder}`}
              >
                {/* Step number badge & text */}
                <div className="flex items-start space-x-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 border ${
                      isCorrectPosition
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : isWrongPosition
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </span>

                  <div className="space-y-1">
                    <div className="text-xs sm:text-sm font-bold text-slate-900">
                      {step.text}
                    </div>
                    <div className="text-xs text-slate-500 leading-relaxed">
                      {step.detail}
                    </div>

                    {isWrongPosition && (
                      <div className="text-[11px] font-semibold text-rose-700 pt-0.5">
                        (Should be Step #{step.order})
                      </div>
                    )}
                  </div>
                </div>

                {/* Move Up / Down Buttons */}
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <button
                    onClick={() => handleMoveUp(idx)}
                    disabled={idx === 0}
                    className={`p-1.5 rounded-lg border text-slate-600 transition-colors ${
                      idx === 0
                        ? 'opacity-30 cursor-not-allowed border-slate-100'
                        : 'border-slate-200 hover:bg-slate-100'
                    }`}
                    title="Move Step Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMoveDown(idx)}
                    disabled={idx === currentSteps.length - 1}
                    className={`p-1.5 rounded-lg border text-slate-600 transition-colors ${
                      idx === currentSteps.length - 1
                        ? 'opacity-30 cursor-not-allowed border-slate-100'
                        : 'border-slate-200 hover:bg-slate-100'
                    }`}
                    title="Move Step Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
