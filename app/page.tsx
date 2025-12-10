import MintForm from "@/components/MintForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-subtle">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-16 pb-12 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Logo/Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
              <svg
                className="w-5 h-5 text-primary animate-float"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="text-sm font-medium text-primary">
                Powered by Cardano
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
              <span className="text-white">Token</span>
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Well
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
              Your source for Cardano testnet tokens
            </p>

            {/* Description */}
            <p className="text-gray-400 max-w-xl mx-auto">
              Instantly mint custom test tokens on Preview and Preprod networks.
              Perfect for developers building on Cardano.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              {[
                { icon: "⚡", text: "Instant Minting" },
                { icon: "🔒", text: "Secure & Verified" },
                { icon: "🆓", text: "Free to Use" },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary-light/50 rounded-lg border border-gray-700/50"
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <span className="text-sm text-gray-300">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Minting Form Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Form Card */}
            <div className="bg-secondary/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl">
              {/* Form Header */}
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Mint Your Tokens
                </h2>
                <p className="text-gray-400">
                  Fill in the details below to mint testnet tokens
                </p>
              </div>

              {/* Minting Form */}
              <MintForm />
            </div>

            {/* Info Cards */}
            <div className="mt-8 grid md:grid-cols-2 gap-4">
              <div className="bg-secondary/60 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">
                      Need Test ADA?
                    </h3>
                    <p className="text-sm text-gray-400">
                      Get free testnet ADA from the{" "}
                      <a
                        href="https://docs.cardano.org/cardano-testnet/tools/faucet/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-light transition-colors"
                      >
                        Cardano Faucet
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/60 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">
                      Open Source
                    </h3>
                    <p className="text-sm text-gray-400">
                      TokenWell is fully open source and auditable. Built with Aiken.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 text-center text-gray-500 text-sm">
          <p>
            Built with ❤️ for the Cardano community • Testnet only • Not for production use
          </p>
        </footer>
      </div>
    </main>
  );
}
