import type { Character, ArtStyle } from '../types/comic';

type Pose = 'standing' | 'waving' | 'running' | 'arms-up';

function getStrokeStyle(style: ArtStyle): { width: number; dasharray: string; filter: string } {
  switch (style) {
    case 'bold-bright': return { width: 3, dasharray: '', filter: '' };
    case 'sketchy': return { width: 1.5, dasharray: '3,1', filter: 'url(#sketchy)' };
    case 'pixel': return { width: 2, dasharray: '', filter: '' };
    case 'shadow-drama': return { width: 2.5, dasharray: '', filter: 'url(#shadow)' };
    case 'silly-doodle': return { width: 2, dasharray: '5,2', filter: '' };
  }
}

function getBodyPath(shape: Character['bodyShape'], _pose: Pose): string {
  const w = shape === 'tall' ? 30 : shape === 'boxy' ? 40 : 36;
  const h = shape === 'tall' ? 50 : shape === 'round' ? 36 : shape === 'blobby' ? 38 : 40;
  const cx = 50;
  const cy = 65;

  switch (shape) {
    case 'round':
      return `<ellipse cx="${cx}" cy="${cy}" rx="${w/2}" ry="${h/2}" />`;
    case 'tall':
      return `<rect x="${cx - w/2}" y="${cy - h/2}" width="${w}" height="${h}" rx="8" />`;
    case 'boxy':
      return `<rect x="${cx - w/2}" y="${cy - h/2}" width="${w}" height="${h}" rx="3" />`;
    case 'triangle':
      return `<polygon points="${cx},${cy - h/2} ${cx + w/2},${cy + h/2} ${cx - w/2},${cy + h/2}" />`;
    case 'blobby':
      return `<path d="M${cx-w/2},${cy} Q${cx-w/2},${cy-h/2} ${cx},${cy-h/2} Q${cx+w/2},${cy-h/2} ${cx+w/2},${cy} Q${cx+w/2},${cy+h/2} ${cx},${cy+h/2} Q${cx-w/2},${cy+h/2} ${cx-w/2},${cy}" />`;
  }
}

function getHeadSvg(shape: Character['bodyShape']): string {
  const cx = 50;
  const cy = 32;
  switch (shape) {
    case 'round':
    case 'blobby':
      return `<circle cx="${cx}" cy="${cy}" r="18" />`;
    case 'tall':
      return `<ellipse cx="${cx}" cy="${cy}" rx="14" ry="16" />`;
    case 'boxy':
      return `<rect x="${cx - 16}" y="${cy - 14}" width="32" height="28" rx="4" />`;
    case 'triangle':
      return `<polygon points="${cx},${cy - 16} ${cx + 16},${cy + 12} ${cx - 16},${cy + 12}" />`;
  }
}

function getEyes(style: Character['eyeStyle']): string {
  const cy = 30;
  switch (style) {
    case 'dots':
      return `<circle cx="43" cy="${cy}" r="2.5" fill="black"/><circle cx="57" cy="${cy}" r="2.5" fill="black"/>`;
    case 'wide':
      return `<ellipse cx="43" cy="${cy}" rx="4" ry="5" fill="white" stroke="black" stroke-width="1.5"/><circle cx="43" cy="${cy}" r="2" fill="black"/><ellipse cx="57" cy="${cy}" rx="4" ry="5" fill="white" stroke="black" stroke-width="1.5"/><circle cx="57" cy="${cy}" r="2" fill="black"/>`;
    case 'sleepy':
      return `<line x1="39" y1="${cy}" x2="47" y2="${cy}" stroke="black" stroke-width="2" stroke-linecap="round"/><line x1="53" y1="${cy}" x2="61" y2="${cy}" stroke="black" stroke-width="2" stroke-linecap="round"/>`;
    case 'angry':
      return `<circle cx="43" cy="${cy}" r="2.5" fill="black"/><circle cx="57" cy="${cy}" r="2.5" fill="black"/><line x1="39" y1="${cy-5}" x2="47" y2="${cy-3}" stroke="black" stroke-width="2" stroke-linecap="round"/><line x1="61" y1="${cy-5}" x2="53" y2="${cy-3}" stroke="black" stroke-width="2" stroke-linecap="round"/>`;
    case 'mismatched':
      return `<circle cx="43" cy="${cy}" r="4" fill="white" stroke="black" stroke-width="1.5"/><circle cx="43" cy="${cy}" r="2" fill="black"/><circle cx="57" cy="${cy}" r="2" fill="black"/>`;
    case 'x-eyes':
      return `<line x1="40" y1="${cy-3}" x2="46" y2="${cy+3}" stroke="black" stroke-width="2"/><line x1="46" y1="${cy-3}" x2="40" y2="${cy+3}" stroke="black" stroke-width="2"/><line x1="54" y1="${cy-3}" x2="60" y2="${cy+3}" stroke="black" stroke-width="2"/><line x1="60" y1="${cy-3}" x2="54" y2="${cy+3}" stroke="black" stroke-width="2"/>`;
  }
}

