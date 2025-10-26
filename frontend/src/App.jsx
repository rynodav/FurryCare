import Pets from './components/Pets';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">FurryCare 🐾</h1>
      <Pets />
      <Toaster position="top-right" />
    </div>
  );
}
