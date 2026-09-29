import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { switchUserRole } from '@/store/slices/userThunks';
import { activeWorkspaceFor, workspacesFor } from '@/shared/utils/actorWorkspaces';

/**
 * RoleSwitcher — pick which role the account acts as.
 *
 * One account can hold several actor roles (buyer + seller + delivery provider).
 * Choosing one calls POST /auth/switch-role, which re-mints the access token with
 * that role, and then sends the user to that role's workspace.
 *
 * Renders nothing unless the account actually holds more than one role, so
 * single-role accounts see no change. The API only accepts roles the account
 * already holds, so this can never grant access — it selects among what exists.
 */
const RoleSwitcher = ({ className = '', tone = 'default' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user || {});
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const containerRef = useRef(null);

  const workspaces = workspacesFor(user);
  const active = activeWorkspaceFor(user);

  // Close on outside click / Escape — same interaction as the profile menu.
  useEffect(() => {
    if (!open) return undefined;
    const onClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (workspaces.length < 2 || !active) return null;

  const handleSelect = async (workspace) => {
    setOpen(false);
    if (workspace.role === active.role) {
      navigate(workspace.to);
      return;
    }
    setSwitching(true);
    try {
      await dispatch(switchUserRole(workspace.role));
      toast.success(`Now working as ${workspace.label}`);
      navigate(workspace.to);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not switch role');
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        disabled={switching}
        aria-haspopup="menu"
        aria-expanded={open}
        title="Switch role"
        className={`flex items-center gap-2 h-10 px-3 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 text-sm font-medium disabled:opacity-60 focus:outline-none focus:ring-2 ${tone === 'light' ? 'border-white/30 text-white hover:bg-white/15 focus:ring-white/50' : 'border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-[#75d04b]/20'}`}
      >
        <span className="w-2 h-2 rounded-full bg-[#75d04b]" aria-hidden="true" />
        <span className="hidden sm:inline">{switching ? 'Switching…' : active.label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-50"
        >
          <p className="px-4 py-2 text-[11px] uppercase tracking-wide text-gray-400">
            Switch role
          </p>
          {workspaces.map((workspace) => {
            const isActive = workspace.role === active.role;
            return (
              <button
                key={workspace.role}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => handleSelect(workspace)}
                className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition flex items-start gap-3 ${
                  isActive ? 'bg-[#75d04b]/5' : ''
                }`}
              >
                <span
                  className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                    isActive ? 'bg-[#75d04b]' : 'bg-gray-300'
                  }`}
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-gray-900">{workspace.label}</span>
                  <span className="block text-xs text-gray-500">{workspace.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RoleSwitcher;