function getMouth(style: Character['mouthStyle']): string {
  const cy = 39;
  switch (style) {
    case 'smile':
      return `<path d="M43,${cy} Q50,${cy+6} 57,${cy}" fill="none" stroke="black" stroke-width="2" stroke-linecap="round"/>`;
    case 'frown':
      return `<path d="M43,${cy+4} Q50,${cy-2} 57,${cy+4}" fill="none" stroke="black" stroke-width="2" stroke-linecap="round"/>`;
    case 'open-shock':
      return `<ellipse cx="50" cy="${cy+2}" rx="5" ry="6" fill="black"/>`;
    case 'toothy-grin':
      return `<path d="M42,${cy} Q50,${cy+8} 58,${cy}" fill="white" stroke="black" stroke-width="2"/><line x1="47" y1="${cy}" x2="47" y2="${cy+4}" stroke="black" stroke-width="1"/><line x1="53" y1="${cy}" x2="53" y2="${cy+4}" stroke="black" stroke-width="1"/>`;
    case 'wavy':
      return `<path d="M42,${cy+2} Q45,${cy-1} 48,${cy+2} Q51,${cy+5} 54,${cy+2} Q57,${cy-1} 58,${cy+2}" fill="none" stroke="black" stroke-width="2" stroke-linecap="round"/>`;
    case 'fangs':
      return `<path d="M42,${cy} Q50,${cy+6} 58,${cy}" fill="none" stroke="black" stroke-width="2" stroke-linecap="round"/><polygon points="45,${cy} 44,${cy+5} 47,${cy}" fill="white" stroke="black" stroke-width="1"/><polygon points="53,${cy} 56,${cy+5} 55,${cy}" fill="white" stroke="black" stroke-width="1"/>`;
  }
}

function getArms(pose: Pose): string {
  switch (pose) {
    case 'standing':
      return `<line x1="32" y1="55" x2="22" y2="72" stroke="black" stroke-width="3" stroke-linecap="round"/><line x1="68" y1="55" x2="78" y2="72" stroke="black" stroke-width="3" stroke-linecap="round"/>`;
    case 'waving':
      return `<line x1="32" y1="55" x2="22" y2="72" stroke="black" stroke-width="3" stroke-linecap="round"/><polyline points="68,55 78,45 82,35" fill="none" stroke="black" stroke-width="3" stroke-linecap="round"/>`;
    case 'running':
      return `<line x1="32" y1="55" x2="18" y2="60" stroke="black" stroke-width="3" stroke-linecap="round"/><line x1="68" y1="55" x2="82" y2="50" stroke="black" stroke-width="3" stroke-linecap="round"/>`;
    case 'arms-up':
      return `<polyline points="32,55 22,40 18,28" fill="none" stroke="black" stroke-width="3" stroke-linecap="round"/><polyline points="68,55 78,40 82,28" fill="none" stroke="black" stroke-width="3" stroke-linecap="round"/>`;
  }
}

function getLegs(pose: Pose): string {
  const top = 82;
  switch (pose) {
    case 'standing':
      return `<line x1="42" y1="${top}" x2="38" y2="98" stroke="black" stroke-width="3" stroke-linecap="round"/><line x1="58" y1="${top}" x2="62" y2="98" stroke="black" stroke-width="3" stroke-linecap="round"/>`;
    case 'waving':
      return `<line x1="42" y1="${top}" x2="38" y2="98" stroke="black" stroke-width="3" stroke-linecap="round"/><line x1="58" y1="${top}" x2="62" y2="98" stroke="black" stroke-width="3" stroke-linecap="round"/>`;
    case 'running':
      return `<line x1="42" y1="${top}" x2="30" y2="96" stroke="black" stroke-width="3" stroke-linecap="round"/><line x1="58" y1="${top}" x2="70" y2="96" stroke="black" stroke-width="3" stroke-linecap="round"/>`;
    case 'arms-up':
      return `<line x1="44" y1="${top}" x2="40" y2="98" stroke="black" stroke-width="3" stroke-linecap="round"/><line x1="56" y1="${top}" x2="60" y2="98" stroke="black" stroke-width="3" stroke-linecap="round"/>`;
  }
}

