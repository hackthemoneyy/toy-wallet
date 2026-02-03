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
  CreditCard,
  Banknote,
  Wallet,
  Bell,
  Shield,
  Moon,
  HelpCircle,
  LogOut
} from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Card, CardContent } from '@renderer/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import { Separator } from '@renderer/components/ui/separator'
import { Input } from '@renderer/components/ui/input'
import { useWalletStore } from '@renderer/store/wallet-store'
import { shortenAddress, formatBalance, formatUSD } from '@renderer/lib/utils'

export function WalletDashboard() {
  const navigate = useNavigate()
  const { activeWallet, setActiveWallet } = useWalletStore()
  const [copied, setCopied] = useState(false)

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

  // Mock data for balance history chart
  const balanceHistory = [
    { day: 'Mon', value: 40 },
    { day: 'Tue', value: 55 },
    { day: 'Wed', value: 45 },
    { day: 'Thu', value: 60 },
    { day: 'Fri', value: 52 },
    { day: 'Sat', value: 68 },
    { day: 'Sun', value: 75 }
  ]
  const maxValue = Math.max(...balanceHistory.map((d) => d.value))

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Tabs defaultValue="overview" className="flex-1 flex flex-col">
          {/* Tab Navigation */}
          <div className="px-6 pt-4">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-4">
              <TabsTrigger value="overview" className="text-xs">
                <Wallet className="w-4 h-4 mr-1.5" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="add-money" className="text-xs">
                <CreditCard className="w-4 h-4 mr-1.5" />
                Add Money
              </TabsTrigger>
              <TabsTrigger value="cash-out" className="text-xs">
                <Banknote className="w-4 h-4 mr-1.5" />
                Cash Out
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs">
                <Settings className="w-4 h-4 mr-1.5" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="flex-1 mt-0">
            <div className="p-6 max-w-md mx-auto w-full space-y-6">
              {/* Balance Display */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <p className="text-muted-foreground text-sm mb-2">Total Balance</p>
                <h2 className="text-5xl font-bold text-white mb-2">{formatUSD(totalBalance)}</h2>
                <div className="flex items-center justify-center gap-3 text-sm">
                  <span className="text-muted-foreground">
                    {formatBalance(activeWallet.balance)} ETH
                  </span>
                  <span className="flex items-center text-green-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +2.4%
                  </span>
                </div>

                {/* Address */}
                <button
                  onClick={handleCopyAddress}
                  className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer"
                >
                  <span className="text-sm text-muted-foreground">
                    {shortenAddress(activeWallet.address, 6)}
                  </span>
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </button>
              </motion.div>

              {/* Balance Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-4">Balance History</p>
                    <div className="flex items-end justify-between gap-2 h-24">
                      {balanceHistory.map((data, index) => (
                        <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                          <motion.div
                            className="w-full bg-purple-600 rounded-t"
                            initial={{ height: 0 }}
                            animate={{ height: `${(data.value / maxValue) * 100}%` }}
                            transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
                          />
                          <span className="text-xs text-muted-foreground">{data.day}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                <p className="text-sm text-muted-foreground">Quick Actions</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: ArrowUpRight, label: 'Send', color: 'text-blue-400' },
                    { icon: ArrowDownLeft, label: 'Receive', color: 'text-green-400' },
                    { icon: ArrowLeftRight, label: 'Swap', color: 'text-purple-400' }
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                    >
                      <Button
                        variant="secondary"
                        className="flex flex-col items-center gap-2 h-auto py-4 w-full"
                      >
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                        <span className="text-xs">{item.label}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </TabsContent>

          {/* Add Money Tab (Onramp) */}
          <TabsContent value="add-money" className="flex-1 mt-0">
            <div className="p-6 max-w-md mx-auto w-full space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Add Money</h2>
                <p className="text-muted-foreground text-sm">
                  Buy crypto instantly with your card
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">You pay</label>
                      <div className="flex gap-3">
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="text-2xl h-14 font-semibold"
                        />
                        <Button variant="secondary" className="h-14 px-4 min-w-[80px]">
                          USD
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="w-10 h-10 rounded-full bg-secondary border border flex items-center justify-center">
                        <ArrowDownLeft className="w-4 h-4 text-green-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">You receive</label>
                      <div className="flex gap-3">
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="text-2xl h-14 font-semibold"
                          readOnly
                        />
                        <Button variant="secondary" className="h-14 px-4 min-w-[80px]">
                          ETH
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        1 ETH ≈ $3,250.00 • Fee: 1.5%
                      </p>
                    </div>

                    <Separator />

                    <Button className="w-full h-12 text-base">
                      Continue to Payment
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <p className="text-xs text-muted-foreground">
                  Powered by secure payment providers
                </p>
              </motion.div>
            </div>
          </TabsContent>

          {/* Cash Out Tab (Offramp) */}
          <TabsContent value="cash-out" className="flex-1 mt-0">
            <div className="p-6 max-w-md mx-auto w-full space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-4">
                  <Banknote className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Cash Out</h2>
                <p className="text-muted-foreground text-sm">
                  Convert your crypto to cash
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">You sell</label>
                      <div className="flex gap-3">
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="text-2xl h-14 font-semibold"
                        />
                        <Button variant="secondary" className="h-14 px-4 min-w-[80px]">
                          ETH
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Available: {formatBalance(activeWallet.balance)} ETH
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <div className="w-10 h-10 rounded-full bg-secondary border border flex items-center justify-center">
                        <ArrowUpRight className="w-4 h-4 text-blue-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">You receive</label>
                      <div className="flex gap-3">
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="text-2xl h-14 font-semibold"
                          readOnly
                        />
                        <Button variant="secondary" className="h-14 px-4 min-w-[80px]">
                          USD
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        1 ETH ≈ $3,250.00 • Fee: 1.5%
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Payout method</label>
                      <Button variant="secondary" className="w-full h-12 justify-start">
                        <CreditCard className="w-4 h-4 mr-3" />
                        Bank Account •••• 4242
                      </Button>
                    </div>

                    <Button className="w-full h-12 text-base">
                      Cash Out
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="flex-1 mt-0">
            <div className="p-6 max-w-md mx-auto w-full space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {activeWallet.name.charAt(0)}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">{activeWallet.name}</h2>
                <p className="text-muted-foreground text-sm">
                  {shortenAddress(activeWallet.address, 8)}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-2">
                    {[
                      { icon: Bell, label: 'Notifications', desc: 'Manage alerts' },
                      { icon: Shield, label: 'Security', desc: 'Protect your wallet' },
                      { icon: Moon, label: 'Appearance', desc: 'Dark mode enabled' }
                    ].map((item) => (
                      <Button
                        key={item.label}
                        variant="ghost"
                        className="w-full justify-start h-auto py-3 px-3"
                      >
                        <item.icon className="w-5 h-5 mr-3 text-purple-400" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-white">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardContent className="p-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-auto py-3 px-3"
                    >
                      <HelpCircle className="w-5 h-5 mr-3 text-muted-foreground" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-white">Help & Support</p>
                        <p className="text-xs text-muted-foreground">Get assistance</p>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  variant="secondary"
                  className="w-full h-12 text-red-400 hover:text-red-300"
                  onClick={handleBack}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Switch Wallet
                </Button>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
