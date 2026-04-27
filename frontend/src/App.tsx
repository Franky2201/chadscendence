import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-8">
      {/* Center Section */}
      <section className="max-w-2xl mx-auto flex flex-col items-center text-center py-12 bg-white rounded-3xl shadow-xl border border-slate-200">
        <div className="relative mb-8 flex justify-center items-center gap-4">
          <img
            src={viteLogo}
            className="w-16 h-16 drop-shadow-md hover:scale-110 transition-transform"
            alt="Vite logo"
          />
          <img
            src={reactLogo}
            className="w-16 h-16 drop-shadow-md hover:scale-110 transition-transform"
            alt="React logo"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Get started
          </h1>
          <p className="text-slate-600">
            Edit{' '}
            <code className="bg-slate-100 px-2 py-1 rounded text-pink-600 font-mono text-sm">
              src/App.tsx
            </code>{' '}
            and save to test <code className="font-bold">HMR</code>
          </p>
        </div>

        <button
          type="button"
          className="mt-8 px-6 py-3 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 active:scale-95 transition-all shadow-lg cursor-pointer"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      {/* Next Steps Section */}
      <section className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Documentation Card */}
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <span className="text-blue-500">📚</span> Documentation
          </h2>
          <p className="text-slate-500 mb-4 text-sm">
            Your questions, answered
          </p>
          <ul className="space-y-2">
            <li>
              <a
                href="https://vite.dev/"
                target="_blank"
                className="text-blue-600 hover:underline flex items-center gap-2 text-sm"
              >
                Explore Vite
              </a>
            </li>
            <li>
              <a
                href="https://react.dev/"
                target="_blank"
                className="text-blue-600 hover:underline flex items-center gap-2 text-sm"
              >
                Learn more
              </a>
            </li>
          </ul>
        </div>

        {/* Social Card */}
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <span className="text-purple-500">🌐</span> Connect
          </h2>
          <p className="text-slate-500 mb-4 text-sm">Join the community</p>
          <div className="flex flex-wrap gap-3">
            {/* Simplified links for brevity */}
            <a
              href="https://github.com/vitejs/vite"
              className="px-3 py-1 bg-slate-100 rounded hover:bg-slate-200 text-xs font-medium"
            >
              GitHub
            </a>
            <a
              href="https://x.com/vite_js"
              className="px-3 py-1 bg-slate-100 rounded hover:bg-slate-200 text-xs font-medium"
            >
              X.com
            </a>
            <a
              href="https://chat.vite.dev/"
              className="px-3 py-1 bg-slate-100 rounded hover:bg-slate-200 text-xs font-medium"
            >
              Discord
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
