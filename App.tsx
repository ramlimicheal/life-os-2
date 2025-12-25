
import React, { useState, useCallback, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { NotebookItem, Project, NoteType, KnowledgeArea } from './types';
import { INITIAL_NOTEBOOK, INITIAL_PROJECTS, KNOWLEDGE_AREAS } from './constants';
import { ProjectCard } from './components/ProjectCard';
import { processAICommand, searchGrounding } from './services/geminiService';

const App: React.FC = () => {
  // Persistence logic
  const [notebook, setNotebook] = useState<NotebookItem[]>(() => {
    const saved = localStorage.getItem('life2_notebook');
    return saved ? JSON.parse(saved) : INITIAL_NOTEBOOK;
  });
  
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [commandValue, setCommandValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<{ text: string; sources: { title: string; uri: string }[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const [selectedArea, setSelectedArea] = useState<KnowledgeArea | null>(null);

  useEffect(() => {
    localStorage.setItem('life2_notebook', JSON.stringify(notebook));
  }, [notebook]);

  const handleAiCommand = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandValue.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      const result = await processAICommand(commandValue);
      if (result) {
        const newItem: NotebookItem = {
          id: Date.now().toString(),
          title: result.title,
          timestamp: new Date().toLocaleString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric', 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
          }),
          type: result.type as NoteType,
          icon: result.icon,
          iconColor: result.iconColor
        };
        setNotebook(prev => [newItem, ...prev]);
        setCommandValue('');
        setIsCommandOpen(false);
      }
    } catch (error) {
      console.error("AI Command failed", error);
    } finally {
      setIsProcessing(false);
    }
  }, [commandValue, isProcessing]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || isSearching) return;
    setIsSearching(true);
    try {
      const res = await searchGrounding(searchQuery);
      setSearchResult(res);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const deleteNote = (id: string) => {
    setNotebook(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-gray-300">
      <TopBar />

      <header className="max-w-[1200px] w-full mx-auto px-6 pt-12 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="flex flex-col gap-6">
            <div className="text-white">
              <svg fill="none" height="40" viewBox="0 0 48 48" width="40" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 10C8.47715 10 4 14.4772 4 20V38H8V20C8 16.6863 10.6863 14 14 14C17.3137 14 20 16.6863 20 20V38H24V20C24 14.4772 19.5228 10 14 10Z" fill="white"></path>
                <path d="M34 10C28.4772 10 24 14.4772 24 20V38H28V20C28 16.6863 30.6863 14 34 14C37.3137 14 40 16.6863 40 20V38H44V20C44 14.4772 39.5228 10 34 10Z" fill="white"></path>
                <rect fill="white" height="4" width="24" x="12" y="28"></rect>
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-[0.25em] text-white uppercase">l i f e &nbsp; 2.0</h1>
          </div>

          <div className="w-full max-w-md">
            <form onSubmit={handleSearch} className="relative group">
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Knowledge Lab..." 
                className="w-full bg-[#1a1a1a] border border-border-dark rounded-full py-2 px-10 text-xs focus:ring-1 focus:ring-purple-500/50 outline-none transition-all group-hover:border-gray-600"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 !text-[16px] text-gray-500 group-focus-within:text-purple-400">search</span>
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </form>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-8 md:gap-12 py-4 nav-border text-[11px] font-medium tracking-widest text-gray-500">
          <button className="flex items-center gap-2 hover:text-white transition-colors group active:text-white">
            <span className="material-symbols-outlined !text-[16px] text-yellow-600/80 group-hover:scale-110 transition-transform">library_books</span> library
          </button>
          <button className="flex items-center gap-2 text-purple-400/80 hover:text-white transition-colors group">
            <span className="material-symbols-outlined !text-[16px] text-purple-500 group-hover:scale-110 transition-transform">school</span> university
          </button>
          <button className="flex items-center gap-2 hover:text-white transition-colors group">
            <span className="material-symbols-outlined !text-[16px] text-red-800/80 group-hover:scale-110 transition-transform">business_center</span> business
          </button>
          <button className="flex items-center gap-2 hover:text-white transition-colors group">
            <span className="material-symbols-outlined !text-[16px] text-green-600/80 group-hover:scale-110 transition-transform">account_balance_wallet</span> wallet
          </button>
          <button className="flex items-center gap-2 hover:text-white transition-colors group">
            <span className="material-symbols-outlined !text-[16px] text-pink-600/80 group-hover:scale-110 transition-transform">favorite</span> health
          </button>
          <button className="flex items-center gap-2 text-purple-400/80 hover:text-white transition-colors group">
            <span className="material-symbols-outlined !text-[16px] text-purple-500 group-hover:scale-110 transition-transform">cloud</span> learning
          </button>
        </nav>
      </header>

      <main className="max-w-[1200px] w-full mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-8">
            {searchResult && (
              <div className="bg-surface-dark border border-purple-900/30 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xs font-bold text-purple-400 flex items-center gap-2 uppercase tracking-widest">
                    <span className="material-symbols-outlined !text-[16px] animate-pulse">auto_awesome</span> Knowledge Result
                  </h3>
                  <button onClick={() => setSearchResult(null)} className="text-gray-500 hover:text-white transition-colors">
                    <span className="material-symbols-outlined !text-[16px]">close</span>
                  </button>
                </div>
                <div className="text-sm leading-relaxed text-gray-200 mb-6 prose prose-invert prose-sm max-w-none">
                  {searchResult.text}
                </div>
                {searchResult.sources.length > 0 && (
                  <div className="border-t border-border-dark pt-4">
                    <h4 className="text-[10px] uppercase text-gray-500 mb-2 tracking-widest font-bold">Sources</h4>
                    <div className="flex flex-wrap gap-2">
                      {searchResult.sources.map((src, i) => (
                        <a 
                          key={i} 
                          href={src.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-[#1a1a1a] text-[10px] px-2 py-1 rounded border border-border-dark hover:border-purple-500/50 hover:text-purple-300 transition-all flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined !text-[12px]">link</span>
                          {src.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-4 text-[11px] text-gray-500 font-medium tracking-wide relative">
              <button className="flex items-center gap-1.5 hover:text-white text-gray-300">
                <span className="material-symbols-outlined !text-[16px]">history</span> recently
              </button>
              <button 
                onClick={() => setIsCommandOpen(!isCommandOpen)}
                className={`flex items-center gap-1.5 hover:text-white transition-colors ${isCommandOpen ? 'text-white' : ''}`}
              >
                <span className="material-symbols-outlined !text-[16px]">terminal</span> from command
              </button>
              <button 
                onClick={() => setNotebook(INITIAL_NOTEBOOK)} 
                className="flex items-center gap-1.5 hover:text-white"
              >
                <span className="material-symbols-outlined !text-[16px]">refresh</span> reset state
              </button>
            </div>

            {isCommandOpen && (
              <div className="bg-[#252525] p-5 rounded-md border border-border-dark animate-in fade-in slide-in-from-top-2 duration-300 shadow-lg">
                <form onSubmit={handleAiCommand} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    <span className="material-symbols-outlined !text-[16px] text-purple-400">auto_awesome</span>
                    <span>AI Logic: Describe the entry to add...</span>
                  </div>
                  <input 
                    autoFocus
                    value={commandValue}
                    onChange={(e) => setCommandValue(e.target.value)}
                    placeholder="e.g. Save a photo of a brutalist building from Flickr"
                    className="bg-[#1a1a1a] border-border-dark text-white text-xs p-3 rounded focus:ring-1 focus:ring-purple-500 outline-none w-full shadow-inner"
                    disabled={isProcessing}
                  />
                  <div className="flex justify-end gap-3 mt-1">
                    <button 
                      type="button"
                      onClick={() => setIsCommandOpen(false)}
                      className="px-4 py-2 text-[10px] text-gray-500 hover:text-white transition-colors font-bold uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isProcessing}
                      className="bg-purple-900/40 text-purple-300 border border-purple-800/50 px-4 py-2 rounded text-[10px] hover:bg-purple-800/60 transition-colors disabled:opacity-50 font-bold uppercase tracking-widest shadow-md"
                    >
                      {isProcessing ? 'Thinking...' : 'Add Entry'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-border-dark pb-3 tracking-wide">
                <span className="material-symbols-outlined !text-[20px]">edit_note</span> notebook
              </h2>

              <div className="space-y-1 divide-y divide-border-dark/30">
                {notebook.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 py-2.5 px-2 hover:bg-[#252525] rounded transition-all group relative">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className={`material-symbols-outlined !text-[16px] flex-shrink-0 transition-transform group-hover:scale-110 ${item.iconColor || 'text-gray-500'}`}>{item.icon}</span>
                      <span className="text-gray-300 truncate font-mono text-xs group-hover:text-white">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="flex items-center gap-3 text-[10px] tracking-wide transition-opacity group-hover:opacity-0">
                        <span className="text-gray-600 font-medium">{item.timestamp}</span>
                        <span className="bg-[#2a2a2a] text-gray-400 px-1.5 py-0.5 rounded text-[10px] border border-transparent">{item.type}</span>
                      </div>
                      <button 
                        onClick={() => deleteNote(item.id)}
                        className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-900/20 text-red-500 hover:bg-red-900/40 p-1 rounded"
                      >
                        <span className="material-symbols-outlined !text-[14px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <div className="flex items-center justify-between h-6 text-[11px] text-gray-500 font-medium tracking-wide">
              <div></div>
              <button className="flex items-center gap-1.5 hover:text-white text-gray-300">
                <span className="material-symbols-outlined !text-[16px]">view_agenda</span> all projects
              </button>
            </div>

            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-border-dark pb-3 tracking-wide">
              <span className="material-symbols-outlined !text-[20px]">folder_open</span> projects
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {INITIAL_PROJECTS.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </aside>

          <section className="lg:col-span-12 pt-12">
            <div className="flex items-center gap-6 text-[11px] text-gray-500 font-medium tracking-wide mb-6">
              <button className="flex items-center gap-1.5 hover:text-white text-gray-300 underline underline-offset-4 decoration-white/20">
                <span className="material-symbols-outlined !text-[16px]">grid_view</span> areas
              </button>
              <button className="flex items-center gap-1.5 hover:text-white">
                <span className="material-symbols-outlined !text-[16px]">list</span> disciplines
              </button>
              <button className="flex items-center gap-1.5 hover:text-white">
                <span className="material-symbols-outlined !text-[16px]">science</span> research fields
              </button>
            </div>

            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-border-dark pb-3 mb-6 tracking-wide">
              <span className="material-symbols-outlined !text-[20px]">hub</span> knowledge lab
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {KNOWLEDGE_AREAS.map((area) => (
                <button 
                  key={area.id} 
                  onClick={() => setSelectedArea(area)}
                  className="bg-surface-dark text-left px-5 py-4 rounded-lg hover:bg-[#333333] transition-all cursor-pointer group hover:shadow-lg border border-transparent hover:border-gray-700 active:scale-95"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 material-symbols-outlined !text-[18px] group-hover:text-purple-400 transition-colors">{area.icon}</span>
                      <span className="font-medium text-xs text-gray-200 group-hover:text-white transition-colors tracking-wide uppercase">{area.title}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1 pl-0.5 mt-1">
                      <span className="material-symbols-outlined !text-[12px] group-hover:translate-x-1 transition-transform">subdirectory_arrow_right</span> 
                      {area.disciplinesCount} active disciplines
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>

      {selectedArea && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#222] border border-border-dark w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border-dark flex justify-between items-center bg-[#282828]">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-purple-400 !text-[24px]">{selectedArea.icon}</span>
                <h3 className="text-white font-bold uppercase tracking-[0.2em]">{selectedArea.title}</h3>
              </div>
              <button onClick={() => setSelectedArea(null)} className="text-gray-500 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-8 space-y-4">
              <p className="text-xs text-gray-400 leading-relaxed font-mono">
                Knowledge Area Exploration for <span className="text-white">{selectedArea.title}</span>. 
                Currently managing {selectedArea.disciplinesCount} specialized knowledge branches in your library.
              </p>
              <div className="grid grid-cols-2 gap-2 mt-6">
                {[...Array(selectedArea.disciplinesCount)].map((_, i) => (
                  <div key={i} className="text-[10px] text-gray-500 border border-border-dark p-2 rounded hover:text-white hover:border-gray-600 transition-all cursor-default">
                    Branch_{i + 1}.discipline
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-border-dark flex justify-end">
                <button 
                  onClick={() => setSelectedArea(null)}
                  className="bg-white text-black px-6 py-2 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
                >
                  Close Exploration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="max-w-[1200px] w-full mx-auto px-6 pb-12 mt-auto">
        <div className="border border-border-dark rounded-lg p-4 flex flex-wrap justify-between items-center gap-6 text-[10px] text-gray-500 font-medium font-mono bg-[#252525]/30">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2"><span className="material-symbols-outlined !text-[16px]">desktop_windows</span> StudioEdalyn</span>
            <span className="text-gray-700">|</span>
            <span className="text-gray-600">v2.0.4 Premium Edition</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="hover:text-white transition-colors">Etsy</button>
            <button className="hover:text-white transition-colors">Instagram</button>
            <button className="hover:text-white transition-colors">Youtube</button>
            <button className="hover:text-white transition-colors">Buy me a coffee</button>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-6 right-6">
        <button 
          title="Information"
          className="w-10 h-10 rounded-full bg-[#2a2a2a] border border-[#333] text-gray-400 flex items-center justify-center shadow-2xl hover:bg-purple-600 hover:text-white transition-all transform hover:scale-110 active:scale-95 text-xs font-bold"
        >
          ?
        </button>
      </div>
    </div>
  );
};

export default App;
