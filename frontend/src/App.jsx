// Main pets component (handles listing pets + reminders panel)
import Pets from './components/Pets';

// Toast container for showing success/error messages globally
import { Toaster } from 'react-hot-toast';

/**
 * Root application component
 * - Provides main layout container
 * - Displays app title
 * - Renders Pets management UI
 * - Mounts global toast notification system
 */
export default function App() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* App title */}
      <h1 className="text-2xl font-bold mb-4">FurryCare 🐾</h1>

      {/* Main app feature: Pet + Reminder management */}
      <Pets />

      {/* Toast notifications (top-right corner) */}
      <Toaster position="top-right" />
    </div>
  );
}
