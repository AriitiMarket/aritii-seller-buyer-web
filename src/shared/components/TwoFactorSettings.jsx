import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  MdSecurity,
  MdShield,
  MdCheckCircle,
  MdContentCopy,
  MdDownload,
  MdPrint,
  MdQrCodeScanner,
  MdEmail,
  MdSms,
  MdArrowBack,
  MdWarning,
  MdLock,
  MdRefresh,
} from 'react-icons/md';
import twoFactorService from '@/services/twoFactor.service';

/**
 * TwoFactorSettings
 * Reusable 2FA management component for Buyer & Seller account settings.
 * Supports TOTP (Authenticator App), Email OTP, and SMS OTP.
 */
export const TwoFactorSettings = ({ onStatusChange }) => {
  const currentUser = useSelector((state) => state.user?.user);

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [view, setView] = useState('overview'); // 'overview' | 'select-method' | 'verify-setup' | 'backup-codes'

  // Setup Wizard State
  const [selectedMethod, setSelectedMethod] = useState('TOTP');
  const [setupData, setSetupData] = useState(null); // { qrCode, secret, manualEntryKey, target, tempOTP }
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [setupSubmitting, setSetupSubmitting] = useState(false);
  const [backupCodes, setBackupCodes] = useState([]);
  const [copiedCode, setCopiedCode] = useState(false);

  // Disable State
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [disableSubmitting, setDisableSubmitting] = useState(false);

  // Regenerate Backup Codes State
  const [showRegenModal, setShowRegenModal] = useState(false);
  const [regenSubmitting, setRegenSubmitting] = useState(false);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const data = await twoFactorService.getStatus();
      setStatus(data);
      onStatusChange?.(data);
    } catch (err) {
      console.error('Failed to load 2FA status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  // Initialize email/phone inputs with current user info
  useEffect(() => {
    if (currentUser?.email) setEmailInput(currentUser.email);
    if (currentUser?.phoneNumber) setPhoneInput(currentUser.phoneNumber);
  }, [currentUser]);

  // Handle starting the setup flow
  const handleStartSetup = () => {
    setSelectedMethod('TOTP');
    setVerificationCode('');
    setSetupData(null);
    setView('select-method');
  };

  // Handle method selection and requesting setup data
  const handleProceedToVerify = async () => {
    setSetupSubmitting(true);
    try {
      const payload = { method: selectedMethod };
      if (selectedMethod === 'EMAIL') {
        if (!emailInput.trim()) {
          toast.error('Please enter an email address');
          setSetupSubmitting(false);
          return;
        }
        payload.email = emailInput.trim();
      }
      if (selectedMethod === 'SMS') {
        if (!phoneInput.trim()) {
          toast.error('Please enter a mobile phone number');
          setSetupSubmitting(false);
          return;
        }
        payload.phoneNumber = phoneInput.trim();
      }

      const res = await twoFactorService.setup(payload);
      setSetupData(res);
      setView('verify-setup');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to initiate 2FA setup';
      toast.error(msg);
    } finally {
      setSetupSubmitting(false);
    }
  };

  // Verify the code and complete setup
  const handleVerifySetupSubmit = async (e) => {
    e?.preventDefault();
    if (!verificationCode.trim()) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }

    setSetupSubmitting(true);
    try {
      const payload = {
        code: verificationCode.trim(),
        method: selectedMethod,
      };
      if (selectedMethod === 'SMS') {
        payload.phoneNumber = phoneInput.trim();
      }

      const res = await twoFactorService.verifySetup(payload);
      toast.success(res?.message || 'Two-Factor Authentication enabled successfully!');
      
      const codes = res?.backupCodes || [];
      if (codes.length > 0) {
        setBackupCodes(codes);
        setView('backup-codes');
      } else {
        await loadStatus();
        setView('overview');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Invalid verification code';
      toast.error(msg);
    } finally {
      setSetupSubmitting(false);
    }
  };

  // Disable 2FA
  const handleDisableConfirm = async (e) => {
    e?.preventDefault();
    if (!disablePassword) {
      toast.error('Please enter your current password');
      return;
    }

    setDisableSubmitting(true);
    try {
      await twoFactorService.disable(disablePassword);
      toast.success('Two-Factor Authentication has been disabled');
      setShowDisableModal(false);
      setDisablePassword('');
      await loadStatus();
      setView('overview');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to disable 2FA';
      toast.error(msg);
    } finally {
      setDisableSubmitting(false);
    }
  };

  // Regenerate Backup Codes
  const handleRegenerateCodes = async () => {
    setRegenSubmitting(true);
    try {
      const res = await twoFactorService.regenerateBackupCodes();
      toast.success('New backup codes generated');
      setBackupCodes(res?.backupCodes || []);
      setShowRegenModal(false);
      setView('backup-codes');
      await loadStatus();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to regenerate backup codes';
      toast.error(msg);
    } finally {
      setRegenSubmitting(false);
    }
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setCopiedCode(true);
    toast.success('Backup codes copied to clipboard');
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const downloadBackupCodes = () => {
    const text = `ARITII MARKETPLACE - 2FA BACKUP RECOVERY CODES\nAccount: ${currentUser?.email || ''}\nGenerated: ${new Date().toLocaleString()}\n\nKeep these codes in a safe, offline place. Each code can only be used once.\n\n${backupCodes.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aritii-backup-codes-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printBackupCodes = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Ariiti Backup Codes</title>
          <style>
            body { font-family: monospace; padding: 40px; color: #131921; }
            h2 { margin-bottom: 5px; }
            p { color: #666; font-size: 14px; margin-bottom: 20px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-width: 400px; margin: 20px 0; }
            .code { padding: 8px 12px; background: #f4f4f4; border: 1px solid #ddd; font-weight: bold; border-radius: 4px; }
          </style>
        </head>
        <body>
          <h2>Ariiti 2FA Recovery Codes</h2>
          <p>Account: ${currentUser?.email || ''}<br/>Date: ${new Date().toLocaleString()}</p>
          <p>Each code can be used once if you lose access to your primary 2FA method.</p>
          <div class="grid">
            ${backupCodes.map((code) => `<div class="code">${code}</div>`).join('')}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-market-on-surface-variant">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-market-primary border-t-transparent mb-2" />
        <p className="text-xs">Loading 2FA security status...</p>
      </div>
    );
  }

  // ==========================================
  // VIEW 1: Overview
  // ==========================================
  if (view === 'overview') {
    const isEnabled = Boolean(status?.enabled);

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-market-border bg-market-surface-container-low">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full shrink-0 ${isEnabled ? 'bg-green-100 text-green-700' : 'bg-market-surface-dim text-market-on-surface-variant'}`}>
              {isEnabled ? <MdCheckCircle className="text-2xl" /> : <MdShield className="text-2xl" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-market-on-surface">Two-Factor Authentication (2FA)</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  isEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                }`}>
                  {isEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <p className="text-xs text-market-on-surface-variant mt-1 leading-relaxed">
                {isEnabled
                  ? `Your account is protected with 2FA using ${
                      status?.type === 'TOTP'
                        ? 'an Authenticator App (Google/Microsoft/Authy)'
                        : status?.type === 'EMAIL'
                        ? 'Email Verification Codes'
                        : 'SMS Verification Codes'
                    }.`
                  : 'Add an extra layer of protection to your account by requiring a verification code upon login.'}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center">
            {isEnabled ? (
              <button
                type="button"
                onClick={() => setShowDisableModal(true)}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-50 transition"
              >
                Disable 2FA
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartSetup}
                className="px-4 py-2.5 bg-market-primary text-market-on-primary rounded-xl text-xs font-bold hover:bg-market-primary-hover shadow-sm transition"
              >
                Enable 2FA
              </button>
            )}
          </div>
        </div>

        {/* Backup Codes Section (Only when 2FA is active) */}
        {isEnabled && (
          <div className="p-5 rounded-xl border border-market-border bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-market-on-surface">Emergency Backup Codes</h4>
                <p className="text-xs text-market-on-surface-variant mt-0.5">
                  Backup codes allow you to sign in if you lose access to your primary device.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                {status?.backupCodesRemaining ?? 0} codes remaining
              </span>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowRegenModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-market-border rounded-lg text-xs font-semibold text-market-on-surface hover:bg-market-surface-dim transition"
              >
                <MdRefresh className="text-sm" />
                Regenerate Backup Codes
              </button>
            </div>
          </div>
        )}

        {/* Modal: Disable 2FA */}
        {showDisableModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-market-border space-y-4">
              <div className="flex items-center gap-3 text-red-600">
                <div className="p-2 bg-red-100 rounded-full">
                  <MdWarning className="text-xl" />
                </div>
                <h3 className="text-base font-bold text-market-on-surface">Disable Two-Factor Authentication</h3>
              </div>
              <p className="text-xs text-market-on-surface-variant leading-relaxed">
                Disabling 2FA makes your account less secure. To confirm this change, please enter your current account password.
              </p>
              <form onSubmit={handleDisableConfirm} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-market-on-surface mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter account password"
                    value={disablePassword}
                    onChange={(e) => setDisablePassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-market-border rounded-xl focus:ring-2 focus:ring-market-secondary/20 focus:border-market-secondary"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDisableModal(false);
                      setDisablePassword('');
                    }}
                    className="px-4 py-2 border border-market-border text-market-on-surface rounded-xl text-xs font-semibold hover:bg-market-surface-dim transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={disableSubmitting}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 disabled:opacity-50 transition"
                  >
                    {disableSubmitting ? 'Disabling...' : 'Confirm Disable'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Confirm Regenerate Backup Codes */}
        {showRegenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-market-border space-y-4">
              <div className="flex items-center gap-3 text-amber-600">
                <div className="p-2 bg-amber-100 rounded-full">
                  <MdRefresh className="text-xl" />
                </div>
                <h3 className="text-base font-bold text-market-on-surface">Regenerate Backup Codes</h3>
              </div>
              <p className="text-xs text-market-on-surface-variant leading-relaxed">
                Generating new backup codes will invalidate any existing codes you may have previously saved.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRegenModal(false)}
                  className="px-4 py-2 border border-market-border text-market-on-surface rounded-xl text-xs font-semibold hover:bg-market-surface-dim transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRegenerateCodes}
                  disabled={regenSubmitting}
                  className="px-4 py-2 bg-market-primary text-market-on-primary rounded-xl text-xs font-bold hover:bg-market-primary-hover disabled:opacity-50 transition"
                >
                  {regenSubmitting ? 'Regenerating...' : 'Regenerate Now'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 2: Select Method Wizard
  // ==========================================
  if (view === 'select-method') {
    return (
      <div className="space-y-5 p-6 rounded-xl border border-market-border bg-white shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-market-border">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setView('overview')}
              className="p-1.5 rounded-lg text-market-on-surface-variant hover:bg-market-surface-dim transition"
              aria-label="Back"
            >
              <MdArrowBack className="text-lg" />
            </button>
            <h3 className="text-base font-bold text-market-on-surface">Choose 2FA Method</h3>
          </div>
          <span className="text-xs text-market-on-surface-variant font-medium">Step 1 of 3</span>
        </div>

        <p className="text-xs text-market-on-surface-variant">
          Select how you want to receive or generate security verification codes when logging in:
        </p>

        <div className="space-y-3">
          {/* TOTP */}
          <label
            onClick={() => setSelectedMethod('TOTP')}
            className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
              selectedMethod === 'TOTP'
                ? 'border-market-secondary bg-blue-50/40'
                : 'border-market-border hover:bg-market-surface-dim'
            }`}
          >
            <div className={`p-2.5 rounded-xl shrink-0 ${selectedMethod === 'TOTP' ? 'bg-market-secondary text-white' : 'bg-market-surface-dim text-market-on-surface-variant'}`}>
              <MdQrCodeScanner className="text-2xl" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-market-on-surface">Authenticator App</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">Recommended</span>
              </div>
              <p className="text-xs text-market-on-surface-variant mt-0.5">
                Use Google Authenticator, Microsoft Authenticator, or Authy. Works offline and is the most secure.
              </p>
            </div>
            <input
              type="radio"
              name="2fa-method"
              checked={selectedMethod === 'TOTP'}
              onChange={() => setSelectedMethod('TOTP')}
              className="mt-1 w-4 h-4 text-market-secondary focus:ring-market-secondary"
            />
          </label>

          {/* EMAIL */}
          <label
            onClick={() => setSelectedMethod('EMAIL')}
            className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
              selectedMethod === 'EMAIL'
                ? 'border-market-secondary bg-blue-50/40'
                : 'border-market-border hover:bg-market-surface-dim'
            }`}
          >
            <div className={`p-2.5 rounded-xl shrink-0 ${selectedMethod === 'EMAIL' ? 'bg-market-secondary text-white' : 'bg-market-surface-dim text-market-on-surface-variant'}`}>
              <MdEmail className="text-2xl" />
            </div>
            <div className="flex-1">
              <span className="font-bold text-sm text-market-on-surface">Email Verification</span>
              <p className="text-xs text-market-on-surface-variant mt-0.5">
                Receive a 6-digit one-time passcode at your registered email address.
              </p>
              {selectedMethod === 'EMAIL' && (
                <div className="mt-3">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3.5 py-2 text-xs border border-market-border rounded-lg bg-white focus:ring-2 focus:ring-market-secondary/20"
                  />
                </div>
              )}
            </div>
            <input
              type="radio"
              name="2fa-method"
              checked={selectedMethod === 'EMAIL'}
              onChange={() => setSelectedMethod('EMAIL')}
              className="mt-1 w-4 h-4 text-market-secondary focus:ring-market-secondary"
            />
          </label>

          {/* SMS */}
          <label
            onClick={() => setSelectedMethod('SMS')}
            className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
              selectedMethod === 'SMS'
                ? 'border-market-secondary bg-blue-50/40'
                : 'border-market-border hover:bg-market-surface-dim'
            }`}
          >
            <div className={`p-2.5 rounded-xl shrink-0 ${selectedMethod === 'SMS' ? 'bg-market-secondary text-white' : 'bg-market-surface-dim text-market-on-surface-variant'}`}>
              <MdSms className="text-2xl" />
            </div>
            <div className="flex-1">
              <span className="font-bold text-sm text-market-on-surface">SMS Verification</span>
              <p className="text-xs text-market-on-surface-variant mt-0.5">
                Receive a 6-digit one-time passcode via text message on your phone.
              </p>
              {selectedMethod === 'SMS' && (
                <div className="mt-3">
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="Enter phone number e.g. +251912345678"
                    className="w-full px-3.5 py-2 text-xs border border-market-border rounded-lg bg-white focus:ring-2 focus:ring-market-secondary/20"
                  />
                </div>
              )}
            </div>
            <input
              type="radio"
              name="2fa-method"
              checked={selectedMethod === 'SMS'}
              onChange={() => setSelectedMethod('SMS')}
              className="mt-1 w-4 h-4 text-market-secondary focus:ring-market-secondary"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-market-border">
          <button
            type="button"
            onClick={() => setView('overview')}
            className="px-4 py-2 border border-market-border text-market-on-surface rounded-xl text-xs font-semibold hover:bg-market-surface-dim transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleProceedToVerify}
            disabled={setupSubmitting}
            className="px-5 py-2.5 bg-market-primary text-market-on-primary rounded-xl text-xs font-bold hover:bg-market-primary-hover disabled:opacity-50 transition"
          >
            {setupSubmitting ? 'Preparing...' : 'Continue'}
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: Verify Setup Code
  // ==========================================
  if (view === 'verify-setup') {
    return (
      <div className="space-y-5 p-6 rounded-xl border border-market-border bg-white shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-market-border">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setView('select-method')}
              className="p-1.5 rounded-lg text-market-on-surface-variant hover:bg-market-surface-dim transition"
              aria-label="Back"
            >
              <MdArrowBack className="text-lg" />
            </button>
            <h3 className="text-base font-bold text-market-on-surface">
              {selectedMethod === 'TOTP'
                ? 'Scan QR Code & Verify'
                : selectedMethod === 'EMAIL'
                ? 'Verify Email Code'
                : 'Verify Phone Code'}
            </h3>
          </div>
          <span className="text-xs text-market-on-surface-variant font-medium">Step 2 of 3</span>
        </div>

        {selectedMethod === 'TOTP' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-market-surface-container-low border border-market-border flex flex-col md:flex-row items-center gap-5">
              {setupData?.qrCode ? (
                <img
                  src={setupData.qrCode}
                  alt="2FA QR Code"
                  className="w-40 h-40 bg-white p-2 rounded-xl border border-market-border shadow-xs"
                />
              ) : (
                <div className="w-40 h-40 flex items-center justify-center bg-gray-100 rounded-xl text-xs text-gray-500">
                  QR Code Unavailable
                </div>
              )}
              <div className="space-y-2 text-center md:text-left">
                <h4 className="text-sm font-bold text-market-on-surface">1. Scan with your app</h4>
                <p className="text-xs text-market-on-surface-variant leading-relaxed">
                  Open your authenticator app (Google Authenticator, Microsoft Authenticator, etc.) and scan the QR code.
                </p>
                {setupData?.secret && (
                  <div className="pt-2">
                    <span className="text-[11px] text-market-on-surface-variant block font-medium">
                      Or enter this secret key manually:
                    </span>
                    <div className="mt-1 flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-market-border">
                      <code className="text-xs font-mono font-bold tracking-wider text-market-on-surface">
                        {setupData.secret}
                      </code>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(setupData.secret);
                          toast.success('Secret key copied');
                        }}
                        className="text-market-on-surface-variant hover:text-market-secondary"
                        title="Copy secret"
                      >
                        <MdContentCopy className="text-sm" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {(selectedMethod === 'EMAIL' || selectedMethod === 'SMS') && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
            <p className="text-xs text-blue-900 leading-relaxed font-medium">
              A 6-digit verification code has been sent to{' '}
              <strong className="underline">
                {selectedMethod === 'EMAIL' ? emailInput : phoneInput}
              </strong>
              .
            </p>
            {setupData?.tempOTP && (
              <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                <span className="font-bold">Development Mode OTP:</span> {setupData.tempOTP}
              </div>
            )}
          </div>
        )}

        {/* Verification Form */}
        <form onSubmit={handleVerifySetupSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-market-on-surface mb-1">
              Enter 6-Digit Code
            </label>
            <input
              type="text"
              required
              maxLength={6}
              autoFocus
              pattern="[0-9]{6}"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              className="w-full text-center tracking-widest text-xl font-mono px-4 py-3 border border-market-border rounded-xl focus:ring-2 focus:ring-market-secondary/20 focus:border-market-secondary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-market-border">
            <button
              type="button"
              onClick={() => setView('select-method')}
              className="px-4 py-2 border border-market-border text-market-on-surface rounded-xl text-xs font-semibold hover:bg-market-surface-dim transition"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={setupSubmitting || verificationCode.length !== 6}
              className="px-6 py-2.5 bg-market-primary text-market-on-primary rounded-xl text-xs font-bold hover:bg-market-primary-hover disabled:opacity-50 transition shadow-sm"
            >
              {setupSubmitting ? 'Verifying...' : 'Verify & Activate'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ==========================================
  // VIEW 4: Backup Codes Display
  // ==========================================
  if (view === 'backup-codes') {
    return (
      <div className="space-y-5 p-6 rounded-xl border border-market-border bg-white shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-market-border">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-100 text-green-700 rounded-lg">
              <MdCheckCircle className="text-xl" />
            </div>
            <h3 className="text-base font-bold text-market-on-surface">Emergency Backup Codes</h3>
          </div>
          <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full">
            Active
          </span>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <MdWarning className="text-amber-600 text-lg shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900 leading-relaxed">
            <strong>Important:</strong> Save these backup codes now. They are only displayed once. If you ever lose access to your phone or authenticator app, each code can be used once to access your account.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 bg-market-surface-container-low p-4 rounded-xl border border-market-border font-mono text-xs">
          {backupCodes.map((code, index) => (
            <div
              key={index}
              className="bg-white p-2.5 rounded-lg border border-market-border text-center font-bold tracking-wider text-market-on-surface"
            >
              {code}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-market-border">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyBackupCodes}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-market-border rounded-lg text-xs font-semibold text-market-on-surface hover:bg-market-surface-dim transition"
            >
              <MdContentCopy className="text-sm" />
              {copiedCode ? 'Copied!' : 'Copy All'}
            </button>
            <button
              type="button"
              onClick={downloadBackupCodes}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-market-border rounded-lg text-xs font-semibold text-market-on-surface hover:bg-market-surface-dim transition"
            >
              <MdDownload className="text-sm" />
              Download .txt
            </button>
            <button
              type="button"
              onClick={printBackupCodes}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-market-border rounded-lg text-xs font-semibold text-market-on-surface hover:bg-market-surface-dim transition"
            >
              <MdPrint className="text-sm" />
              Print
            </button>
          </div>

          <button
            type="button"
            onClick={async () => {
              await loadStatus();
              setView('overview');
            }}
            className="px-6 py-2.5 bg-market-primary text-market-on-primary rounded-xl text-xs font-bold hover:bg-market-primary-hover transition"
          >
            I Have Saved My Codes
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default TwoFactorSettings;
