import { create } from 'zustand'

export interface Token {
  symbol: string
  name: string
  balance: string
  usdValue: number
  icon?: string
  address?: string
}

export interface NFT {
  id: string
  name: string
  collection: string
  image: string
}

export interface Wallet {
  id: string
  name: string
  address: string
  balance: string
  usdBalance: number
  tokens: Token[]
  nfts: NFT[]
}

interface WalletState {
  wallets: Wallet[]
  activeWallet: Wallet | null
  isLoading: boolean
  setWallets: (wallets: Wallet[]) => void
  setActiveWallet: (wallet: Wallet | null) => void
  addWallet: (wallet: Wallet) => void
  setLoading: (loading: boolean) => void
}

// Mock data for demonstration
const mockWallets: Wallet[] = [
  {
    id: '1',
    name: 'Main Wallet',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f4a23F',
    balance: '2.4521',
    usdBalance: 8234.56,
    tokens: [
      { symbol: 'ETH', name: 'Ethereum', balance: '2.4521', usdValue: 8234.56 },
      { symbol: 'USDC', name: 'USD Coin', balance: '1,500.00', usdValue: 1500.0 },
      { symbol: 'LINK', name: 'Chainlink', balance: '150.00', usdValue: 2100.0 },
      { symbol: 'UNI', name: 'Uniswap', balance: '75.50', usdValue: 567.0 }
    ],
    nfts: [
      { id: '1', name: 'Bored Ape #1234', collection: 'BAYC', image: '' },
      { id: '2', name: 'Azuki #5678', collection: 'Azuki', image: '' }
    ]
  },
  {
    id: '2',
    name: 'Trading Wallet',
    address: '0x8B3392483BA26D65E331dB86D4F430E9B3814E5e',
    balance: '0.8234',
    usdBalance: 2765.12,
    tokens: [
      { symbol: 'ETH', name: 'Ethereum', balance: '0.8234', usdValue: 2765.12 },
      { symbol: 'WBTC', name: 'Wrapped Bitcoin', balance: '0.05', usdValue: 4250.0 }
    ],
    nfts: []
  }
]

export const useWalletStore = create<WalletState>((set) => ({
  wallets: mockWallets,
  activeWallet: null,
  isLoading: false,
  setWallets: (wallets) => set({ wallets }),
  setActiveWallet: (wallet) => set({ activeWallet: wallet }),
  addWallet: (wallet) =>
    set((state) => ({ wallets: [...state.wallets, wallet] })),
  setLoading: (loading) => set({ isLoading: loading })
}))
