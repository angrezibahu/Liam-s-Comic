import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { StoryData } from '../types/comic';
import { DEFAULT_STORY } from '../types/comic';
import { saveComic } from '../utils/storage';
import { generateComic } from '../utils/comicGenerator';
import StepGenre from '../components/wizard/StepGenre';
import StepCharacters from '../components/wizard/StepCharacters';
import StepIncident from '../components/wizard/StepIncident';
import StepPlot from '../components/wizard/StepPlot';
import StepArc from '../components/wizard/StepArc';
import StepStyle from '../components/wizard/StepStyle';
import StepSummary from '../components/wizard/StepSummary';

const STEP_TITLES = [
  'Genre', 'Characters', 'The Hook', 'Story Plan', 'Character Arc', 'Style', 'Let\'s Go!'
];

const ENCOURAGEMENTS = [
  "Nice pick! This is gonna be good.",
  "Great choices! Your characters sound epic.",
  "Ooh, that's a wild idea!",
  "This story is shaping up nicely!",
  "The best stories have someone who changes.",
  "Looking stylish! Almost there...",
  "Ready to see your comic come to life?",
];

export default function Wizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [story, setStory] = useState<StoryData>({ ...DEFAULT_STORY });
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [generating, setGenerating] = useState(false);
  const [encouragement, setEncouragement] = useState('');

  const updateStory = (partial: Partial<StoryData>) => {
    setStory(prev => ({ ...prev, ...partial }));
  };

  const nextStep = () => {
    setEncouragement(ENCOURAGEMENTS[step] || '');
    setTimeout(() => setEncouragement(''), 2500);
    setStep(prev => Math.min(prev + 1, 6));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  const handleGenerate = () => {
    setGenerating(true);
    // Small delay for the loading animation feel
    setTimeout(() => {
      const comic = generateComic(story, title || 'My Awesome Comic', authorName || 'A Creative Genius');
      saveComic(comic);
      navigate(`/edit/${comic.id}`);
    }, 1500);
  };

  return (
    <div className="min-h-svh bg-comic-cream paper-texture flex flex-col">
      {/* Header with progress */}
      <header className="bg-comic-dark text-white py-3 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="font-hand text-lg hover:text-comic-yellow">
            {'\u2190'} Home
          </button>
          <span className="font-bangers text-lg">{STEP_TITLES[step]}</span>
          <span className="font-hand text-sm text-gray-400">{step + 1}/7</span>
        </div>
        {/* Progress bar */}
        <div className="max-w-2xl mx-auto mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-comic-orange rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / 7) * 100}%` }}
          />
        </div>
      </header>

      {/* Encouragement toast */}
      {encouragement && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-fade-up">
          <div className="speech-bubble bg-comic-yellow border-comic-dark font-hand text-comic-dark text-lg px-6 py-3">
            {encouragement}
          </div>
        </div>
      )}

      {/* Step content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <div className="animate-slide-in" key={step}>
          {step === 0 && <StepGenre story={story} updateStory={updateStory} />}
          {step === 1 && <StepCharacters story={story} updateStory={updateStory} />}
          {step === 2 && <StepIncident story={story} updateStory={updateStory} />}
          {step === 3 && <StepPlot story={story} updateStory={updateStory} />}
          {step === 4 && <StepArc story={story} updateStory={updateStory} />}
          {step === 5 && <StepStyle story={story} updateStory={updateStory} />}
          {step === 6 && (
            <StepSummary
              story={story}
              title={title}
              setTitle={setTitle}
              authorName={authorName}
              setAuthorName={setAuthorName}
            />
          )}
        </div>
      </main>

      {/* Navigation */}
      <footer className="bg-white border-t-3 border-comic-dark py-4 px-4">
        <div className="max-w-2xl mx-auto flex justify-between">
          <button
            onClick={prevStep}
            disabled={step === 0}
            className="font-bangers text-xl text-comic-dark px-6 py-3 rounded-xl border-3 border-comic-dark hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            {'\u2190'} Back
          </button>

          {step < 6 ? (
            <button
              onClick={nextStep}
              className="font-bangers text-xl text-white bg-comic-orange px-8 py-3 rounded-xl border-3 border-comic-dark shadow-[3px_3px_0_rgba(45,45,45,1)] hover:shadow-[4px_4px_0_rgba(45,45,45,1)] hover:-translate-y-0.5 active:shadow-[1px_1px_0_rgba(45,45,45,1)] active:translate-y-0.5 transition-all"
            >
              Next {'\u2192'}
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="font-bangers text-xl text-white bg-comic-green px-8 py-3 rounded-xl border-3 border-comic-dark shadow-[3px_3px_0_rgba(45,45,45,1)] hover:shadow-[4px_4px_0_rgba(45,45,45,1)] hover:-translate-y-0.5 active:shadow-[1px_1px_0_rgba(45,45,45,1)] active:translate-y-0.5 transition-all disabled:opacity-50"
            >
              {generating ? (
                <span className="flex items-center gap-2">
                  Building... <span className="animate-spin">{'\u{2699}\u{FE0F}'}</span>
                </span>
              ) : (
                'Generate My Comic! \u{1F4A5}'
              )}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
