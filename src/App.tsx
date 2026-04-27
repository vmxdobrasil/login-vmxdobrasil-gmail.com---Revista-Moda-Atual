import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import Templates from './pages/Templates'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import { EditorProvider } from './stores/use-editor-store'
import { AuthProvider } from './hooks/use-auth'
import Studio from './pages/Studio'
import Login from './pages/Login'
import MediaLibrary from './pages/MediaLibrary'
import EventsPage from './pages/Events'
import ContributorProfile from './pages/ContributorProfile'
import LinkInBio from './pages/LinkInBio'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <EditorProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/studio" element={<Studio />} />
              <Route path="/media" element={<MediaLibrary />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/contributors/:id" element={<ContributorProfile />} />
            </Route>
            <Route path="/link-in-bio" element={<LinkInBio />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </EditorProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
