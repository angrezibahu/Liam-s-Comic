import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Comic } from '../types/comic';
import { loadComics, deleteComic, getStorageSize } from '../utils/storage';
import { renderCharacterSvg } from '../utils/characterRenderer';

export default function Home() {
  const [comics, setComics] = useState<Comic[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setComics(loadComics().sort((a, b) => b.updatedAt - a.updatedAt));
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Delete this comic? This can\'t be undone!')) {
      deleteComic(id);
      setComics(prev => prev.filter(c => c.id !== id));
    }
  };

  const storageUsed = getStorageSize();

  return (
    <div className="min-h-svh bg-comic-cream paper-texture">
      {/* Header */}
      <header className="bg-comic-orange text-white py-6 px-4 text-center relative overflow-hidden">
        <div className="halftone absolute inset-0 opacity-30" />
        <h1 className="font-bangers text-5xl md:text-6xl tracking-wide relative z-10 drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)]">
          Story Machine
        </h1>
        <p className="font-hand text-lg md:text-xl mt-1 relative z-10 opacity-90">
          Create your own comics!
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Create New Button */}
        <button
          onClick={() => navigate('/create')}
          className="w-full mb-8 relative group"
        >
          <div className="pow-burst absolute -top-3 -right-3 w-20 h-20 flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
            <span className="font-bangers text-comic-dark text-sm rotate-12">NEW!</span>
          </div>
          <div className="bg-comic-yellow border-4 border-comic-dark rounded-xl p-6 hover:bg-yellow-300 transition-colors shadow-[4px_4px_0_rgba(45,45,45,1)] hover:shadow-[6px_6px_0_rgba(45,45,45,1)] hover:-translate-y-0.5 active:shadow-[2px_2px_0_rgba(45,45,45,1)] active:translate-y-0.5">
            <span className="font-bangers text-3xl md:text-4xl text-comic-dark tracking-wide">
              Create New Comic!
            </span>
          </div>
        </button>

        {/* Comics Grid */}
        {comics.length === 0 ? (
          <div className="text-center py-12 animate-fade-up">
            <div className="speech-bubble inline-block text-left mb-6 max-w-sm">
              <p className="font-hand text-lg text-comic-dark">
                Hey! You haven't made any comics yet. Hit that big yellow button up there and let's create something awesome!
              </p>
            </div>
            <div className="text-6xl mb-4">
              {'\u{1F4DA}'}
            </div>
            <p className="font-hand text-gray-500 text-lg">Your comic library is empty... for now!</p>
          </div>
        ) : (
          <>
            <h2 className="font-bangers text-2xl text-comic-dark mb-4">My Comics</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 stagger-children">
              {comics.map((comic) => (
                <div
                  key={comic.id}
                  className="comic-panel bg-white animate-pop-in hover:shadow-lg transition-shadow"
                >
                  {/* Cover thumbnail */}
                  <div className="aspect-[3/4] bg-gradient-to-b from-comic-cream to-white p-3 flex flex-col items-center justify-center relative">
                    <h3 className="font-bangers text-lg md:text-xl text-comic-dark text-center leading-tight mb-2">
                      {comic.title}
                    </h3>
                    <div className="flex gap-1 flex-wrap justify-center">
                      {comic.story.characters.slice(0, 3).map((char) => (
                        <div
                          key={char.id}
                          dangerouslySetInnerHTML={{
                            __html: renderCharacterSvg(char, comic.story.artStyle, 'standing', 40),
                          }}
                        />
                      ))}
                    </div>
                    <p className="font-hand text-xs text-gray-500 mt-2 absolute bottom-2">
                      by {comic.authorName}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex border-t-2 border-comic-dark">
                    <button
                      onClick={() => navigate(`/read/${comic.id}`)}
                      className="flex-1 py-2 font-hand text-sm hover:bg-comic-cream transition-colors border-r border-comic-dark"
                      title="Read"
                    >
                      {'\u{1F4D6}'} Read
                    </button>
                    <button
                      onClick={() => navigate(`/edit/${comic.id}`)}
                      className="flex-1 py-2 font-hand text-sm hover:bg-comic-cream transition-colors border-r border-comic-dark"
                      title="Edit"
                    >
                      {'\u{270F}\u{FE0F}'} Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comic.id)}
                      className="flex-1 py-2 font-hand text-sm hover:bg-red-100 transition-colors text-red-600"
                      title="Delete"
                    >
                      {'\u{1F5D1}\u{FE0F}'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Storage indicator */}
        {parseFloat(storageUsed) > 3 && (
          <p className="text-center font-hand text-sm text-gray-400 mt-8">
            Storage used: {storageUsed}MB — you're making loads of comics!
          </p>
        )}
      </main>
    </div>
  );
}
