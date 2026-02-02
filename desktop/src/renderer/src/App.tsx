import { Routes, Route } from 'react-router-dom'
import { SplashScreen } from './views/SplashScreen'
import { WalletSelection } from './views/WalletSelection'
import { WalletDashboard } from './views/WalletDashboard'

function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/wallets" element={<WalletSelection />} />
      <Route path="/dashboard" element={<WalletDashboard />} />
    </Routes>
  )
}

export default App
