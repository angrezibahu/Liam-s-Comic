import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Wizard from './pages/Wizard'
import Preview from './pages/Preview'
import Read from './pages/Read'

export default function App() {
  return (
    <div className="min-h-svh bg-comic-cream">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Wizard />} />
        <Route path="/edit/:id" element={<Preview />} />
        <Route path="/read/:id" element={<Read />} />
      </Routes>
    </div>
  )
}
