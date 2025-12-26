import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="w-full flex justify-between items-center px-6 py-4 border-b border-[#252525]">
        <Link href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">grid_view</span>
          <span className="font-bold tracking-wider">Life 2.0</span>
        </Link>
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

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert prose-gray max-w-none space-y-6 text-gray-300">
          <p className="text-lg">
            Last updated: December 2024
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Life 2.0, you accept and agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">2. Description of Service</h2>
            <p>
              Life 2.0 is an AI-powered personal knowledge management application that helps you organize 
              notes, projects, and learning across various disciplines.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for 
              all activities that occur under your account. You must notify us immediately of any unauthorized use.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">4. User Content</h2>
            <p>
              You retain ownership of all content you create in Life 2.0. By using our service, you grant 
              us a license to store, process, and display your content as necessary to provide the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">5. Acceptable Use</h2>
            <p>
              You agree not to use Life 2.0 for any unlawful purpose or in any way that could damage, 
              disable, or impair our service. You must not attempt to gain unauthorized access to any 
              part of the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">6. AI Features</h2>
            <p>
              Our AI-powered features are provided as-is. While we strive for accuracy, AI-generated 
              categorizations and search results may not always be perfect. You are responsible for 
              reviewing and verifying AI-generated content.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">7. Limitation of Liability</h2>
            <p>
              Life 2.0 is provided &quot;as is&quot; without warranties of any kind. We shall not be liable for 
              any indirect, incidental, special, or consequential damages arising from your use of the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any 
              material changes. Continued use of the service after changes constitutes acceptance of 
              the new terms.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[#333]">
          <Link 
            href="/" 
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            &larr; Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
