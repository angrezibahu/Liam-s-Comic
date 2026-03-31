import type { StoryData } from '../../types/comic';
import { INCIDENT_EXAMPLES } from '../../types/comic';

interface Props {
  story: StoryData;
  updateStory: (partial: Partial<StoryData>) => void;
}

export default function StepIncident({ story, updateStory }: Props) {
  return (
    <div>
      <div className="speech-bubble inline-block mb-6 text-left">
        <p className="font-hand text-lg text-comic-dark">
          Every great story needs something weird, funny, or unexpected to kick things off. What happens?
        </p>
      </div>

      <div className="mb-4">
        <p className="font-hand text-sm text-gray-500 mb-2">Need inspiration? Tap one of these (or make up your own!):</p>
        <div className="flex flex-wrap gap-2 stagger-children">
          {INCIDENT_EXAMPLES.map(example => (
            <button
              key={example}
              onClick={() => updateStory({ incitingIncident: example })}
              className={`animate-pop-in px-3 py-2 rounded-lg border-2 font-hand text-sm transition-all ${
                story.incitingIncident === example
                  ? 'border-comic-orange bg-orange-50 text-comic-dark'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={story.incitingIncident}
        onChange={(e) => updateStory({ incitingIncident: e.target.value })}
        placeholder="The weirder the better! What kicks off your story?"
        className="w-full border-3 border-comic-dark rounded-xl px-4 py-3 font-hand text-lg focus:border-comic-orange focus:outline-none min-h-[120px] bg-white"
        maxLength={300}
      />
      <p className="font-hand text-xs text-gray-400 text-right mt-1">
        {story.incitingIncident.length}/300
      </p>
    </div>
  );
}
