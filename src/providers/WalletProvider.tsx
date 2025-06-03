"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
  LedgerWalletAdapter,
  WalletConnectWalletAdapter,
  CloverWalletAdapter,
  Coin98WalletAdapter,
  TorusWalletAdapter,
  MathWalletAdapter,
  BitKeepWalletAdapter,
  BitpieWalletAdapter,
  TokenPocketWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { useMemo, useEffect } from "react";

// Import Solana wallet styles
import "@solana/wallet-adapter-react-ui/styles.css";
import { EthereumWalletProvider } from "@/components/EthereumWalletButton";

// Solana configuration
const solanaNetwork = WalletAdapterNetwork.Mainnet;

// Custom Mainnet RPC endpoint for more reliability
const SOLANA_RPC_URL = "https://wandering-damp-dew.solana-mainnet.quiknode.pro/fc98948d433c595f5f32d5b13aad664a01ed91e8/";

// Project configuration
const projectId = "f3100761a66d1ed0def90c914eda538d";
const metadata = {
  name: "Livestreamcoin",
  description: "Livestreamcoin Platform",
  url: "https://demo.avie.live/",
  icons: ["https://demo.avie.live/favicon.ico"],
};

// Custom local storage keys for wallet settings
const WALLET_LOCAL_STORAGE_KEY = "livestreamcoin-wallet-adapter";

// Add a helper function to detect previously connected wallets
const wasWalletPreviouslyConnected = () => {
  if (typeof window === "undefined") return false;
  try {
    const walletConfig = localStorage.getItem(WALLET_LOCAL_STORAGE_KEY);
    if (walletConfig) {
      const config = JSON.parse(walletConfig);
      // If we have a specific wallet that's not Phantom, and autoConnect was true,
      // this means the user deliberately connected before
      if (config.wallet && !config.wallet.toLowerCase().includes("phantom")) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error checking previous wallet connection:", error);
    return false;
  }
};

// Combined Wallet Provider Wrapper
export function WalletProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use our custom RPC endpoint for better reliability
  const endpoint = useMemo(() => SOLANA_RPC_URL, []);

  // Initialize wallet adapters, including Ethereum-compatible wallets via WalletConnect
  const wallets = useMemo(
    () => [
      // Important: Put any wallet BUT Phantom first to prevent auto-selection
      new SolflareWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new LedgerWalletAdapter(),
      new CloverWalletAdapter(),
      new Coin98WalletAdapter(),
      new MathWalletAdapter(),
      new TorusWalletAdapter(),
      new BitKeepWalletAdapter(),
      new BitpieWalletAdapter(),
      new TokenPocketWalletAdapter(),
      // Place Phantom last to ensure it's not the default selection
      new PhantomWalletAdapter(),

      // WalletConnect adapter works with Ethereum wallets too
      new WalletConnectWalletAdapter({
        network: solanaNetwork,
        options: {
          projectId,
          metadata,
          relayUrl: "wss://relay.walletconnect.org",
        },
      }),
    ],
    []
  );

  // Clear Phantom selection or any default wallet on first load
  useEffect(() => {
    // Only run on the client side
    if (typeof window === "undefined") return;

    // Try to remove any automatic wallet selection
    try {
      // First, check if there's a stored wallet config
      const walletConfig = localStorage.getItem(WALLET_LOCAL_STORAGE_KEY);

      if (walletConfig) {
        const config = JSON.parse(walletConfig);

        // Only modify the config if Phantom is being auto-selected
        // This preserves any other wallet connections
        if (config.wallet && config.wallet.toLowerCase().includes("phantom")) {
          console.log("Preventing automatic Phantom wallet selection");

          // Clear wallet selection but keep other settings
          const newConfig = {
            ...config,
            wallet: null,
            // Keep autoConnect so other previously-connected wallets will work
            autoConnect: true,
          };

          localStorage.setItem(
            WALLET_LOCAL_STORAGE_KEY,
            JSON.stringify(newConfig)
          );
        } else if (config.wallet) {
          // If we have another wallet selected, make sure autoConnect is true
          if (!config.autoConnect) {
            config.autoConnect = true;
            localStorage.setItem(
              WALLET_LOCAL_STORAGE_KEY,
              JSON.stringify(config)
            );
          }
        }
      }

      // Additional step: Clear wallet-specific storage items that might cause Phantom auto-selection
      // but don't clear items that might be related to user-selected wallets
      const keysToCheck = [
        "phantom-wallet", // Phantom specific
      ];

      keysToCheck.forEach((key) => {
        if (localStorage.getItem(key)) {
          console.log(`Clearing potential auto-select storage key: ${key}`);
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error("Error handling wallet config:", error);
    }
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <EthereumWalletProvider>
        <WalletProvider
          wallets={wallets}
          autoConnect={true} // Allow auto-connect for previously connected wallets
          localStorageKey={WALLET_LOCAL_STORAGE_KEY}
        >
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </EthereumWalletProvider>
    </ConnectionProvider>
  );
}
