import type { StoryData, ArtStyle, ColorTheme, FontFamily } from '../../types/comic';
import { COLOR_THEMES } from '../../types/comic';
import { renderCharacterSvg } from '../../utils/characterRenderer';

interface Props {
  story: StoryData;
  updateStory: (partial: Partial<StoryData>) => void;
}

const ART_STYLES: { key: ArtStyle; label: string; description: string }[] = [
  { key: 'bold-bright', label: 'Bold & Bright', description: 'Thick outlines, flat colours' },
  { key: 'sketchy', label: 'Sketchy', description: 'Wobbly lines, cross-hatching' },
  { key: 'pixel', label: 'Pixel Art', description: 'Blocky retro game look' },
  { key: 'shadow-drama', label: 'Shadow & Drama', description: 'High contrast, dramatic' },
  { key: 'silly-doodle', label: 'Silly Doodle', description: 'Loose and exaggerated' },
];

const FONTS: { key: FontFamily; label: string }[] = [
  { key: 'Bangers', label: 'Bangers' },
  { key: 'Patrick Hand', label: 'Patrick Hand' },
  { key: 'Gaegu', label: 'Gaegu' },
  { key: 'Permanent Marker', label: 'Permanent Marker' },
  { key: 'Comic Neue', label: 'Comic Neue' },
];

export default function StepStyle({ story, updateStory }: Props) {
  const previewChar = story.characters[0] || {
    id: 'preview', name: 'Preview', type: 'human', personality: 'cool',
    bodyShape: 'round' as const, color: '#4A90D9', accessories: [],
    eyeStyle: 'wide' as const, mouthStyle: 'smile' as const,
  };

  return (
    <div className="space-y-6">
      <div className="speech-bubble inline-block mb-2 text-left">
        <p className="font-hand text-lg text-comic-dark">
          Time to pick your comic's look! Choose a style that matches your story's vibe.
        </p>
      </div>

      {/* Art Style */}
      <div>
        <label className="font-bangers text-lg text-comic-dark block mb-2">Art Style</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {ART_STYLES.map(style => (
            <button
              key={style.key}
              onClick={() => updateStory({ artStyle: style.key })}
              className={`p-3 rounded-xl border-3 text-center transition-all ${
                story.artStyle === style.key
                  ? 'border-comic-orange bg-orange-50 shadow-[3px_3px_0_rgba(255,107,53,0.5)]'
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <div
                className="mx-auto mb-2"
                dangerouslySetInnerHTML={{
                  __html: renderCharacterSvg(previewChar, style.key, 'standing', 50),
                }}
              />
              <span className="font-bangers text-sm block">{style.label}</span>
              <span className="font-hand text-xs text-gray-500">{style.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Colour Theme */}
      <div>
        <label className="font-bangers text-lg text-comic-dark block mb-2">Colour Theme</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {(Object.entries(COLOR_THEMES) as [ColorTheme, typeof COLOR_THEMES[ColorTheme]][]).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => updateStory({ colorTheme: key })}
              className={`p-3 rounded-xl border-3 text-center transition-all ${
                story.colorTheme === key
                  ? 'border-comic-orange bg-orange-50'
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex gap-1 justify-center mb-1">
                {theme.colors.map((c, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border border-gray-200" style={{ backgroundColor: c }} />
                ))}
              </div>
              <span className="font-bangers text-sm block">{theme.label}</span>
              <span className="font-hand text-xs text-gray-500">{theme.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Font */}
      <div>
        <label className="font-bangers text-lg text-comic-dark block mb-2">Font</label>
        <div className="flex flex-wrap gap-2">
          {FONTS.map(font => (
            <button
              key={font.key}
              onClick={() => updateStory({ fontFamily: font.key })}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                story.fontFamily === font.key
                  ? 'border-comic-orange bg-orange-50'
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
              style={{ fontFamily: font.key }}
            >
              <span className="text-lg">{font.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Layout */}
      <div>
        <label className="font-bangers text-lg text-comic-dark block mb-2">Panel Layout</label>
        <div className="flex gap-3">
          <button
            onClick={() => updateStory({ layoutStyle: 'neat' })}
            className={`flex-1 p-4 rounded-xl border-3 text-center transition-all ${
              story.layoutStyle === 'neat'
                ? 'border-comic-orange bg-orange-50'
                : 'border-gray-300 bg-white hover:bg-gray-50'
            }`}
          >
            <div className="grid grid-cols-2 gap-1 mb-2 mx-auto w-16">
              <div className="h-5 bg-gray-300 rounded-sm" />
              <div className="h-5 bg-gray-300 rounded-sm" />
              <div className="h-5 bg-gray-300 rounded-sm" />
              <div className="h-5 bg-gray-300 rounded-sm" />
            </div>
            <span className="font-bangers text-sm">Neat & Tidy</span>
          </button>
          <button
            onClick={() => updateStory({ layoutStyle: 'dynamic' })}
            className={`flex-1 p-4 rounded-xl border-3 text-center transition-all ${
              story.layoutStyle === 'dynamic'
                ? 'border-comic-orange bg-orange-50'
                : 'border-gray-300 bg-white hover:bg-gray-50'
            }`}
          >
            <div className="grid grid-cols-3 gap-1 mb-2 mx-auto w-16">
              <div className="h-5 bg-gray-300 rounded-sm col-span-2" />
              <div className="h-5 bg-gray-300 rounded-sm" />
              <div className="h-5 bg-gray-300 rounded-sm" />
              <div className="h-5 bg-gray-300 rounded-sm col-span-2" />
            </div>
            <span className="font-bangers text-sm">Wild & Dynamic</span>
          </button>
        </div>
      </div>
    </div>
  );
}
