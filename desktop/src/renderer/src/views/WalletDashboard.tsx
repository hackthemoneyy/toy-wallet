import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Copy,
  Check,
  ChevronLeft,
  Settings,
  TrendingUp,
  Image,
  Coins,
  CreditCard,
  Banknote
} from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Card, CardContent } from '@renderer/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { Separator } from '@renderer/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog'
import { Input } from '@renderer/components/ui/input'
import { useWalletStore } from '@renderer/store/wallet-store'
import { shortenAddress, formatBalance, formatUSD } from '@renderer/lib/utils'

type ActionType = 'send' | 'receive' | 'swap' | 'onramp' | 'offramp' | null

export function WalletDashboard() {
  const navigate = useNavigate()
  const { activeWallet, setActiveWallet } = useWalletStore()
  const [copied, setCopied] = useState(false)
  const [activeAction, setActiveAction] = useState<ActionType>(null)

  if (!activeWallet) {
    navigate('/wallets')
    return null
  }

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(activeWallet.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBack = () => {
    setActiveWallet(null)
    navigate('/wallets')
  }

  const totalBalance = activeWallet.tokens.reduce((acc, token) => acc + token.usdValue, 0)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 border-b border-border"
      >
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-semibold text-white">{activeWallet.name}</h1>
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
      </motion.header>

      <ScrollArea className="flex-1">
        <div className="p-6 max-w-lg mx-auto w-full">
          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-none mb-6 overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdi0yMGgtNjB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2EpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] opacity-50" />
              <CardContent className="p-6 relative">
                <div className="text-center">
                  <p className="text-purple-200 text-sm mb-1">Total Balance</p>
                  <h2 className="text-4xl font-bold text-white mb-1">
                    {formatUSD(totalBalance)}
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="text-purple-200">
                      {formatBalance(activeWallet.balance)} ETH
                    </span>
                    <span className="flex items-center text-green-400">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +2.4%
                    </span>
                  </div>
                </div>

                {/* Address */}
                <div className="mt-4 flex items-center justify-center">
                  <button
                    onClick={handleCopyAddress}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <span className="text-sm text-purple-100">
                      {shortenAddress(activeWallet.address, 6)}
                    </span>
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-purple-200" />
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-5 gap-2 mb-6"
          >
            {[
              { icon: ArrowUpRight, label: 'Send', action: 'send' as const },
              { icon: ArrowDownLeft, label: 'Receive', action: 'receive' as const },
              { icon: ArrowLeftRight, label: 'Swap', action: 'swap' as const },
              { icon: CreditCard, label: 'Buy', action: 'onramp' as const },
              { icon: Banknote, label: 'Sell', action: 'offramp' as const }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <Button
                  variant="secondary"
                  className="flex flex-col items-center gap-1 h-auto py-3 w-full"
                  onClick={() => setActiveAction(item.action)}
                >
                  <item.icon className="w-5 h-5 text-purple-400" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </motion.div>
            ))}
          </motion.div>

          {/* Assets Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Tabs defaultValue="tokens" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="tokens" className="flex-1">
                  <Coins className="w-4 h-4 mr-2" />
                  Tokens
                </TabsTrigger>
                <TabsTrigger value="nfts" className="flex-1">
                  <Image className="w-4 h-4 mr-2" />
                  NFTs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tokens">
                <Card>
                  <CardContent className="p-0">
                    {activeWallet.tokens.map((token, index) => (
                      <motion.div
                        key={token.symbol}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                      >
                        <div className="flex items-center justify-between p-4 hover:bg-background-tertiary/50 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {token.symbol.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-white">{token.name}</p>
                              <p className="text-sm text-text-muted">{token.symbol}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-white">{token.balance}</p>
                            <p className="text-sm text-text-secondary">
                              {formatUSD(token.usdValue)}
                            </p>
                          </div>
                        </div>
                        {index < activeWallet.tokens.length - 1 && (
                          <Separator className="mx-4" />
                        )}
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="nfts">
                <Card>
                  <CardContent className="p-4">
                    {activeWallet.nfts.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {activeWallet.nfts.map((nft, index) => (
                          <motion.div
                            key={nft.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="rounded-xl overflow-hidden bg-background-tertiary border border-border hover:border-purple-500/50 transition-all cursor-pointer"
                          >
                            <div className="aspect-square bg-gradient-to-br from-purple-600/20 to-purple-800/20 flex items-center justify-center">
                              <Image className="w-12 h-12 text-purple-400/50" />
                            </div>
                            <div className="p-3">
                              <p className="font-medium text-white text-sm truncate">
                                {nft.name}
                              </p>
                              <p className="text-xs text-text-muted">{nft.collection}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Image className="w-12 h-12 text-text-muted mx-auto mb-3" />
                        <p className="text-text-secondary">No NFTs yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </ScrollArea>

      {/* Send Dialog */}
      <Dialog open={activeAction === 'send'} onOpenChange={() => setActiveAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-purple-400" />
              Send
            </DialogTitle>
            <DialogDescription>Send tokens to another address</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm text-text-secondary mb-2 block">
                Recipient Address
              </label>
              <Input placeholder="0x..." />
            </div>
            <div>
              <label className="text-sm text-text-secondary mb-2 block">Amount</label>
              <Input type="number" placeholder="0.00" />
            </div>
            <Button className="w-full">Continue</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receive Dialog */}
      <Dialog open={activeAction === 'receive'} onOpenChange={() => setActiveAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowDownLeft className="w-5 h-5 text-purple-400" />
              Receive
            </DialogTitle>
            <DialogDescription>Share your address to receive tokens</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="p-4 bg-background-tertiary rounded-xl text-center">
              <div className="w-32 h-32 mx-auto bg-white rounded-xl mb-4 flex items-center justify-center">
                <span className="text-text-muted text-xs">QR Code</span>
              </div>
              <p className="text-sm text-white font-mono break-all">
                {activeWallet.address}
              </p>
            </div>
            <Button className="w-full" onClick={handleCopyAddress}>
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Address
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Swap Dialog */}
      <Dialog open={activeAction === 'swap'} onOpenChange={() => setActiveAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-purple-400" />
              Swap
            </DialogTitle>
            <DialogDescription>Exchange tokens instantly</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm text-text-secondary mb-2 block">From</label>
              <div className="flex gap-2">
                <Button variant="secondary" className="min-w-[100px]">
                  ETH
                </Button>
                <Input type="number" placeholder="0.00" className="flex-1" />
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full bg-background-tertiary border border-border flex items-center justify-center">
                <ArrowLeftRight className="w-4 h-4 text-purple-400 rotate-90" />
              </div>
            </div>
            <div>
              <label className="text-sm text-text-secondary mb-2 block">To</label>
              <div className="flex gap-2">
                <Button variant="secondary" className="min-w-[100px]">
                  USDC
                </Button>
                <Input type="number" placeholder="0.00" className="flex-1" readOnly />
              </div>
            </div>
            <Button className="w-full">Swap</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Onramp Dialog */}
      <Dialog open={activeAction === 'onramp'} onOpenChange={() => setActiveAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-400" />
              Buy Crypto
            </DialogTitle>
            <DialogDescription>Purchase crypto with your card</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm text-text-secondary mb-2 block">
                Amount (USD)
              </label>
              <Input type="number" placeholder="100.00" />
            </div>
            <div>
              <label className="text-sm text-text-secondary mb-2 block">
                You receive
              </label>
              <div className="flex gap-2">
                <Button variant="secondary" className="min-w-[100px]">
                  ETH
                </Button>
                <Input type="number" placeholder="~0.03" className="flex-1" readOnly />
              </div>
            </div>
            <Button className="w-full">Continue to Payment</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Offramp Dialog */}
      <Dialog open={activeAction === 'offramp'} onOpenChange={() => setActiveAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Banknote className="w-5 h-5 text-purple-400" />
              Sell Crypto
            </DialogTitle>
            <DialogDescription>Convert crypto to fiat currency</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm text-text-secondary mb-2 block">Sell</label>
              <div className="flex gap-2">
                <Button variant="secondary" className="min-w-[100px]">
                  ETH
                </Button>
                <Input type="number" placeholder="0.00" className="flex-1" />
              </div>
            </div>
            <div>
              <label className="text-sm text-text-secondary mb-2 block">
                You receive (USD)
              </label>
              <Input type="number" placeholder="~0.00" readOnly />
            </div>
            <Button className="w-full">Continue</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
