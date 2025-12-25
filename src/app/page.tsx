import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="w-full flex justify-between items-center px-6 py-4 border-b border-[#252525]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">grid_view</span>
          <span className="font-bold tracking-wider">Life 2.0</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="text-sm bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <svg fill="none" height="80" viewBox="0 0 48 48" width="80" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 10C8.47715 10 4 14.4772 4 20V38H8V20C8 16.6863 10.6863 14 14 14C17.3137 14 20 16.6863 20 20V38H24V20C24 14.4772 19.5228 10 14 10Z" fill="white" />
              <path d="M34 10C28.4772 10 24 14.4772 24 20V38H28V20C28 16.6863 30.6863 14 34 14C37.3137 14 40 16.6863 40 20V38H44V20C44 14.4772 39.5228 10 34 10Z" fill="white" />
              <rect fill="white" height="4" width="24" x="12" y="28" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-[0.2em] mb-6 uppercase">
            l i f e &nbsp; 2.0
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The AI-powered second brain that automatically organizes your knowledge,
            projects, and learning across every area of your life.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-20">
          <Link
            href="/sign-up"
            className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-lg text-lg font-medium transition-all hover:scale-105"
          >
            Start Free Trial
          </Link>
          <Link
            href="#features"
            className="border border-[#333] hover:border-gray-500 px-8 py-4 rounded-lg text-lg font-medium transition-all hover:bg-[#1a1a1a]"
          >
            Learn More
          </Link>
        </div>

        <section id="features" className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-[#1a1a1a] border border-[#333] p-8 rounded-xl">
            <span className="material-symbols-outlined text-[32px] text-purple-400 mb-4 block">
              auto_awesome
            </span>
            <h3 className="text-xl font-bold mb-3">AI-Powered Organization</h3>
            <p className="text-gray-400 leading-relaxed">
              Describe what you want to save and let AI automatically categorize,
              tag, and organize your notes with intelligent precision.
            </p>
          </div>

          <div className="bg-[#1a1a1a] border border-[#333] p-8 rounded-xl">
            <span className="material-symbols-outlined text-[32px] text-purple-400 mb-4 block">
              psychology
            </span>
            <h3 className="text-xl font-bold mb-3">Knowledge Lab</h3>
            <p className="text-gray-400 leading-relaxed">
              Organize your learning across disciplines - from social sciences to
              humanities, formal sciences to professions.
            </p>
          </div>

          <div className="bg-[#1a1a1a] border border-[#333] p-8 rounded-xl">
            <span className="material-symbols-outlined text-[32px] text-purple-400 mb-4 block">
              search
            </span>
            <h3 className="text-xl font-bold mb-3">Grounded Search</h3>
            <p className="text-gray-400 leading-relaxed">
              Search your knowledge base with AI that provides answers grounded in
              real sources with citations.
            </p>
          </div>
        </section>

        <section className="text-center mb-20">
          <h2 className="text-3xl font-bold mb-8">Built for Lifelong Learners</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { icon: "psychology", label: "Social Sciences" },
              { icon: "eco", label: "Natural Sciences" },
              { icon: "calculate", label: "Formal Sciences" },
              { icon: "theater_comedy", label: "Humanities" },
              { icon: "work", label: "Professions" },
            ].map((area) => (
              <div
                key={area.label}
                className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333] hover:border-purple-500/50 transition-colors"
              >
                <span className="material-symbols-outlined text-[24px] text-gray-500 mb-2 block">
                  {area.icon}
                </span>
                <span className="text-sm text-gray-300">{area.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#1a1a1a] border border-[#333] rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to upgrade your mind?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Join thousands of knowledge workers, students, and lifelong learners
            who are building their second brain with Life 2.0.
          </p>
          <Link
            href="/sign-up"
            className="inline-block bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-lg text-lg font-medium transition-all hover:scale-105"
          >
            Get Started Free
          </Link>
        </section>
      </main>

      <footer className="border-t border-[#252525] mt-20 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-between items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">grid_view</span>
            <span>Life 2.0</span>
            <span className="text-gray-700">|</span>
            <span>v2.0.0 MVP</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
