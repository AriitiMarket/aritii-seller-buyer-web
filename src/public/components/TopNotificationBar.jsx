import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';

export default function TopNotificationBar({
  message = "🚀 Fast & Reliable nationwide delivery across Ethiopia on Aritii Market!",
  ctaLabel = "Explore Deals",
  ctaLink = "/deals",
  onDismiss,
}) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <aside
      className="bg-[#141414] border-b-2 border-[#75d04b] text-gray-300 text-xs py-2 px-4 transition-all duration-300 relative z-[65]"
      aria-label="Announcement"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex-1 flex items-center justify-center gap-3 text-center truncate">
          <span className="font-medium text-gray-200 truncate">{message}</span>
          {ctaLabel && (
            <Link
              to={ctaLink}
              className="px-3 py-0.5 bg-[#75d04b] text-white font-semibold text-[11px] rounded-full hover:brightness-95 active:scale-95 transition-all flex-shrink-0"
            >
              {ctaLabel}
            </Link>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            setVisible(false);
            onDismiss?.();
          }}
          className="text-gray-400 hover:text-white p-1 rounded-full transition-colors flex-shrink-0"
          aria-label="Dismiss notification"
        >
          <AiOutlineClose size={14} />
        </button>
      </div>
    </aside>
  );
}
