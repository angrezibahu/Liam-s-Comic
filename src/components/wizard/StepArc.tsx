import type { StoryData } from '../../types/comic';

interface Props {
  story: StoryData;
  updateStory: (partial: Partial<StoryData>) => void;
}

const ARC_EXAMPLES = [
  'They were scared but now they\'re brave',
  'They were mean but learned to be kind',
  'They were boring but now they ride a dinosaur to school every day',
  'They didn\'t believe in themselves but now they do',
  'They were a loner but found a best friend',
  'They were too serious but learned to be silly',
];

export default function StepArc({ story, updateStory }: Props) {
  const chars = story.characters;

  return (
    <div>
      <div className="speech-bubble inline-block mb-6 text-left">
        <p className="font-hand text-lg text-comic-dark">
          The best stories have someone who changes. Even if it's just a little bit. This step is optional — but it makes stories way better!
        </p>
      </div>

      {chars.length > 0 && (
        <>
          {/* Pick a character */}
          <div className="mb-4">
            <label className="font-bangers text-base text-comic-dark block mb-2">
              Which character changes the most?
            </label>
            <div className="flex flex-wrap gap-2">
              {chars.map(c => (
                <button
                  key={c.id}
                  onClick={() => updateStory({ arcCharacterId: c.id })}
                  className={`px-4 py-2 rounded-lg border-2 font-hand transition-all ${
                    story.arcCharacterId === c.id
                      ? 'border-comic-purple bg-purple-50 text-comic-dark'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {c.name || 'Unnamed'}
                </button>
              ))}
            </div>
          </div>

          {/* Arc description */}
          <div className="mb-4">
            <label className="font-bangers text-base text-comic-dark block mb-2">
              How are they DIFFERENT at the end compared to the beginning?
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {ARC_EXAMPLES.map(ex => (
                <button
                  key={ex}
                  onClick={() => updateStory({ arcDescription: ex })}
                  className={`px-3 py-1.5 rounded-lg border-2 font-hand text-sm transition-all ${
                    story.arcDescription === ex
                      ? 'border-comic-purple bg-purple-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  {ex}
                </button>
              ))}
            </div>
            <textarea
              value={story.arcDescription || ''}
              onChange={(e) => updateStory({ arcDescription: e.target.value })}
              placeholder="Or describe it in your own words..."
              className="w-full border-2 border-gray-300 rounded-xl px-3 py-2 font-hand focus:border-comic-purple focus:outline-none min-h-[80px] bg-white"
              maxLength={200}
            />
          </div>
        </>
      )}

      {chars.length === 0 && (
        <p className="font-hand text-gray-500 text-center py-8">
          Go back and create some characters first!
        </p>
      )}

      <p className="font-hand text-sm text-gray-400 text-center mt-4">
        Can't think of anything? That's totally fine — skip this step and keep going!
      </p>
    </div>
  );
}
