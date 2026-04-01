import type { StoryData } from '../../types/comic';
import { GENRE_INFO, COLOR_THEMES } from '../../types/comic';
import { renderCharacterSvg } from '../../utils/characterRenderer';

interface Props {
  story: StoryData;
  title: string;
  setTitle: (t: string) => void;
  authorName: string;
  setAuthorName: (n: string) => void;
}

export default function StepSummary({ story, title, setTitle, authorName, setAuthorName }: Props) {
  return (
    <div className="space-y-5">
      <div className="speech-bubble inline-block mb-2 text-left">
        <p className="font-hand text-lg text-comic-dark">
          Nearly there! Give your comic a title, check everything looks good, and let's build it!
        </p>
      </div>

      {/* Title & Author */}
      <div className="bg-white rounded-xl border-3 border-comic-dark p-4 space-y-3">
        <div>
          <label className="font-bangers text-base text-comic-dark block mb-1">Comic Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your comic an awesome name!"
            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 font-bangers text-xl focus:border-comic-orange focus:outline-none"
            maxLength={50}
          />
        </div>
        <div>
          <label className="font-bangers text-base text-comic-dark block mb-1">Author Name (that's you!)</label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your name here"
            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 font-hand text-lg focus:border-comic-orange focus:outline-none"
            maxLength={30}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl border-3 border-comic-dark p-4 space-y-4">
        <h3 className="font-bangers text-lg text-comic-dark">Your Story So Far</h3>

        {/* Genres */}
        {story.genres.length > 0 && (
          <div>
            <span className="font-bangers text-sm text-gray-500">Genre: </span>
            <span className="font-hand text-comic-dark">
              {story.genres.map(g => GENRE_INFO[g].label).join(' + ')}
            </span>
          </div>
        )}

        {/* Characters */}
        {story.characters.length > 0 && (
          <div>
            <span className="font-bangers text-sm text-gray-500 block mb-2">Characters:</span>
            <div className="flex gap-3 flex-wrap">
              {story.characters.map(char => (
                <div key={char.id} className="text-center">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: renderCharacterSvg(char, story.artStyle, 'standing', 60),
                    }}
                  />
                  <p className="font-hand text-sm mt-1">{char.name || 'Unnamed'}</p>
                  <p className="font-hand text-xs text-gray-400">{char.personality}</p>
                </div>
              ))}
            </div>
            {story.relationship && (
              <p className="font-hand text-sm text-gray-600 mt-2">
                Relationship: {story.relationship}
              </p>
            )}
          </div>
        )}

        {/* Story beats */}
        {story.incitingIncident && (
          <div>
            <span className="font-bangers text-sm text-gray-500">The Hook: </span>
            <span className="font-hand text-sm text-comic-dark">{story.incitingIncident}</span>
          </div>
        )}
        {story.beginning && (
          <div>
            <span className="font-bangers text-sm text-gray-500">Beginning: </span>
            <span className="font-hand text-sm text-comic-dark">{story.beginning.slice(0, 80)}{story.beginning.length > 80 ? '...' : ''}</span>
          </div>
        )}
        {story.middle && (
          <div>
            <span className="font-bangers text-sm text-gray-500">Middle: </span>
            <span className="font-hand text-sm text-comic-dark">{story.middle.slice(0, 80)}{story.middle.length > 80 ? '...' : ''}</span>
          </div>
        )}
        {story.ending && (
          <div>
            <span className="font-bangers text-sm text-gray-500">Ending: </span>
            <span className="font-hand text-sm text-comic-dark">{story.ending.slice(0, 80)}{story.ending.length > 80 ? '...' : ''}</span>
          </div>
        )}

        {/* Style */}
        <div className="flex gap-4 flex-wrap text-sm">
          <div>
            <span className="font-bangers text-gray-500">Style: </span>
            <span className="font-hand text-comic-dark capitalize">{story.artStyle.replace('-', ' ')}</span>
          </div>
          <div>
            <span className="font-bangers text-gray-500">Theme: </span>
            <span className="font-hand text-comic-dark">{COLOR_THEMES[story.colorTheme].label}</span>
          </div>
          <div>
            <span className="font-bangers text-gray-500">Font: </span>
            <span style={{ fontFamily: story.fontFamily }}>{story.fontFamily}</span>
          </div>
          <div>
            <span className="font-bangers text-gray-500">Layout: </span>
            <span className="font-hand text-comic-dark capitalize">{story.layoutStyle}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
