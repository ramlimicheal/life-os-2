import Link from "next/link";

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert prose-gray max-w-none space-y-6 text-gray-300">
          <p className="text-lg">
            Last updated: December 2024
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">1. Information We Collect</h2>
            <p>
              Life 2.0 collects information you provide directly to us, including your name, email address, 
              and any content you create within the application such as notes, projects, and knowledge areas.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, 
              including AI-powered features for note categorization and knowledge organization.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">3. Data Storage and Security</h2>
            <p>
              Your data is stored securely using industry-standard encryption. We use Clerk for 
              authentication and implement appropriate security measures to protect your personal information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">4. Third-Party Services</h2>
            <p>
              We use third-party services including Clerk for authentication, Google Gemini for AI features, 
              and Google Analytics for usage analytics. These services have their own privacy policies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">5. Your Rights</h2>
            <p>
              You can access, update, or delete your personal information at any time through your 
              profile settings. You may also request a complete export of your data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us through our 
              GitHub repository.
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
