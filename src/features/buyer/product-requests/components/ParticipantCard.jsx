import React from 'react';
import { Avatar } from '@/components/common';
import { PlaceholderAvatar } from '@/assets';
import { initials } from '@/shared/utils/format';

/**
 * Buyer / seller identity card used inside a request workspace.
 * Shows only public profile facts: avatar, display name and caller-supplied
 * meta lines (role, contact, location, business…). Falls back to initials
 * when no profile image is available.
 */
const ParticipantCard = ({ role, name, avatarUrl, meta = [], action = null, accent = false }) => {
  const displayName = name || (role === 'Buyer' ? 'A customer' : 'A seller');
  return (
    <div
      className={`rounded-xl border p-4 ${
        accent
          ? 'border-[#75d04b]/40 bg-[#f3ffee] dark:bg-[#75d04b]/10'
          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-850'
      }`}
    >
      <div className="flex items-start gap-3">
        {avatarUrl ? (
          <Avatar
            url={avatarUrl}
            fallback={PlaceholderAvatar}
            alt={displayName}
            className="w-11 h-11 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <span className="w-11 h-11 rounded-full flex-shrink-0 bg-[#f3ffee] dark:bg-[#75d04b]/15 text-[#75d04b] border border-[#75d04b]/30 font-semibold flex items-center justify-center text-sm">
            {initials(displayName) || '?'}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500 font-semibold">{role}</p>
          <p className="font-semibold text-gray-900 dark:text-white truncate">{displayName}</p>
          {meta.length > 0 && (
            <ul className="mt-1.5 space-y-0.5">
              {meta
                .filter((item) => item?.value)
                .map((item) => (
                  <li key={item.label} className="text-xs text-gray-600 dark:text-gray-400 flex gap-1.5">
                    <span className="text-gray-400 dark:text-gray-500">{item.label}:</span>
                    <span className="truncate">{item.value}</span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
      {action ? <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">{action}</div> : null}
    </div>
  );
};

export default ParticipantCard;
