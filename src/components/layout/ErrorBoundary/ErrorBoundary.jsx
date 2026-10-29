import React from 'react'

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
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo)

    if (isDynamicImportError(error)) {
      const lastReload = Number(sessionStorage.getItem('chunk_reload') || 0);
      if (Date.now() - lastReload > 10000) {
        sessionStorage.setItem('chunk_reload', String(Date.now()));
        window.location.reload();
      }
    }
  }

  render() {
    if (this.state.hasError) {
      const isChunk = isDynamicImportError(this.state.error);

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#083B24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isChunk ? 'New Version Available' : 'Something went wrong'}
            </h1>
            <p className="text-gray-600 mb-6">
              {isChunk
                ? 'A new version of Aritii Market has been deployed. Please refresh the page to load the latest updates.'
                : 'An unexpected error occurred. Please try refreshing the page.'}
            </p>
            <button
              onClick={() => {
                sessionStorage.removeItem('chunk_reload');
                window.location.reload();
              }}
              className="bg-[#083B24] text-white px-6 py-3 rounded-lg hover:bg-[#052919] transition-colors font-medium shadow"
            >
              {isChunk ? 'Update & Refresh' : 'Refresh Page'}
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
