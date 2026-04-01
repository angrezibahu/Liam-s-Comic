import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Comic } from '../types/comic';
import { getComic } from '../utils/storage';
import { renderCharacterSvg, renderCharacterOutline } from '../utils/characterRenderer';
import type { BackgroundKey } from '../utils/backgroundRenderer';
import { renderBackground } from '../utils/backgroundRenderer';

export default function Read() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [comic, setComic] = useState<Comic | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (id) {
      const c = getComic(id);
      if (c) setComic(c);
      else navigate('/');
    }
  }, [id, navigate]);

  if (!comic) return null;

  const charMap = Object.fromEntries(comic.story.characters.map(c => [c.id, c]));
  const totalPages = comic.pages.length + 1; // +1 for title page

  const getFontClass = () => {
    switch (comic.story.fontFamily) {
      case 'Bangers': return 'font-bangers';
      case 'Patrick Hand': return 'font-hand';
      case 'Gaegu': return 'font-gaegu';
      case 'Permanent Marker': return 'font-marker';
      case 'Comic Neue': return 'font-comic';
    }
  };

  const goNext = () => setCurrentPage(p => Math.min(p + 1, totalPages - 1));
  const goPrev = () => setCurrentPage(p => Math.max(p - 1, 0));

  return (
    <div className="min-h-svh bg-comic-dark flex flex-col">
      {/* Header */}
      <header className="bg-comic-dark text-white py-3 px-4 flex items-center justify-between border-b border-gray-700">
        <button onClick={() => navigate('/')} className="font-hand text-lg hover:text-comic-yellow">
          {'\u2190'} Home
        </button>
        <span className="font-hand text-gray-400">
          {currentPage + 1} / {totalPages}
        </span>
        <button
          onClick={() => navigate(`/edit/${comic.id}`)}
          className="font-hand text-lg hover:text-comic-yellow"
        >
          Edit {'\u270F\uFE0F'}
        </button>
      </header>

      {/* Reader */}
      <div className="flex-1 flex items-center justify-center p-4">
        <button
          onClick={goPrev}
          disabled={currentPage === 0}
          className="text-white text-4xl px-2 hover:text-comic-yellow disabled:opacity-20 transition-colors flex-shrink-0"
        >
          {'\u2039'}
        </button>

        <div className="flex-1 max-w-2xl animate-slide-in" key={currentPage}>
          {currentPage === 0 ? (
            // Title page
            <div className="bg-white comic-panel p-8 text-center">
              <div className="py-12">
                <h2 className={`font-bangers text-4xl md:text-6xl text-comic-dark mb-4`}>
                  {comic.title}
                </h2>
                <p className={`text-xl text-gray-600 mb-8 ${getFontClass()}`}>by {comic.authorName}</p>
                <div className="flex gap-4 justify-center flex-wrap">
                  {comic.story.characters.map(char => (
                    <div key={char.id} className="text-center">
                      <div dangerouslySetInnerHTML={{
                        __html: renderCharacterSvg(char, comic.story.artStyle, 'standing', 80),
                      }} />
                      <p className={`text-sm mt-1 ${getFontClass()}`}>{char.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Comic page
            <div className="bg-white comic-panel p-3">
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns: comic.story.layoutStyle === 'neat'
                    ? 'repeat(2, 1fr)'
                    : 'repeat(3, 1fr)',
                }}
              >
                {comic.pages[currentPage - 1].panels.map((panel) => (
                  <div
                    key={panel.id}
                    className={`comic-panel relative animate-pop-in ${
                      panel.type === 'coloring' ? 'col-span-full' : ''
                    }`}
                    style={{
                      gridColumn: panel.width > 1 && panel.type !== 'coloring'
                        ? `span ${Math.min(panel.width, comic.story.layoutStyle === 'neat' ? 2 : 3)}`
                        : undefined,
                      gridRow: panel.height > 1 ? `span ${panel.height}` : undefined,
                      minHeight: panel.type === 'coloring' ? '250px' : '120px',
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      dangerouslySetInnerHTML={{
                        __html: renderBackground(
                          panel.background as BackgroundKey,
                          comic.story.colorTheme,
                          400, 300
                        ),
                      }}
                      style={{ opacity: panel.type === 'coloring' ? 0.1 : 1 }}
                    />
                    <div className="relative z-10 h-full flex flex-col justify-between p-2" style={{ minHeight: 'inherit' }}>
                      {panel.type === 'narration' && (
                        <div className={`narration-box text-xs md:text-sm self-start ${getFontClass()}`}>{panel.text}</div>
                      )}
                      {panel.type === 'dialogue' && (
                        <div className={`speech-bubble self-start text-xs md:text-sm ${getFontClass()}`}>
                          {panel.speaker && charMap[panel.speaker] && (
                            <strong className="text-comic-dark block text-xs">{charMap[panel.speaker].name}:</strong>
                          )}
                          {panel.text}
                        </div>
                      )}
                      {panel.type === 'coloring' && (
                        <div className="text-center py-4">
                          <p className="font-bangers text-lg text-comic-dark">
                            {'\u{1F58D}\u{FE0F}'} Your turn! Print and colour this one.
                          </p>
                        </div>
                      )}
                      <div className="flex items-end justify-around mt-auto">
                        {panel.characterIds.map(cid => {
                          const char = charMap[cid];
                          if (!char) return null;
                          const pose = panel.characterPoses[cid] || 'standing';
                          return (
                            <div
                              key={cid}
                              className="flex-shrink-0"
                              dangerouslySetInnerHTML={{
                                __html: panel.type === 'coloring'
                                  ? renderCharacterOutline(char, pose, 60)
                                  : renderCharacterSvg(char, comic.story.artStyle, pose, 50),
                              }}
                            />
                          );
                        })}
                      </div>
                      {panel.soundEffect && panel.type !== 'coloring' && (
                        <div className="sfx-text absolute top-1/2 right-2 -translate-y-1/2 text-base md:text-2xl pointer-events-none">
                          {panel.soundEffect}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={goNext}
          disabled={currentPage === totalPages - 1}
          className="text-white text-4xl px-2 hover:text-comic-yellow disabled:opacity-20 transition-colors flex-shrink-0"
        >
          {'\u203A'}
        </button>
      </div>
    </div>
  );
}
