import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="page-wrapper min-h-[85vh] flex items-center justify-center relative overflow-hidden px-4 py-12">
          {/* Background glow animations */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="w-full max-w-md card bg-zinc-950/40 backdrop-blur-2xl border border-red-500/20 rounded-3xl p-8 relative z-10 shadow-2xl shadow-black/80 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-500 to-rose-700 flex items-center justify-center text-zinc-950 shadow-lg shadow-red-500/20 mb-6 mx-auto animate-pulse">
              <AlertTriangle size={32} />
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white mb-3">
              Something went wrong
            </h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              We encountered an unexpected error while rendering this page. Your calculation data in local storage is safe.
            </p>

            {this.state.error && (
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 mb-6 text-left max-h-40 overflow-y-auto">
                <p className="font-mono text-xs text-red-400 break-words font-semibold">
                  {this.state.error.name}: {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReset}
                className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-zinc-950 font-bold rounded-xl transition-all shadow-lg shadow-red-500/10 flex items-center justify-center gap-2 hover:shadow-red-500/20 active:scale-[0.98] border-none cursor-pointer"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
              <a
                href="/"
                className="w-full sm:flex-1 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl transition-all border border-zinc-800 hover:border-zinc-700 flex items-center justify-center gap-2 active:scale-[0.98] text-decoration-none text-sm"
              >
                <Home size={16} />
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
