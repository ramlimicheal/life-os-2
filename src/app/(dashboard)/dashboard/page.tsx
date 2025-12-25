"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, History, Terminal, RefreshCw, FolderOpen, Edit, Hub } from "lucide-react";
import { NoteCard } from "@/components/dashboard/NoteCard";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { KnowledgeAreaCard } from "@/components/dashboard/KnowledgeAreaCard";
import { AICommandInput } from "@/components/dashboard/AICommandInput";
import { SearchResults } from "@/components/dashboard/SearchResults";
import { Note, Project, KnowledgeArea, SearchResult, NoteType, ProjectCategory } from "@/lib/types";
import { Input } from "@/components/ui/Input";

const DEFAULT_KNOWLEDGE_AREAS: Omit<KnowledgeArea, "userId" | "createdAt" | "updatedAt">[] = [
  { id: "k1", title: "social sciences", disciplinesCount: 8, icon: "psychology" },
  { id: "k2", title: "natural sciences", disciplinesCount: 6, icon: "eco" },
  { id: "k3", title: "formal sciences", disciplinesCount: 5, icon: "calculate" },
  { id: "k4", title: "humanities", disciplinesCount: 6, icon: "theater_comedy" },
  { id: "k5", title: "professions", disciplinesCount: 7, icon: "work" },
];

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [knowledgeAreas] = useState(DEFAULT_KNOWLEDGE_AREAS);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedArea, setSelectedArea] = useState<typeof DEFAULT_KNOWLEDGE_AREAS[0] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch("/api/notes");
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchNotes(), fetchProjects()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchNotes, fetchProjects]);

  const handleAICommand = async (command: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/ai/categorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });

      if (res.ok) {
        const result = await res.json();
        const newNote: Partial<Note> = {
          title: result.title,
          type: result.type as NoteType,
          icon: result.icon,
          iconColor: result.iconColor,
          aiGenerated: true,
        };

        const createRes = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newNote),
        });

        if (createRes.ok) {
          await fetchNotes();
          setIsCommandOpen(false);
        }
      }
    } catch (error) {
      console.error("AI Command failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || isSearching) return;

    setIsSearching(true);
    try {
      const res = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (res.ok) {
        const result = await res.json();
        setSearchResult(result);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="max-w-[1200px] w-full mx-auto px-6 pt-12 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="flex flex-col gap-6">
            <div className="text-white">
              <svg fill="none" height="40" viewBox="0 0 48 48" width="40" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 10C8.47715 10 4 14.4772 4 20V38H8V20C8 16.6863 10.6863 14 14 14C17.3137 14 20 16.6863 20 20V38H24V20C24 14.4772 19.5228 10 14 10Z" fill="white" />
                <path d="M34 10C28.4772 10 24 14.4772 24 20V38H28V20C28 16.6863 30.6863 14 34 14C37.3137 14 40 16.6863 40 20V38H44V20C44 14.4772 39.5228 10 34 10Z" fill="white" />
                <rect fill="white" height="4" width="24" x="12" y="28" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-[0.25em] text-white uppercase">
              l i f e &nbsp; 2.0
            </h1>
          </div>

          <div className="w-full max-w-md">
            <form onSubmit={handleSearch} className="relative group">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Knowledge Lab..."
                className="rounded-full py-2 px-10 text-xs"
                icon={
                  <span className="material-symbols-outlined text-[16px]">
                    search
                  </span>
                }
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </form>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-8 md:gap-12 py-4 nav-border text-[11px] font-medium tracking-widest text-gray-500">
          <button className="flex items-center gap-2 hover:text-white transition-colors group active:text-white">
            <span className="material-symbols-outlined text-[16px] text-yellow-600/80 group-hover:scale-110 transition-transform">
              library_books
            </span>
            library
          </button>
          <button className="flex items-center gap-2 text-purple-400/80 hover:text-white transition-colors group">
            <span className="material-symbols-outlined text-[16px] text-purple-500 group-hover:scale-110 transition-transform">
              school
            </span>
            university
          </button>
          <button className="flex items-center gap-2 hover:text-white transition-colors group">
            <span className="material-symbols-outlined text-[16px] text-red-800/80 group-hover:scale-110 transition-transform">
              business_center
            </span>
            business
          </button>
          <button className="flex items-center gap-2 hover:text-white transition-colors group">
            <span className="material-symbols-outlined text-[16px] text-green-600/80 group-hover:scale-110 transition-transform">
              account_balance_wallet
            </span>
            wallet
          </button>
          <button className="flex items-center gap-2 hover:text-white transition-colors group">
            <span className="material-symbols-outlined text-[16px] text-pink-600/80 group-hover:scale-110 transition-transform">
              favorite
            </span>
            health
          </button>
          <button className="flex items-center gap-2 text-purple-400/80 hover:text-white transition-colors group">
            <span className="material-symbols-outlined text-[16px] text-purple-500 group-hover:scale-110 transition-transform">
              cloud
            </span>
            learning
          </button>
        </nav>
      </header>

      <main className="max-w-[1200px] w-full mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-8">
            {searchResult && (
              <SearchResults
                result={searchResult}
                onClose={() => setSearchResult(null)}
              />
            )}

            <div className="flex items-center gap-4 text-[11px] text-gray-500 font-medium tracking-wide relative">
              <button className="flex items-center gap-1.5 hover:text-white text-gray-300">
                <History className="w-4 h-4" />
                recently
              </button>
              <button
                onClick={() => setIsCommandOpen(!isCommandOpen)}
                className={`flex items-center gap-1.5 hover:text-white transition-colors ${
                  isCommandOpen ? "text-white" : ""
                }`}
              >
                <Terminal className="w-4 h-4" />
                from command
              </button>
              <button
                onClick={() => fetchNotes()}
                className="flex items-center gap-1.5 hover:text-white"
              >
                <RefreshCw className="w-4 h-4" />
                refresh
              </button>
            </div>

            {isCommandOpen && (
              <AICommandInput
                onSubmit={handleAICommand}
                onCancel={() => setIsCommandOpen(false)}
                isProcessing={isProcessing}
              />
            )}

            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-[#333] pb-3 tracking-wide">
                <Edit className="w-5 h-5" />
                notebook
              </h2>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : notes.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-sm">No notes yet. Use the AI command to add your first entry!</p>
                </div>
              ) : (
                <div className="space-y-1 divide-y divide-[#333]/30">
                  {notes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onDelete={handleDeleteNote}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <div className="flex items-center justify-between h-6 text-[11px] text-gray-500 font-medium tracking-wide">
              <div />
              <button className="flex items-center gap-1.5 hover:text-white text-gray-300">
                <span className="material-symbols-outlined text-[16px]">
                  view_agenda
                </span>
                all projects
              </button>
            </div>

            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-[#333] pb-3 tracking-wide">
              <FolderOpen className="w-5 h-5" />
              projects
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {projects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No projects yet.</p>
                </div>
              ) : (
                projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))
              )}
            </div>
          </aside>

          <section className="lg:col-span-12 pt-12">
            <div className="flex items-center gap-6 text-[11px] text-gray-500 font-medium tracking-wide mb-6">
              <button className="flex items-center gap-1.5 hover:text-white text-gray-300 underline underline-offset-4 decoration-white/20">
                <span className="material-symbols-outlined text-[16px]">
                  grid_view
                </span>
                areas
              </button>
              <button className="flex items-center gap-1.5 hover:text-white">
                <span className="material-symbols-outlined text-[16px]">
                  list
                </span>
                disciplines
              </button>
              <button className="flex items-center gap-1.5 hover:text-white">
                <span className="material-symbols-outlined text-[16px]">
                  science
                </span>
                research fields
              </button>
            </div>

            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-[#333] pb-3 mb-6 tracking-wide">
              <Hub className="w-5 h-5" />
              knowledge lab
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {knowledgeAreas.map((area) => (
                <KnowledgeAreaCard
                  key={area.id}
                  area={area as KnowledgeArea}
                  onClick={() => setSelectedArea(area)}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      {selectedArea && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-[#222] border border-[#333] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-[#333] flex justify-between items-center bg-[#282828]">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-purple-400 text-[24px]">
                  {selectedArea.icon}
                </span>
                <h3 className="text-white font-bold uppercase tracking-[0.2em]">
                  {selectedArea.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedArea(null)}
                className="text-gray-500 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-8 space-y-4">
              <p className="text-xs text-gray-400 leading-relaxed font-mono">
                Knowledge Area Exploration for{" "}
                <span className="text-white">{selectedArea.title}</span>.
                Currently managing {selectedArea.disciplinesCount} specialized
                knowledge branches in your library.
              </p>
              <div className="grid grid-cols-2 gap-2 mt-6">
                {[...Array(selectedArea.disciplinesCount)].map((_, i) => (
                  <div
                    key={i}
                    className="text-[10px] text-gray-500 border border-[#333] p-2 rounded hover:text-white hover:border-gray-600 transition-all cursor-default"
                  >
                    Branch_{i + 1}.discipline
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-[#333] flex justify-end">
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
        <div className="border border-[#333] rounded-lg p-4 flex flex-wrap justify-between items-center gap-6 text-[10px] text-gray-500 font-medium font-mono bg-[#252525]/30">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">
                desktop_windows
              </span>
              Life 2.0
            </span>
            <span className="text-gray-700">|</span>
            <span className="text-gray-600">v2.0.0 MVP Edition</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="hover:text-white transition-colors">
              GitHub
            </button>
            <button className="hover:text-white transition-colors">
              Documentation
            </button>
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
}
