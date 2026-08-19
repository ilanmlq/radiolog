import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { useAuth } from '@/hooks/use-auth.ts';
import { ProtectedRoute } from './pages/ProtectedRoute.tsx'
import { CallbackPage } from './pages/CallbackPage'
import { AdminLayout } from './layouts/AdminLayout'
import { MobileLayout } from './layouts/MobileLayout'

// Lazy load pages
import { lazy, Suspense } from 'react'

const AdminPage = lazy(() => import('./pages/admin/AdminPage'))
const CanalsPage = lazy(() => import('./pages/admin/CanalsPage'))
const TeamsPage = lazy(() => import('./pages/admin/TeamsPage'))
const TeamDetail = lazy(() => import('./pages/admin/TeamDetail'))
const MembersPage = lazy(() => import('./pages/admin/MembersPage'))
const MemberDetailPage = lazy(() => import('./pages/admin/MemberDetailPage'))
const RadiosPage = lazy(() => import('./pages/admin/RadiosPage'))
const ConversationsPage = lazy(() => import('./pages/admin/ConversationsPage'))
const PlacesPage = lazy(() => import('./pages/admin/PlacesPage'))
const UsersPage = lazy(() => import('./pages/admin/UsersPage'))
const IncidentPage = lazy(() => import('./pages/admin/IncidentPage'))
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'))

const MessagesPage = lazy(() => import('./pages/mobile/MessagesPage'))
const DirectoryPage = lazy(() => import('./pages/mobile/DirectoryPage'))
const MemberDetailPageMobile = lazy(() => import('./pages/mobile/MemberDetailsPage'))
const TeamDetailPageMobile = lazy(() => import('./pages/mobile/TeamDetails'))
const MapPage = lazy(() => import('./pages/mobile/MapPage'))
const ProfilePage = lazy(() => import('./pages/mobile/ProfilePage'))

function LoadingFallback() {
  return <div className="flex items-center justify-center min-h-screen">Chargement...</div>
}

function App() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return <LoadingFallback />
  }

  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public routes */}
          <Route path="/callback" element={<CallbackPage />} />

          {/* Protected admin routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminPage />} />
            <Route path="canals" element={<CanalsPage />} />
            <Route path="teams" element={<TeamsPage />} />
            <Route path="teams/:id" element={<TeamDetail />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="members/:id" element={<MemberDetailPage />} />
            <Route path="radios" element={<RadiosPage />} />
            <Route path="conversations" element={<ConversationsPage />} />
            <Route path="places" element={<PlacesPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="incidents" element={<IncidentPage />} />
          </Route>

          {/* Protected mobile routes */}
          <Route path="/" element={<ProtectedRoute><MobileLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/messages" replace />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="directory" element={<DirectoryPage />} />
            <Route path="directory/:id" element={<MemberDetailPageMobile />} />
            <Route path="team/:id" element={<TeamDetailPageMobile />} />
            <Route path="map" element={<MapPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster />
    </>
  )
}

export default App
