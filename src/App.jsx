import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { FocusProvider } from './context/FocusContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import Duel from './pages/Duel.jsx'
import Home from './pages/Home.jsx'
import HtmlCssMode from './pages/HtmlCssMode.jsx'
import Marathon from './pages/Marathon.jsx'
import ProblemList from './pages/ProblemList.jsx'
import Profile from './pages/Profile.jsx'
import Training from './pages/Training.jsx'

export default function App() {
  return (
    <AuthProvider>
      <FocusProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/duel" element={<Duel />} />
                <Route path="/problems" element={<ProblemList />} />
                <Route path="/training/:problemId" element={<Training />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/marathon" element={<Marathon />} />
                <Route path="/html-css" element={<HtmlCssMode />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </FocusProvider>
    </AuthProvider>
  )
}
