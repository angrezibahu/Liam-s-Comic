import { useState } from 'react';
import type { StoryData, Character } from '../../types/comic';
import { PERSONALITY_SUGGESTIONS } from '../../types/comic';
import { generateId } from '../../utils/storage';
import { renderCharacterSvg } from '../../utils/characterRenderer';

interface Props {
  story: StoryData;
  updateStory: (partial: Partial<StoryData>) => void;
}

const CHAR_TYPES = [
  { key: 'human', label: 'Human', emoji: '\u{1F9D1}' },
  { key: 'animal', label: 'Animal', emoji: '\u{1F43E}' },
  { key: 'robot', label: 'Robot', emoji: '\u{1F916}' },
  { key: 'monster', label: 'Monster', emoji: '\u{1F47E}' },
  { key: 'alien', label: 'Alien', emoji: '\u{1F47D}' },
  { key: 'food', label: 'Food Item', emoji: '\u{1F354}' },
  { key: 'custom', label: 'Something Else', emoji: '\u2753' },
];

const BODY_SHAPES: Character['bodyShape'][] = ['round', 'tall', 'boxy', 'blobby', 'triangle'];
const EYE_STYLES: Character['eyeStyle'][] = ['dots', 'wide', 'sleepy', 'angry', 'mismatched', 'x-eyes'];
const MOUTH_STYLES: Character['mouthStyle'][] = ['smile', 'frown', 'open-shock', 'toothy-grin', 'wavy', 'fangs'];
const COLORS = ['#FF6B35', '#4A90D9', '#34C759', '#FF3B30', '#8B5CF6', '#FFD60A', '#FF69B4', '#20B2AA', '#8B4513', '#888888'];
const ACCESSORIES = ['hat', 'crown', 'glasses', 'cape', 'antennae', 'horns', 'bow-tie', 'bandana', 'tail', 'wings'];

function createBlankChar(): Character {
  return {
    id: generateId(),
    name: '',
    type: 'human',
    personality: '',
    bodyShape: 'round',
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    accessories: [],
    eyeStyle: 'dots',
    mouthStyle: 'smile',
  };
}

