import MintForm from "@/components/MintForm";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-subtle">
      {/* Background Effects - More subtle */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Header with Logo */}
      <header className="relative z-10 border-b border-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/Logo.png"
                  alt="TokenWell Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-2xl font-bold">
                <span className="text-white">Token</span>
                <span className="text-primary-300">Well</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
              <svg
                className="w-4 h-4 text-primary"
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
              <span className="text-xs font-medium text-primary">
                Powered by Cardano
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section - More spacious and clean */}
        <div className="container mx-auto px-4 pt-20 pb-16 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Logo Icon - Large and centered */}
            <div className="flex justify-center animate-fade-in">
              <div className="relative w-24 h-24 mb-4">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl" />
                <div className="relative w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-primary/30 rounded-2xl p-4 flex items-center justify-center">
                  <Image
                    src="/Logo.png"
                    alt="TokenWell"
                    width={64}
                    height={64}
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Main Heading with better contrast */}
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="text-white">Token</span>
                <span className="bg-gradient-to-r from-primary-300 via-primary-200 to-primary-300 bg-clip-text text-transparent">
                  Well
                </span>
              </h2>

              {/* Tagline */}
              <p className="text-xl md:text-2xl text-gray-300 font-light">
                Your source for Cardano testnet tokens
              </p>
            </div>

            {/* Description - Simplified */}
            <p className="text-gray-400 max-w-xl mx-auto text-lg">
              Instantly mint custom test tokens on Preview and Preprod networks.
            </p>
          </div>
        </div>

        {/* Minting Form Section - More prominent */}
        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-2xl mx-auto">
            {/* Form Card - Enhanced glass morphism */}
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
              
              <div className="relative bg-secondary/90 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 md:p-10 shadow-2xl">
                {/* Form Header */}
                <div className="mb-10 text-center">
                  <h3 className="text-3xl font-bold text-white mb-3">
                    Mint Your Tokens
                  </h3>
                  <p className="text-gray-400">
                    Fill in the details below to mint testnet tokens
                  </p>
                </div>

                {/* Minting Form */}
                <MintForm />
              </div>
            </div>

            {/* Info Cards - Cleaner design */}
            <div className="mt-10 grid md:grid-cols-2 gap-5">
              <div className="group bg-secondary/70 backdrop-blur-md border border-gray-800/50 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 hover:bg-secondary/80">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-6 h-6 text-primary"
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
                    <h4 className="text-white font-semibold mb-2 text-lg">
                      Need Test ADA?
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Get free testnet ADA from the{" "}
                      <a
                        href="https://docs.cardano.org/cardano-testnet/tools/faucet/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-light transition-colors underline underline-offset-2"
                      >
                        Cardano Faucet
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="group bg-secondary/70 backdrop-blur-md border border-gray-800/50 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 hover:bg-secondary/80">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2 text-lg">
                      Open Source
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      TokenWell is fully open source and auditable. Built with Aiken.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-10 text-center border-t border-white/5">
          <p className="text-gray-500 text-sm">
            Built with ❤️ for the Cardano community • Testnet only • Not for production use
          </p>
        </footer>
      </div>
    </main>
  );
}