function getAccessory(acc: string): string {
  switch (acc) {
    case 'hat':
      return `<rect x="36" y="10" width="28" height="10" rx="2" fill="#333"/><rect x="32" y="18" width="36" height="4" rx="2" fill="#333"/>`;
    case 'crown':
      return `<polygon points="36,18 38,8 42,14 46,6 50,14 54,6 58,14 62,8 64,18" fill="#FFD700" stroke="#DAA520" stroke-width="1"/>`;
    case 'glasses':
      return `<circle cx="43" cy="30" r="6" fill="none" stroke="#333" stroke-width="2"/><circle cx="57" cy="30" r="6" fill="none" stroke="#333" stroke-width="2"/><line x1="49" y1="30" x2="51" y2="30" stroke="#333" stroke-width="2"/>`;
    case 'cape':
      return `<path d="M35,48 Q30,70 25,90 L50,82 L75,90 Q70,70 65,48" fill="#CC0000" opacity="0.8"/>`;
    case 'antennae':
      return `<line x1="44" y1="16" x2="38" y2="4" stroke="black" stroke-width="2"/><circle cx="38" cy="4" r="3" fill="#FF6B35"/><line x1="56" y1="16" x2="62" y2="4" stroke="black" stroke-width="2"/><circle cx="62" cy="4" r="3" fill="#FF6B35"/>`;
    case 'horns':
      return `<polygon points="38,18 34,4 42,16" fill="#8B4513"/><polygon points="62,18 66,4 58,16" fill="#8B4513"/>`;
    case 'bow-tie':
      return `<polygon points="44,50 50,46 56,50 50,54" fill="#FF3B30" stroke="#2D2D2D" stroke-width="1"/>`;
    case 'bandana':
      return `<path d="M34,22 Q50,28 66,22 Q64,18 50,16 Q36,18 34,22Z" fill="#E74C3C"/>`;
    case 'tail':
      return `<path d="M68,78 Q80,75 85,68 Q88,62 82,60" fill="none" stroke="black" stroke-width="3" stroke-linecap="round"/>`;
    case 'wings':
      return `<path d="M32,52 Q15,42 12,55 Q15,65 32,60" fill="rgba(150,200,255,0.6)" stroke="black" stroke-width="1.5"/><path d="M68,52 Q85,42 88,55 Q85,65 68,60" fill="rgba(150,200,255,0.6)" stroke="black" stroke-width="1.5"/>`;
    default:
      return '';
  }
}

export function renderCharacterSvg(
  character: Character,
  artStyle: ArtStyle = 'bold-bright',
  pose: Pose = 'standing',
  size: number = 100
): string {
  const ss = getStrokeStyle(artStyle);
  const fillColor = character.color || '#4A90D9';

  const filters = `
    <defs>
      <filter id="sketchy"><feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2"/></filter>
      <filter id="shadow"><feDropShadow dx="2" dy="2" stdDeviation="1" flood-opacity="0.4"/></filter>
    </defs>
  `;

  // Cape goes behind body
  const capeAccessory = character.accessories.includes('cape') ? getAccessory('cape') : '';
  const otherAccessories = character.accessories
    .filter(a => a !== 'cape')
    .map(getAccessory)
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 105" width="${size}" height="${size * 1.05}">
    ${filters}
    <g ${ss.filter ? `filter="${ss.filter}"` : ''}>
      ${capeAccessory}
      <g fill="${fillColor}" stroke="black" stroke-width="${ss.width}" ${ss.dasharray ? `stroke-dasharray="${ss.dasharray}"` : ''}>
        ${getBodyPath(character.bodyShape, pose)}
        ${getHeadSvg(character.bodyShape)}
      </g>
      ${getEyes(character.eyeStyle)}
      ${getMouth(character.mouthStyle)}
      ${getArms(pose)}
      ${getLegs(pose)}
      ${otherAccessories}
    </g>
  </svg>`;

  return svg;
}

export function renderCharacterOutline(
  character: Character,
  pose: Pose = 'standing',
  size: number = 100
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 105" width="${size}" height="${size * 1.05}">
    <g fill="none" stroke="black" stroke-width="2">
      ${getBodyPath(character.bodyShape, pose)}
      ${getHeadSvg(character.bodyShape)}
    </g>
    ${getEyes(character.eyeStyle)}
    ${getMouth(character.mouthStyle)}
    ${getArms(pose)}
    ${getLegs(pose)}
    ${character.accessories.map(getAccessory).join('')}
  </svg>`;

  return svg;
}
