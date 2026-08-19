import "@radix-ui/themes/styles.css";
import '../styles/globals.css'
import ReactDOM from 'react-dom/client'
import React from 'react'
import { Auth0Provider } from '@auth0/auth0-react'
import AuthProvider from '@/hooks/auth.provider.tsx';
import { BrowserRouter } from 'react-router-dom'
import { OrganisationProvider } from '@/modules/organisations/organisation.provider'
import { EventProvider } from '@/modules/events/event.provider'
import { CanalProvider } from '@/modules/canals';
import { Theme } from "@radix-ui/themes";
import App from './App'
import { UserProvider } from '@/modules/users';
import { MemberProvider } from "./modules/members";

const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || '',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || '',
  useRefreshTokens: true,
  useRefreshTokensFallback: true,
  cacheLocation: 'localstorage' as const,
  authorizationParams: {
    redirect_uri: window.location.origin + '/callback',
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
  },
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider {...auth0Config}>
      <AuthProvider>
        <BrowserRouter>
          <UserProvider>
            <OrganisationProvider>
              <EventProvider>
                <CanalProvider>
                  <MemberProvider>
                    <Theme appearance="inherit" accentColor="indigo" panelBackground="solid" scaling="100%">
                      <App />
                    </Theme>
                  </MemberProvider>
                </CanalProvider>
              </EventProvider>
            </OrganisationProvider>
          </UserProvider>
        </BrowserRouter>
      </AuthProvider>
    </Auth0Provider>
  </React.StrictMode>,
)
