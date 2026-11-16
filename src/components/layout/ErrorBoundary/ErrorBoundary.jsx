import React from 'react';

function isDynamicImportError(error) {
  const msg = String(error?.message || '');
  return (
    error?.name === 'ChunkLoadError' ||
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Importing a module script failed') ||
    msg.includes('Expected a JavaScript-or-Wasm module script')
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    const portal = this.props.portalName;
    console.error(`[ErrorBoundary${portal ? ` - ${portal}` : ''}]`, error, errorInfo);

    if (typeof this.props.onError === 'function') {
      try {
        this.props.onError(error, errorInfo);
      } catch (_e) {
        // Suppress secondary errors in error reporting callback
      }
    }

    if (isDynamicImportError(error)) {
      const lastReload = Number(sessionStorage.getItem('chunk_reload') || 0);
      if (Date.now() - lastReload > 10000) {
        sessionStorage.setItem('chunk_reload', String(Date.now()));
        window.location.reload();
      }
    }
  }

  handleReset = () => {
    sessionStorage.removeItem('chunk_reload');
    this.setState({ hasError: false, error: null });
    if (typeof this.props.onReset === 'function') {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback({
            error: this.state.error,
            reset: this.handleReset,
          });
        }
        return this.props.fallback;
      }

      const isChunk = isDynamicImportError(this.state.error);
      const portal = this.props.portalName || '';

      return (
        <div
          data-testid="portal-error-boundary"
          data-portal={portal || 'global'}
          className="min-h-[50vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8"
        >
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-950/40 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#083B24] dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {isChunk ? 'New Version Available' : (portal ? `${portal} Encountered an Error` : 'Something went wrong')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
              {isChunk
                ? 'A new version of Aritii Market has been deployed. Please refresh the page to load the latest updates.'
                : portal
                  ? `An unexpected error occurred in ${portal}. The rest of the platform remains accessible.`
                  : 'An unexpected error occurred. Please try refreshing the page.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto bg-[#75d04b] text-gray-950 px-5 py-2.5 rounded-full hover:bg-[#66bb3f] transition-colors font-bold shadow text-sm"
              >
                {isChunk ? 'Update & Refresh' : (portal ? `Reload ${portal}` : 'Refresh Page')}
              </button>
              {portal ? (
                <a
                  href="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                  Return to Marketplace
                </a>
              ) : null}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
