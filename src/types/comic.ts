export interface Character {
  id: string;
  name: string;
  type: string; // human, animal, robot, monster, alien, food, custom
  customType?: string;
  personality: string;
  bodyShape: 'round' | 'tall' | 'boxy' | 'blobby' | 'triangle';
  color: string;
  accessories: string[]; // hat, glasses, cape, tail, antennae, horns, bow-tie, bandana, wings, crown
  eyeStyle: 'dots' | 'wide' | 'sleepy' | 'angry' | 'mismatched' | 'x-eyes';
  mouthStyle: 'smile' | 'frown' | 'open-shock' | 'toothy-grin' | 'wavy' | 'fangs';
}

export type Genre =
  | 'monster'
  | 'space'
  | 'school'
  | 'animals'
  | 'mad-science'
  | 'quest'
  | 'weird';

export type ArtStyle =
  | 'bold-bright'
  | 'sketchy'
  | 'pixel'
  | 'shadow-drama'
  | 'silly-doodle';

export type ColorTheme =
  | 'classic'
  | 'monster-mash'
  | 'sketch-mode'
  | 'candy-pop'
  | 'dino-danger'
  | 'ocean-deep';

export type FontFamily =
  | 'Bangers'
  | 'Patrick Hand'
  | 'Gaegu'
  | 'Permanent Marker'
  | 'Comic Neue';

export type LayoutStyle = 'neat' | 'dynamic';

export interface StoryData {
  genres: Genre[];
  characters: Character[];
  relationship: string;
  incitingIncident: string;
  beginning: string;
  middle: string;
  ending: string;
  arcCharacterId?: string;
  arcDescription?: string;
  artStyle: ArtStyle;
  colorTheme: ColorTheme;
  fontFamily: FontFamily;
  layoutStyle: LayoutStyle;
}

export interface Panel {
  id: string;
  type: 'narration' | 'dialogue' | 'action' | 'coloring';
  text: string;
  speaker?: string; // character id
  background: string; // background key
  characterIds: string[];
  characterPoses: Record<string, 'standing' | 'waving' | 'running' | 'arms-up'>;
  characterPositions: Record<string, number>; // x position 0-100
  soundEffect?: string;
  width: number; // 1-3 columns
  height: number; // 1-2 rows
}

export interface ComicPage {
  panels: Panel[];
}

export interface Comic {
  id: string;
  title: string;
  authorName: string;
  createdAt: number;
  updatedAt: number;
  story: StoryData;
  pages: ComicPage[];
}

export const DEFAULT_STORY: StoryData = {
  genres: [],
  characters: [],
  relationship: '',
  incitingIncident: '',
  beginning: '',
  middle: '',
  ending: '',
  artStyle: 'bold-bright',
  colorTheme: 'classic',
  fontFamily: 'Bangers',
  layoutStyle: 'neat',
};

export const GENRE_INFO: Record<Genre, { label: string; emoji: string; description: string }> = {
  monster: { label: 'Monster / Creature Feature', emoji: '\u{1F996}', description: 'Big creatures, bigger problems' },
  space: { label: 'Space Adventure', emoji: '\u{1F680}', description: 'Blast off into the unknown' },
  school: { label: 'School Chaos', emoji: '\u{1F3EB}', description: 'When school goes completely wrong' },
  animals: { label: 'Animals Gone Wild', emoji: '\u{1F430}', description: 'Furry friends causing mayhem' },
  'mad-science': { label: 'Mad Science', emoji: '\u{1F9EA}', description: 'Experiments that go VERY wrong' },
  quest: { label: 'Quest / Treasure Hunt', emoji: '\u{1F3F4}\u{200D}\u{2620}\u{FE0F}', description: 'Adventures and epic journeys' },
  weird: { label: 'Just Plain Weird', emoji: '\u{1F92A}', description: 'Nothing makes sense and that\'s fine' },
};

export const COLOR_THEMES: Record<ColorTheme, { label: string; colors: string[]; description: string }> = {
  classic: { label: 'Classic Comic', colors: ['#FF3B30', '#007AFF', '#FFD60A', '#34C759', '#FF9500'], description: 'Bold primaries' },
  'monster-mash': { label: 'Monster Mash', colors: ['#4A7C59', '#8B5CF6', '#1A1A2E', '#6B8F71', '#9B59B6'], description: 'Greens & purples' },
  'sketch-mode': { label: 'Sketch Mode', colors: ['#2D2D2D', '#5C5C5C', '#8C8C8C', '#BDBDBD', '#E0E0E0'], description: 'Pencil greyscale' },
  'candy-pop': { label: 'Candy Pop', colors: ['#FF6B9D', '#C44569', '#FFC75F', '#845EC2', '#00C9A7'], description: 'Pastels & neons' },
  'dino-danger': { label: 'Dino Danger', colors: ['#8B4513', '#228B22', '#FF4500', '#DAA520', '#2F4F4F'], description: 'Earthy + lava' },
  'ocean-deep': { label: 'Ocean Deep', colors: ['#006994', '#40E0D0', '#003366', '#48D1CC', '#20B2AA'], description: 'Blues & teals' },
};

export const PERSONALITY_SUGGESTIONS = [
  'sneaky', 'brave', 'confused', 'hungry', 'grumpy',
  'silly', 'clever', 'chaotic', 'nervous', 'dramatic',
  'lazy', 'hyper', 'mysterious', 'kind', 'bossy',
];

export const INCIDENT_EXAMPLES = [
  'A toilet starts talking',
  'The school turns upside down — literally',
  'A dinosaur appears in the garden',
  "Everyone's pet gets superpowers",
  'Gravity stops working but only for socks',
  'The headteacher turns into a giant chicken',
  'A portal opens in the fridge',
  'All the food in the canteen comes alive',
];

export const SOUND_EFFECTS = [
  'POW!', 'CRASH!', 'SPLAT!', 'BOOM!', 'WHOOSH!',
  'ZAP!', 'BANG!', 'THUD!', 'CRACK!', 'BOING!',
  'SPLOSH!', 'KABOOM!', 'WHAM!', 'CRUNCH!', 'POP!',
];
