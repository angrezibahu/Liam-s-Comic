import type { StoryData, Genre } from '../../types/comic';
import { GENRE_INFO } from '../../types/comic';

interface Props {
  story: StoryData;
  updateStory: (partial: Partial<StoryData>) => void;
}

export default function StepGenre({ story, updateStory }: Props) {
  const toggleGenre = (genre: Genre) => {
    const current = story.genres;
    if (current.includes(genre)) {
      updateStory({ genres: current.filter(g => g !== genre) });
    } else if (current.length < 2) {
      updateStory({ genres: [...current, genre] });
    } else {
      // Replace the second genre
      updateStory({ genres: [current[0], genre] });
    }
  };

  const mashupMessage = story.genres.length === 2
    ? getMashupMessage(story.genres[0], story.genres[1])
    : null;

  return (
    <div>
      <div className="speech-bubble inline-block mb-6 text-left">
        <p className="font-hand text-lg text-comic-dark">
          What kind of story are you making? Pick 1 or 2 genres — mashups are encouraged!
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 stagger-children">
        {(Object.entries(GENRE_INFO) as [Genre, typeof GENRE_INFO[Genre]][]).map(([key, info]) => {
          const selected = story.genres.includes(key);
          return (
            <button
              key={key}
              onClick={() => toggleGenre(key)}
              className={`animate-pop-in p-4 rounded-xl border-3 text-left transition-all ${
                selected
                  ? 'border-comic-orange bg-orange-50 shadow-[3px_3px_0_rgba(255,107,53,0.5)]'
                  : 'border-comic-dark bg-white hover:bg-gray-50 shadow-[2px_2px_0_rgba(45,45,45,0.3)]'
              }`}
            >
              <span className="text-3xl block mb-1">{info.emoji}</span>
              <span className="font-bangers text-base block text-comic-dark">{info.label}</span>
              <span className="font-hand text-xs text-gray-500">{info.description}</span>
            </button>
          );
        })}
      </div>

      {mashupMessage && (
        <div className="mt-4 text-center animate-fade-up">
          <p className="font-hand text-lg text-comic-orange font-bold">{mashupMessage}</p>
        </div>
      )}
    </div>
  );
}

function getMashupMessage(a: Genre, b: Genre): string {
  const combos: Record<string, string> = {
    'monster+space': 'Space monsters?! This is going to be EPIC!',
    'school+weird': 'Weird school? Sounds about right actually.',
    'animals+mad-science': 'Mad science + animals = superpowered pets!',
    'monster+school': 'Monsters at school? That\'s basically Tuesday.',
    'space+quest': 'A space quest! Like Star Wars but weirder!',
  };
  const key1 = `${a}+${b}`;
  const key2 = `${b}+${a}`;
  return combos[key1] || combos[key2] || 'Bold combo! This is going to be wild!';
}