export default function StepCharacters({ story, updateStory }: Props) {
  const [editingIdx, setEditingIdx] = useState(0);

  const chars = story.characters;

  const addCharacter = () => {
    if (chars.length >= 5) return;
    const newChars = [...chars, createBlankChar()];
    updateStory({ characters: newChars });
    setEditingIdx(newChars.length - 1);
  };

  const removeCharacter = (idx: number) => {
    const newChars = chars.filter((_, i) => i !== idx);
    updateStory({ characters: newChars });
    setEditingIdx(Math.max(0, editingIdx - 1));
  };

  const updateChar = (idx: number, partial: Partial<Character>) => {
    const newChars = chars.map((c, i) => (i === idx ? { ...c, ...partial } : c));
    updateStory({ characters: newChars });
  };

  const toggleAccessory = (idx: number, acc: string) => {
    const char = chars[idx];
    const newAcc = char.accessories.includes(acc)
      ? char.accessories.filter(a => a !== acc)
      : [...char.accessories, acc].slice(0, 2);
    updateChar(idx, { accessories: newAcc });
  };

  // Auto-create first character
  if (chars.length === 0) {
    updateStory({ characters: [createBlankChar()] });
    return null;
  }

  const current = chars[editingIdx];
  if (!current) {
    setEditingIdx(0);
    return null;
  }

  return (
    <div>
      <div className="speech-bubble inline-block mb-4 text-left">
        <p className="font-hand text-lg text-comic-dark">
          Who's in your story? Create 2-5 characters!
        </p>
      </div>

      {/* Character tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {chars.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setEditingIdx(i)}
            className={`font-hand px-3 py-1.5 rounded-lg border-2 transition-all text-sm ${
              i === editingIdx
                ? 'border-comic-orange bg-orange-50 text-comic-dark'
                : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {c.name || `Character ${i + 1}`}
          </button>
        ))}
        {chars.length < 5 && (
          <button
            onClick={addCharacter}
            className="font-hand px-3 py-1.5 rounded-lg border-2 border-dashed border-gray-400 text-gray-400 hover:border-comic-orange hover:text-comic-orange transition-colors text-sm"
          >
            + Add
          </button>
        )}
      </div>

      {/* Character editor */}
      <div className="bg-white rounded-xl border-3 border-comic-dark p-4 space-y-4">
        {/* Preview */}
        <div className="flex justify-center">
          <div
            dangerouslySetInnerHTML={{ __html: renderCharacterSvg(current, 'bold-bright', 'standing', 100) }}
          />
        </div>

        {/* Name */}
        <div>
          <label className="font-bangers text-sm text-comic-dark block mb-1">Name</label>
          <input
            type="text"
            value={current.name}
            onChange={(e) => updateChar(editingIdx, { name: e.target.value })}
            placeholder="What's their name?"
            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 font-hand text-lg focus:border-comic-orange focus:outline-none"
            maxLength={30}
          />
        </div>

        {/* Type */}
        <div>
          <label className="font-bangers text-sm text-comic-dark block mb-1">What are they?</label>
          <div className="flex flex-wrap gap-2">
            {CHAR_TYPES.map(t => (
              <button
                key={t.key}
                onClick={() => updateChar(editingIdx, { type: t.key })}
                className={`px-3 py-1.5 rounded-lg border-2 font-hand text-sm transition-all ${
                  current.type === t.key
                    ? 'border-comic-orange bg-orange-50'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
          {current.type === 'custom' && (
            <input
              type="text"
              value={current.customType || ''}
              onChange={(e) => updateChar(editingIdx, { customType: e.target.value })}
              placeholder="What kind of thing?"
              className="mt-2 w-full border-2 border-gray-300 rounded-lg px-3 py-2 font-hand focus:border-comic-orange focus:outline-none"
            />
          )}
        </div>

        {/* Personality */}
        <div>
          <label className="font-bangers text-sm text-comic-dark block mb-1">One word to describe them</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {PERSONALITY_SUGGESTIONS.map(p => (
              <button
                key={p}
                onClick={() => updateChar(editingIdx, { personality: p })}
                className={`px-2 py-1 rounded-md font-hand text-xs transition-all ${
                  current.personality === p
                    ? 'bg-comic-purple text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={current.personality}
            onChange={(e) => updateChar(editingIdx, { personality: e.target.value })}
            placeholder="Or type your own..."
            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 font-hand focus:border-comic-orange focus:outline-none"
            maxLength={20}
          />
        </div>

        {/* Visual builder */}
        <div className="grid grid-cols-2 gap-4">
          {/* Body shape */}
          <div>
            <label className="font-bangers text-xs text-comic-dark block mb-1">Body Shape</label>
            <div className="flex flex-wrap gap-1">
              {BODY_SHAPES.map(s => (
                <button
                  key={s}
                  onClick={() => updateChar(editingIdx, { bodyShape: s })}
                  className={`px-2 py-1 rounded text-xs font-hand capitalize transition-all ${
                    current.bodyShape === s ? 'bg-comic-blue text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="font-bangers text-xs text-comic-dark block mb-1">Colour</label>
            <div className="flex flex-wrap gap-1">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => updateChar(editingIdx, { color: c })}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    current.color === c ? 'border-comic-dark scale-110' : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Eyes */}
          <div>
            <label className="font-bangers text-xs text-comic-dark block mb-1">Eyes</label>
            <div className="flex flex-wrap gap-1">
              {EYE_STYLES.map(e => (
                <button
                  key={e}
                  onClick={() => updateChar(editingIdx, { eyeStyle: e })}
                  className={`px-2 py-1 rounded text-xs font-hand capitalize transition-all ${
                    current.eyeStyle === e ? 'bg-comic-blue text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Mouth */}
          <div>
            <label className="font-bangers text-xs text-comic-dark block mb-1">Mouth</label>
            <div className="flex flex-wrap gap-1">
              {MOUTH_STYLES.map(m => (
                <button
                  key={m}
                  onClick={() => updateChar(editingIdx, { mouthStyle: m })}
                  className={`px-2 py-1 rounded text-xs font-hand capitalize transition-all ${
                    current.mouthStyle === m ? 'bg-comic-blue text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Accessories */}
        <div>
          <label className="font-bangers text-xs text-comic-dark block mb-1">Accessories (pick up to 2)</label>
          <div className="flex flex-wrap gap-1.5">
            {ACCESSORIES.map(a => (
              <button
                key={a}
                onClick={() => toggleAccessory(editingIdx, a)}
                className={`px-2 py-1 rounded text-xs font-hand capitalize transition-all ${
                  current.accessories.includes(a)
                    ? 'bg-comic-green text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Remove character */}
        {chars.length > 1 && (
          <button
            onClick={() => removeCharacter(editingIdx)}
            className="font-hand text-sm text-red-400 hover:text-red-600 transition-colors"
          >
            Remove this character
          </button>
        )}
      </div>

      {/* Relationship */}
      {chars.length >= 2 && (
        <div className="mt-6">
          <div className="speech-bubble inline-block mb-3 text-left">
            <p className="font-hand text-base text-comic-dark">
              How do these characters know each other?
            </p>
          </div>
          <input
            type="text"
            value={story.relationship}
            onChange={(e) => updateStory({ relationship: e.target.value })}
            placeholder='e.g., "best friends", "rivals", "lab partners who accidentally created a portal"'
            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 font-hand focus:border-comic-orange focus:outline-none"
            maxLength={100}
          />
        </div>
      )}
    </div>
  );
}
