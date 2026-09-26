import { useEffect } from 'react';

const Modal = ({ open, title, children, onClose }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in-up" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-xl bg-white dark:bg-gray-900 dark:text-white p-6 shadow-xl relative">
        <button 
          type="button" 
          onClick={onClose} 
          aria-label="Close"
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        {title && (
          <div className="mb-4 pr-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
          </div>
        )}
        <div className="pt-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
