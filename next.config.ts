import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Add empty turbopack config to acknowledge we're aware of it
  // but still using webpack for WASM support needed by Cardano libraries
  turbopack: {},
  
  webpack: (config, { isServer }) => {
    // Fix WASM loading for Lucid Evolution / Cardano libraries
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      syncWebAssembly: true,
      layers: true,
    };

    // Handle .wasm files - important for Cardano libraries
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });

    // Make sure WASM files are resolved correctly
    config.resolve.extensions = [...(config.resolve.extensions || []), ".wasm"];

    // For server-side (API routes), ensure proper fallbacks
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    // Ensure WASM files are copied to output
    config.output = {
      ...config.output,
      webassemblyModuleFilename: "static/wasm/[modulehash].wasm",
    };

    return config;
  },
  
  // Ensure WASM files are included in the server bundle
  serverExternalPackages: [
    "@lucid-evolution/lucid",
    "@anastasia-labs/cardano-multiplatform-lib-nodejs",
  ],
};

export default nextConfig;
