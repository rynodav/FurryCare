// Main pets component (handles listing pets + reminders panel)
import Pets from './components/Pets'

// Toast container for showing success/error messages globally
import { Toaster } from 'react-hot-toast'

/**
 * Root application component
 * - Provides main page layout (header / main / footer)
 * - Centers content using Tailwind container-narrow
 * - Renders Pets management UI
 * - Mounts global toast notification system
 */
export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Top header */}
      <header className="border-b border-slate-800 bg-slate-950">
        <div className="container-narrow py-4">
          <h1 className="text-3xl font-semibold tracking-tight">
            FurryCare <span className="align-middle text-orange-400">🐾</span>
          </h1>
          <p className="muted text-sm mt-1 max-w-xl">
            Manage your pets and care reminders in one place.
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="container-narrow py-8">
        <div className="card">
          <div className="card-pad">
            <Pets />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-10 border-t border-slate-800 bg-slate-950">
        <div className="container-narrow text-sm muted py-4 text-center">
          © {new Date().getFullYear()} Furry Care
        </div>
      </footer>

      {/* Toast notifications */}
      <Toaster position="top-right" />
    </div>
  )
}