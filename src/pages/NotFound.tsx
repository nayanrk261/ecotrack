
import { Link } from 'react-router-dom';
import { Leaf, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="page-wrapper min-h-[80vh] flex items-center justify-center relative overflow-hidden px-4 py-12">
      {/* Background glow animations */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md card bg-zinc-950/40 backdrop-blur-2xl border border-zinc-900 rounded-3xl p-8 relative z-10 shadow-2xl shadow-black/80 text-center">
        
        {/* Logo/Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-green-500 to-emerald-700 flex items-center justify-center text-zinc-950 shadow-lg shadow-green-500/10 mb-6 mx-auto animate-bounce">
          <Leaf size={32} />
        </div>

        <h2 className="text-4xl font-extrabold tracking-tight text-white mb-2">404</h2>
        <h3 className="text-xl font-bold text-white mb-4">Page Not Found</h3>
        
        <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
          The page you are looking for doesn't exist or has been moved. Let's get you back on track to reducing your footprint.
        </p>

        <Link
          to="/"
          className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-zinc-950 font-bold rounded-xl transition-all shadow-lg shadow-green-500/10 flex items-center justify-center gap-2 hover:shadow-green-500/20 active:scale-[0.98] text-decoration-none"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
