import type { Genre, ColorTheme } from '../types/comic';
import { COLOR_THEMES } from '../types/comic';

export type BackgroundKey =
  | 'outdoor-day'
  | 'outdoor-night'
  | 'school-hallway'
  | 'classroom'
  | 'space'
  | 'cave'
  | 'lab'
  | 'city'
  | 'forest'
  | 'room';

interface BgColors {
  sky: string;
  ground: string;
  accent: string;
  detail: string;
}

function getThemeColors(theme: ColorTheme): BgColors {
  const c = COLOR_THEMES[theme].colors;
  return { sky: c[0], ground: c[1], accent: c[2], detail: c[3] };
}

export function getBackgroundsForGenre(genre: Genre): BackgroundKey[] {
  switch (genre) {
    case 'monster': return ['outdoor-day', 'cave', 'city', 'forest', 'outdoor-night'];
    case 'space': return ['space', 'lab', 'outdoor-night', 'city'];
    case 'school': return ['school-hallway', 'classroom', 'outdoor-day', 'room'];
    case 'animals': return ['outdoor-day', 'forest', 'room', 'outdoor-night'];
    case 'mad-science': return ['lab', 'classroom', 'cave', 'city'];
    case 'quest': return ['forest', 'cave', 'outdoor-day', 'city', 'outdoor-night'];
    case 'weird': return ['outdoor-day', 'school-hallway', 'room', 'space', 'lab'];
  }
}

