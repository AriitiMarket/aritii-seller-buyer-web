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
        accent ? 'border-brand-primary/40 bg-brand-primary-light/50' : 'border-gray-100 bg-gray-50'
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
          <span className="w-11 h-11 rounded-full flex-shrink-0 bg-brand-primary-light text-brand-primary-dark border border-brand-primary/30 font-semibold flex items-center justify-center text-sm">
            {initials(displayName) || '?'}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">{role}</p>
          <p className="font-semibold text-gray-900 truncate">{displayName}</p>
          {meta.length > 0 && (
            <ul className="mt-1.5 space-y-0.5">
              {meta
                .filter((item) => item?.value)
                .map((item) => (
                  <li key={item.label} className="text-xs text-gray-500 flex gap-1.5">
                    <span className="text-gray-400">{item.label}:</span>
                    <span className="truncate">{item.value}</span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
      {action ? <div className="mt-3 pt-3 border-t border-gray-100">{action}</div> : null}
    </div>
  );
};

export default ParticipantCard;
