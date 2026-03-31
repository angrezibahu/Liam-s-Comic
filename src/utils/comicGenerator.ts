import type { StoryData, Comic, ComicPage, Panel } from '../types/comic';
import { SOUND_EFFECTS } from '../types/comic';
import { generateId } from './storage';
import type { BackgroundKey } from './backgroundRenderer';
import { getBackgroundsForGenre } from './backgroundRenderer';

function splitIntoSentences(text: string): string[] {
  if (!text.trim()) return [];
  return text
    .replace(/([.!?])\s+/g, '$1|')
    .split('|')
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickSoundEffect(): string {
  return pickRandom(SOUND_EFFECTS);
}

const NARRATION_TRANSITIONS = [
  'Meanwhile...', 'Later that day...', 'The next morning...',
  'But then...', 'Suddenly...', 'And so...', 'Little did they know...',
  'Back at the scene...', 'Just when things couldn\'t get worse...',
];

interface PanelSpec {
  text: string;
  type: 'narration' | 'dialogue' | 'action';
  section: 'beginning' | 'middle' | 'ending';
  speakerIdx?: number;
}

function buildPanelSpecs(story: StoryData): PanelSpec[] {
  const specs: PanelSpec[] = [];
  const charCount = story.characters.length;

  // Beginning
  const beginSentences = splitIntoSentences(story.beginning);
  if (beginSentences.length === 0) {
    specs.push({ text: 'Our story begins...', type: 'narration', section: 'beginning' });
  }
  beginSentences.forEach((s, i) => {
    if (i === 0) {
      specs.push({ text: s, type: 'narration', section: 'beginning' });
    } else {
      specs.push({ text: s, type: 'dialogue', section: 'beginning', speakerIdx: i % charCount });
    }
  });

  // Inciting incident
  if (story.incitingIncident) {
    specs.push({ text: 'Suddenly...', type: 'narration', section: 'middle' });
    specs.push({ text: story.incitingIncident, type: 'action', section: 'middle' });
    if (charCount > 0) {
      specs.push({
        text: `What on earth?!`,
        type: 'dialogue',
        section: 'middle',
        speakerIdx: 0,
      });
    }
  }

  // Middle
  const midSentences = splitIntoSentences(story.middle);
  if (midSentences.length === 0 && story.incitingIncident) {
    specs.push({ text: 'Things got complicated...', type: 'narration', section: 'middle' });
  }
  midSentences.forEach((s, i) => {
    if (i > 0 && i % 4 === 0) {
      specs.push({ text: pickRandom(NARRATION_TRANSITIONS), type: 'narration', section: 'middle' });
    }
    const isDialogue = i % 3 !== 0;
    specs.push({
      text: s,
      type: isDialogue ? 'dialogue' : 'narration',
      section: 'middle',
      speakerIdx: isDialogue ? (i % charCount) : undefined,
    });
  });

  // Ending
  const endSentences = splitIntoSentences(story.ending);
  specs.push({ text: 'And finally...', type: 'narration', section: 'ending' });
  endSentences.forEach((s, i) => {
    specs.push({
      text: s,
      type: i === endSentences.length - 1 ? 'narration' : 'dialogue',
      section: 'ending',
      speakerIdx: i < endSentences.length - 1 ? (i % charCount) : undefined,
    });
  });

  if (endSentences.length === 0) {
    specs.push({ text: 'THE END!', type: 'narration', section: 'ending' });
  }

  return specs;
}

function getLayoutForPanel(
  index: number,
  total: number,
  layoutStyle: 'neat' | 'dynamic'
): { width: number; height: number } {
  if (layoutStyle === 'neat') {
    return { width: 1, height: 1 };
  }
  // Dynamic layout: some panels are bigger
  if (index === 0 || index === total - 1) return { width: 2, height: 1 };
  if (index % 5 === 2) return { width: 1, height: 2 };
  if (index % 7 === 3) return { width: 2, height: 1 };
  return { width: 1, height: 1 };
}

export function generateComic(story: StoryData, title: string, authorName: string): Comic {
  const specs = buildPanelSpecs(story);
  const backgrounds = story.genres.length > 0
    ? getBackgroundsForGenre(story.genres[0])
    : ['outdoor-day', 'room', 'outdoor-night'] as BackgroundKey[];

  const charIds = story.characters.map(c => c.id);
  const poses: Array<'standing' | 'waving' | 'running' | 'arms-up'> = ['standing', 'waving', 'running', 'arms-up'];

  // Create panels from specs
  const panels: Panel[] = specs.map((spec, i) => {
    const layout = getLayoutForPanel(i, specs.length, story.layoutStyle);
    const bgIndex = spec.section === 'beginning' ? 0
      : spec.section === 'ending' ? backgrounds.length - 1
      : (i % (backgrounds.length - 1)) + 1;

    // Pick characters for this panel
    let panelChars: string[] = [];
    if (spec.speakerIdx !== undefined && charIds.length > 0) {
      panelChars = [charIds[spec.speakerIdx % charIds.length]];
      // Add a second character sometimes
      if (charIds.length > 1 && i % 3 !== 0) {
        const other = charIds[(spec.speakerIdx + 1) % charIds.length];
        panelChars.push(other);
      }
    } else if (spec.type === 'action') {
      panelChars = charIds.slice(0, Math.min(3, charIds.length));
    } else if (spec.type === 'narration' && i % 2 === 0 && charIds.length > 0) {
      panelChars = [pickRandom(charIds)];
    }

    const charPoses: Record<string, 'standing' | 'waving' | 'running' | 'arms-up'> = {};
    const charPositions: Record<string, number> = {};
    panelChars.forEach((cid, ci) => {
      charPoses[cid] = spec.type === 'action' ? pickRandom(poses) : poses[ci % 2 === 0 ? 0 : 1];
      charPositions[cid] = panelChars.length === 1 ? 50 : 25 + ci * 50 / Math.max(1, panelChars.length - 1) * 2;
    });

    const addSfx = spec.type === 'action' || (i % 5 === 3);

    return {
      id: generateId(),
      type: spec.type,
      text: spec.text,
      speaker: spec.speakerIdx !== undefined ? charIds[spec.speakerIdx % charIds.length] : undefined,
      background: backgrounds[bgIndex % backgrounds.length],
      characterIds: panelChars,
      characterPoses: charPoses,
      characterPositions: charPositions,
      soundEffect: addSfx ? pickSoundEffect() : undefined,
      width: layout.width,
      height: layout.height,
    };
  });

  // Pick most action-packed panel for coloring page
  const actionPanels = panels.filter(p => p.type === 'action');
  if (actionPanels.length > 0) {
    const coloringPanel = pickRandom(actionPanels);
    // Add a coloring version at the end
    panels.push({
      ...coloringPanel,
      id: generateId(),
      type: 'coloring',
      soundEffect: undefined,
      width: 2,
      height: 2,
    });
  }

  // Distribute panels across pages (3-6 panels per page)
  const pages: ComicPage[] = [];
  let pageStartIdx = 0;
  const panelsPerPage = story.layoutStyle === 'neat' ? 4 : 3;

  while (pageStartIdx < panels.length) {
    const isLastPanel = panels[pageStartIdx]?.type === 'coloring';
    const count = isLastPanel ? 1 : Math.min(panelsPerPage + Math.floor(Math.random() * 2), panels.length - pageStartIdx);
    pages.push({ panels: panels.slice(pageStartIdx, pageStartIdx + count) });
    pageStartIdx += count;
  }

  return {
    id: generateId(),
    title: title || 'My Awesome Comic',
    authorName: authorName || 'A Creative Genius',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    story,
    pages,
  };
}
