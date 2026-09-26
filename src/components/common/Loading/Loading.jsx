import React from 'react';

const Loading = ({ variant = 'page', label, className = '' }) => {
  const inline = variant === 'inline';

  if (inline) {
    return (
      <div className={`flex items-center justify-center gap-3 py-10 ${className}`} role="status">
        <span className="h-6 w-6 animate-spin rounded-full border-4 border-gray-200 border-t-[#75d04b]" />
        <span className="text-sm text-gray-500">{label || 'Loading…'}</span>
      </div>
    );
  }

  return (
    <div
      className={`w-full flex h-screen flex-col items-center justify-center ${className}`}
      role="status"
    >
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
        <div className="absolute inset-0 border-4 border-[#75d04b] border-t-transparent rounded-full animate-spin" />
      </div>
      {label && <span className="mt-4 text-sm text-gray-500">{label}</span>}
      {!label && <span className="sr-only">Loading...</span>}
    </div>
  );
};

export { Loading };
export default Loading;
