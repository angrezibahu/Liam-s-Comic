import type { StoryData } from '../../types/comic';

interface Props {
  story: StoryData;
  updateStory: (partial: Partial<StoryData>) => void;
}

export default function StepPlot({ story, updateStory }: Props) {
  return (
    <div className="space-y-5">
      <div className="speech-bubble inline-block mb-2 text-left">
        <p className="font-hand text-lg text-comic-dark">
          Plan your story in three parts! Don't worry about making it perfect — just get your ideas down.
        </p>
      </div>

      {/* Beginning */}
      <div className="animate-fade-up">
        <label className="font-bangers text-lg text-comic-dark flex items-center gap-2 mb-1">
          <span className="inline-block w-8 h-8 rounded-full bg-comic-green text-white text-center leading-8 text-sm">1</span>
          BEGINNING
        </label>
        <p className="font-hand text-sm text-gray-500 mb-2">
          How does your story start? What's everyone doing before the weird thing happens?
        </p>
        <textarea
          value={story.beginning}
          onChange={(e) => updateStory({ beginning: e.target.value })}
          placeholder="Maybe they're at school, or eating breakfast, or exploring a cave..."
          className="w-full border-2 border-gray-300 rounded-xl px-3 py-2 font-hand focus:border-comic-green focus:outline-none min-h-[100px] bg-white"
          maxLength={500}
        />
      </div>

      {/* Middle */}
      <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
        <label className="font-bangers text-lg text-comic-dark flex items-center gap-2 mb-1">
          <span className="inline-block w-8 h-8 rounded-full bg-comic-orange text-white text-center leading-8 text-sm">2</span>
          MIDDLE
        </label>
        <p className="font-hand text-sm text-gray-500 mb-2">
          The weird thing has happened! What do your characters do? Does it get worse? Does something funny go wrong?
        </p>
        <textarea
          value={story.middle}
          onChange={(e) => updateStory({ middle: e.target.value })}
          placeholder="The best middles have things going wrong at least twice..."
          className="w-full border-2 border-gray-300 rounded-xl px-3 py-2 font-hand focus:border-comic-orange focus:outline-none min-h-[120px] bg-white"
          maxLength={800}
        />
      </div>

      {/* End */}
      <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
        <label className="font-bangers text-lg text-comic-dark flex items-center gap-2 mb-1">
          <span className="inline-block w-8 h-8 rounded-full bg-comic-red text-white text-center leading-8 text-sm">3</span>
          END
        </label>
        <p className="font-hand text-sm text-gray-500 mb-2">
          How does it all wrap up? Surprise endings are the best. What would make your friends laugh?
        </p>
        <textarea
          value={story.ending}
          onChange={(e) => updateStory({ ending: e.target.value })}
          placeholder="Is the problem solved? Is it solved in a weird way? Does something even weirder happen?"
          className="w-full border-2 border-gray-300 rounded-xl px-3 py-2 font-hand focus:border-comic-red focus:outline-none min-h-[100px] bg-white"
          maxLength={500}
        />
      </div>
    </div>
  );
}
