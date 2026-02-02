import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Download, Wallet, ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Card } from '@renderer/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog'
import { Input } from '@renderer/components/ui/input'
import { useWalletStore, type Wallet as WalletType } from '@renderer/store/wallet-store'
import { shortenAddress, formatUSD } from '@renderer/lib/utils'

export function WalletSelection() {
  const navigate = useNavigate()
  const { wallets, setActiveWallet, addWallet } = useWalletStore()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [newWalletName, setNewWalletName] = useState('')

  const handleSelectWallet = (wallet: WalletType) => {
    setActiveWallet(wallet)
    navigate('/dashboard')
  }

  const handleCreateWallet = () => {
    if (!newWalletName.trim()) return

    const newWallet: WalletType = {
      id: Date.now().toString(),
      name: newWalletName,
      address: `0x${Math.random().toString(16).slice(2, 42)}`,
      balance: '0.0000',
      usdBalance: 0,
      tokens: [{ symbol: 'ETH', name: 'Ethereum', balance: '0.0000', usdValue: 0 }],
      nfts: []
    }

    addWallet(newWallet)
    setNewWalletName('')
    setShowCreateDialog(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 mb-4 shadow-lg shadow-purple-600/30"
          >
            <Wallet className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white mb-2">Your Wallets</h1>
          <p className="text-muted-foreground text-sm">
            Select a wallet or create a new one
          </p>
        </div>

        {/* Wallet List */}
        <div className="space-y-3 mb-6">
          <AnimatePresence>
            {wallets.map((wallet, index) => (
              <motion.div
                key={wallet.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="p-4 cursor-pointer hover:border-purple-500/50 transition-all duration-200 group"
                  onClick={() => handleSelectWallet(wallet)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {wallet.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{wallet.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {shortenAddress(wallet.address)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-semibold text-white">
                          {wallet.balance} ETH
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatUSD(wallet.usdBalance)}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-400 transition-colors" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="default"
              size="lg"
              className="w-full"
              onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="w-5 h-5" />
              Create New
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => setShowImportDialog(true)}
            >
              <Download className="w-5 h-5" />
              Import
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Create Wallet Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Create New Wallet
            </DialogTitle>
            <DialogDescription>
              Your wallet will be secured using MPC technology
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Wallet Name
              </label>
              <Input
                placeholder="My Wallet"
                value={newWalletName}
                onChange={(e) => setNewWalletName(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              onClick={handleCreateWallet}
              disabled={!newWalletName.trim()}
            >
              Create Wallet
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Wallet Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-purple-400" />
              Import Wallet
            </DialogTitle>
            <DialogDescription>
              Import an existing wallet using your recovery phrase
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Wallet Name
              </label>
              <Input placeholder="Imported Wallet" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Recovery Phrase or Private Key
              </label>
              <Input
                type="password"
                placeholder="Enter your recovery phrase..."
              />
            </div>
            <Button className="w-full">Import Wallet</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