export function renderBackground(
  key: BackgroundKey,
  theme: ColorTheme,
  width: number = 400,
  height: number = 300
): string {
  const tc = getThemeColors(theme);

  switch (key) {
    case 'outdoor-day':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
        <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#87CEEB"/><stop offset="100%" stop-color="#B8E4F8"/></linearGradient></defs>
        <rect width="${width}" height="${height}" fill="url(#sky)"/>
        <circle cx="${width*0.8}" cy="40" r="25" fill="#FFD700" opacity="0.9"/>
        <rect y="${height*0.65}" width="${width}" height="${height*0.35}" fill="#7EC850"/>
        <ellipse cx="${width*0.2}" cy="${height*0.65}" rx="30" ry="${height*0.25}" fill="#5BA03E"/>
        <rect x="${width*0.18}" y="${height*0.4}" width="6" height="${height*0.25}" fill="#8B6914"/>
      </svg>`;

    case 'outdoor-night':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
        <defs><linearGradient id="nightsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0B1026"/><stop offset="100%" stop-color="#1A1A4E"/></linearGradient></defs>
        <rect width="${width}" height="${height}" fill="url(#nightsky)"/>
        ${Array.from({length: 20}, (_, i) => `<circle cx="${(i*53+17)%width}" cy="${(i*31+7)%Math.floor(height*0.6)}" r="1.5" fill="white" opacity="${0.5+Math.random()*0.5}"/>`).join('')}
        <circle cx="${width*0.7}" cy="45" r="20" fill="#FFFACD" opacity="0.9"/>
        <rect y="${height*0.7}" width="${width}" height="${height*0.3}" fill="#1A3A1A"/>
      </svg>`;

    case 'school-hallway':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
        <rect width="${width}" height="${height}" fill="#F5E6D0"/>
        <rect y="${height*0.7}" width="${width}" height="${height*0.3}" fill="#C4A882"/>
        <rect y="${height*0.45}" width="${width}" height="4" fill="${tc.accent}"/>
        ${Array.from({length: 5}, (_, i) => `<rect x="${i*width/5+10}" y="${height*0.15}" width="${width/5-20}" height="${height*0.3}" fill="#8B8B8B" rx="2" stroke="#666" stroke-width="1"/><line x1="${i*width/5+width/10}" y1="${height*0.15}" x2="${i*width/5+width/10}" y2="${height*0.45}" stroke="#666" stroke-width="1"/>`).join('')}
      </svg>`;

    case 'classroom':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
        <rect width="${width}" height="${height}" fill="#FFF8E7"/>
        <rect y="${height*0.7}" width="${width}" height="${height*0.3}" fill="#D4B896"/>
        <rect x="${width*0.15}" y="${height*0.1}" width="${width*0.7}" height="${height*0.35}" fill="#2D5A27" rx="3" stroke="#1A3A15" stroke-width="2"/>
        ${Array.from({length: 3}, (_, i) => `<g transform="translate(${width*0.15+i*width*0.28}, ${height*0.6})"><rect x="0" y="0" width="${width*0.2}" height="${height*0.12}" fill="#C4A060" stroke="#8B7340" stroke-width="1"/><rect x="${width*0.03}" y="${height*0.12}" width="4" height="${height*0.12}" fill="#8B7340"/><rect x="${width*0.15}" y="${height*0.12}" width="4" height="${height*0.12}" fill="#8B7340"/></g>`).join('')}
      </svg>`;

    case 'space':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
        <rect width="${width}" height="${height}" fill="#0A0A2A"/>
        ${Array.from({length: 30}, (_, i) => `<circle cx="${(i*47+13)%width}" cy="${(i*37+11)%height}" r="${1+Math.random()*1.5}" fill="white" opacity="${0.4+Math.random()*0.6}"/>`).join('')}
        <circle cx="${width*0.75}" cy="${height*0.4}" r="35" fill="#FF6347" opacity="0.7"/>
        <ellipse cx="${width*0.75}" cy="${height*0.4}" rx="55" ry="8" fill="none" stroke="#FFD700" stroke-width="2" opacity="0.5" transform="rotate(-15, ${width*0.75}, ${height*0.4})"/>
      </svg>`;

    case 'cave':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
        <rect width="${width}" height="${height}" fill="#2A1A0A"/>
        <ellipse cx="${width/2}" cy="${height/2}" rx="${width*0.4}" ry="${height*0.4}" fill="#3D2B1A"/>
        <ellipse cx="${width/2}" cy="${height/2}" rx="${width*0.3}" ry="${height*0.3}" fill="#4A3520" opacity="0.8"/>
        <polygon points="${width*0.2},0 ${width*0.25},${height*0.15} ${width*0.15},0" fill="#1A0A00"/>
        <polygon points="${width*0.5},0 ${width*0.55},${height*0.2} ${width*0.45},0" fill="#1A0A00"/>
        <polygon points="${width*0.75},0 ${width*0.8},${height*0.12} ${width*0.7},0" fill="#1A0A00"/>
        <circle cx="${width*0.3}" cy="${height*0.3}" r="8" fill="#FFD700" opacity="0.3"/><circle cx="${width*0.3}" cy="${height*0.3}" r="4" fill="#FFD700" opacity="0.6"/>
      </svg>`;

    case 'lab':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
        <rect width="${width}" height="${height}" fill="#E8E8E8"/>
        <rect y="${height*0.7}" width="${width}" height="${height*0.3}" fill="#CCC"/>
        <rect x="${width*0.05}" y="${height*0.3}" width="${width*0.9}" height="${height*0.05}" fill="#999" rx="2"/>
        <path d="M${width*0.2},${height*0.3} L${width*0.22},${height*0.15} L${width*0.28},${height*0.15} L${width*0.3},${height*0.3}" fill="none" stroke="#666" stroke-width="2"/>
        <ellipse cx="${width*0.25}" cy="${height*0.15}" rx="5" ry="3" fill="#44FF44" opacity="0.7"/>
        <rect x="${width*0.5}" y="${height*0.18}" width="${width*0.15}" height="${height*0.12}" fill="#87CEEB" stroke="#666" stroke-width="1.5" rx="1"/>
        <circle cx="${width*0.7}" cy="${height*0.25}" r="8" fill="#FF6347" opacity="0.6"/>
      </svg>`;

    case 'city':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
        <defs><linearGradient id="citysky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6BB3E0"/><stop offset="100%" stop-color="#A8D8EA"/></linearGradient></defs>
        <rect width="${width}" height="${height}" fill="url(#citysky)"/>
        <rect y="${height*0.8}" width="${width}" height="${height*0.2}" fill="#888"/>
        ${Array.from({length: 6}, (_, i) => {
          const bw = width / 8;
          const bh = height * (0.3 + (i % 3) * 0.15);
          const bx = i * width / 6 + 5;
          return `<rect x="${bx}" y="${height*0.8 - bh}" width="${bw}" height="${bh}" fill="#${['666','777','555','888','666','777'][i]}" stroke="#444" stroke-width="1"/>
          ${Array.from({length: Math.floor(bh/20)}, (_, j) => `<rect x="${bx+4}" y="${height*0.8-bh+j*20+4}" width="${bw/3}" height="8" fill="#FFD700" opacity="0.6"/><rect x="${bx+bw/2+2}" y="${height*0.8-bh+j*20+4}" width="${bw/3}" height="8" fill="#FFD700" opacity="0.4"/>`).join('')}`;
        }).join('')}
      </svg>`;

    case 'forest':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
        <rect width="${width}" height="${height}" fill="#87CEEB"/>
        <rect y="${height*0.6}" width="${width}" height="${height*0.4}" fill="#4A7C59"/>
        ${Array.from({length: 5}, (_, i) => {
          const tx = i * width / 5 + width / 10;
          return `<rect x="${tx-3}" y="${height*0.35}" width="6" height="${height*0.3}" fill="#8B6914"/>
          <polygon points="${tx},${height*0.15} ${tx+25},${height*0.4} ${tx-25},${height*0.4}" fill="#2D5A27"/>
          <polygon points="${tx},${height*0.08} ${tx+18},${height*0.28} ${tx-18},${height*0.28}" fill="#3A7A3F"/>`;
        }).join('')}
      </svg>`;

    case 'room':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
        <rect width="${width}" height="${height}" fill="#FFF0DB"/>
        <rect y="${height*0.7}" width="${width}" height="${height*0.3}" fill="#D4A574"/>
        <line x1="0" y1="${height*0.7}" x2="${width}" y2="${height*0.7}" stroke="#BA8C5E" stroke-width="3"/>
        <rect x="${width*0.35}" y="${height*0.1}" width="${width*0.3}" height="${height*0.35}" fill="#87CEEB" stroke="#8B6914" stroke-width="4" rx="2"/>
        <line x1="${width*0.5}" y1="${height*0.1}" x2="${width*0.5}" y2="${height*0.45}" stroke="#8B6914" stroke-width="2"/>
        <line x1="${width*0.35}" y1="${height*0.275}" x2="${width*0.65}" y2="${height*0.275}" stroke="#8B6914" stroke-width="2"/>
      </svg>`;
  }
}

export function getBackgroundLabel(key: BackgroundKey): string {
  const labels: Record<BackgroundKey, string> = {
    'outdoor-day': 'Outside (Day)',
    'outdoor-night': 'Outside (Night)',
    'school-hallway': 'School Hallway',
    'classroom': 'Classroom',
    'space': 'Outer Space',
    'cave': 'Cave',
    'lab': 'Science Lab',
    'city': 'City',
    'forest': 'Forest',
    'room': 'Room',
  };
  return labels[key];
}
