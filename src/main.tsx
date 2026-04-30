import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,    // 10 minutes
      gcTime: 30 * 60 * 1000,       // 30 minutes
      retry: 2,
      networkMode: 'offlineFirst',
    },
  },
})

const root = createRoot(document.getElementById('root')!)

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)

// Run axe-core accessibility audit in development only (WCAG AA validation per FR-11)
if (import.meta.env.DEV) {
  import('@axe-core/react').then(({ default: axe }) => {
    import('react').then(React => {
      import('react-dom').then(ReactDOM => {
        axe(React, ReactDOM, 1000)
      })
    })
  })
}
