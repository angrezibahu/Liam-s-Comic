import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Comic, Panel as PanelType } from '../types/comic';
import { getComic, saveComic } from '../utils/storage';
import { renderCharacterSvg, renderCharacterOutline } from '../utils/characterRenderer';
import { renderBackground } from '../utils/backgroundRenderer';
import type { PageSize } from '../utils/pdfExport';
import { exportToPdf } from '../utils/pdfExport';

export default function Preview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [comic, setComic] = useState<Comic | null>(null);
  const [editingPanel, setEditingPanel] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [exporting, setExporting] = useState(false);
  const [pageSize, setPageSize] = useState<PageSize>('a4');

  useEffect(() => {
    if (id) {
      const c = getComic(id);
      if (c) setComic(c);
      else navigate('/');
    }
  }, [id, navigate]);

  if (!comic) return null;

  const charMap = Object.fromEntries(comic.story.characters.map(c => [c.id, c]));

  const handlePanelEdit = (panel: PanelType) => {
    setEditingPanel(panel.id);
    setEditText(panel.text);
  };

  const saveEdit = () => {
    if (!editingPanel || !comic) return;
    const updated = {
      ...comic,
      updatedAt: Date.now(),
      pages: comic.pages.map(page => ({
        ...page,
        panels: page.panels.map(p =>
          p.id === editingPanel ? { ...p, text: editText } : p
        ),
      })),
    };
    setComic(updated);
    saveComic(updated);
    setEditingPanel(null);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportToPdf(comic, pageSize);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Try again!');
    }
    setExporting(false);
  };

  const getFontClass = () => {
    switch (comic.story.fontFamily) {
      case 'Bangers': return 'font-bangers';
      case 'Patrick Hand': return 'font-hand';
      case 'Gaegu': return 'font-gaegu';
      case 'Permanent Marker': return 'font-marker';
      case 'Comic Neue': return 'font-comic';
    }
  };

  return (
    <div className="min-h-svh bg-comic-cream">
      {/* Header */}
      <header className="bg-comic-dark text-white py-4 px-4 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="font-hand text-lg hover:text-comic-yellow transition-colors">
          {'\u2190'} Home
        </button>
        <h1 className="font-bangers text-2xl">{comic.title}</h1>
        <div className="flex gap-2 items-center">
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value as PageSize)}
            className="bg-gray-700 text-white text-sm rounded px-2 py-1 font-hand"
          >
            <option value="a4">A4</option>
            <option value="letter">Letter</option>
          </select>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="bg-comic-orange px-4 py-2 rounded-lg font-bangers text-lg hover:bg-orange-500 transition-colors disabled:opacity-50"
          >
            {exporting ? 'Exporting...' : '\u{1F5A8}\u{FE0F} Print!'}
          </button>
        </div>
      </header>

      <p className="text-center font-hand text-sm text-gray-500 mt-2 px-4">
        Tap any panel to edit the text
      </p>

      {/* Comic Preview */}
      <div id="comic-preview" className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        {/* Title Page */}
        <div className="comic-page-export bg-white comic-panel p-8 text-center">
          <div className="py-12">
            <h2 className={`font-bangers text-4xl md:text-6xl text-comic-dark mb-4 ${getFontClass()}`}>
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

        {/* Comic Pages */}
        {comic.pages.map((page, pageIdx) => (
          <div key={pageIdx} className="comic-page-export bg-white comic-panel p-3">
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: comic.story.layoutStyle === 'neat'
                  ? 'repeat(2, 1fr)'
                  : 'repeat(3, 1fr)',
              }}
            >
              {page.panels.map((panel) => (
                <div
                  key={panel.id}
                  className={`comic-panel relative cursor-pointer hover:ring-2 hover:ring-comic-orange transition-all ${
                    panel.type === 'coloring' ? 'col-span-full' : ''
                  }`}
                  style={{
                    gridColumn: panel.width > 1 && panel.type !== 'coloring' ? `span ${Math.min(panel.width, comic.story.layoutStyle === 'neat' ? 2 : 3)}` : undefined,
                    gridRow: panel.height > 1 ? `span ${panel.height}` : undefined,
                    minHeight: panel.type === 'coloring' ? '300px' : '150px',
                  }}
                  onClick={() => handlePanelEdit(panel)}
                >
                  {/* Background */}
                  <div
                    className="absolute inset-0"
                    dangerouslySetInnerHTML={{
                      __html: renderBackground(
                        panel.background as any,
                        comic.story.colorTheme,
                        400,
                        300
                      ),
                    }}
                    style={{ opacity: panel.type === 'coloring' ? 0.1 : 1 }}
                  />

                  {/* Content overlay */}
                  <div className="relative z-10 h-full flex flex-col justify-between p-2" style={{ minHeight: 'inherit' }}>
                    {/* Narration / dialogue */}
                    {panel.type === 'narration' && (
                      <div className={`narration-box text-xs md:text-sm self-start ${getFontClass()}`}>
                        {editingPanel === panel.id ? (
                          <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 text-xs w-full"
                              autoFocus
                              onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                            />
                            <button onClick={saveEdit} className="bg-comic-green text-white px-2 rounded text-xs">OK</button>
                          </div>
                        ) : (
                          panel.text
                        )}
                      </div>
                    )}

                    {panel.type === 'dialogue' && (
                      <div className={`speech-bubble self-start text-xs md:text-sm ${getFontClass()}`}>
                        {panel.speaker && charMap[panel.speaker] && (
                          <strong className="text-comic-dark block text-xs">{charMap[panel.speaker].name}:</strong>
                        )}
                        {editingPanel === panel.id ? (
                          <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 text-xs w-full"
                              autoFocus
                              onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                            />
                            <button onClick={saveEdit} className="bg-comic-green text-white px-2 rounded text-xs">OK</button>
                          </div>
                        ) : (
                          panel.text
                        )}
                      </div>
                    )}

                    {panel.type === 'action' && editingPanel === panel.id && (
                      <div className={`narration-box self-start ${getFontClass()}`} onClick={e => e.stopPropagation()}>
                        <div className="flex gap-1">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-full"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                          />
                          <button onClick={saveEdit} className="bg-comic-green text-white px-2 rounded text-xs">OK</button>
                        </div>
                      </div>
                    )}

                    {panel.type === 'coloring' && (
                      <div className="text-center py-4">
                        <p className={`font-bangers text-lg text-comic-dark`}>
                          {'\u{1F58D}\u{FE0F}'} Your turn! Print and colour this one.
                        </p>
                      </div>
                    )}

                    {/* Characters */}
                    <div className="flex items-end justify-around mt-auto">
                      {panel.characterIds.map(cid => {
                        const char = charMap[cid];
                        if (!char) return null;
                        const pose = panel.characterPoses[cid] || 'standing';
                        const isColoring = panel.type === 'coloring';
                        return (
                          <div
                            key={cid}
                            className="flex-shrink-0"
                            style={{
                              marginLeft: `${(panel.characterPositions[cid] || 50) / 5}%`,
                            }}
                            dangerouslySetInnerHTML={{
                              __html: isColoring
                                ? renderCharacterOutline(char, pose, 60)
                                : renderCharacterSvg(char, comic.story.artStyle, pose, 50),
                            }}
                          />
                        );
                      })}
                    </div>

                    {/* Sound effect */}
                    {panel.soundEffect && panel.type !== 'coloring' && (
                      <div className="sfx-text absolute top-1/2 right-2 -translate-y-1/2 text-base md:text-2xl pointer-events-none">
                        {panel.soundEffect}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center font-hand text-xs text-gray-400 mt-2">
              Page {pageIdx + 1}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
