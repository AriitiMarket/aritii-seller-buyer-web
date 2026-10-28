import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UnifiedLoginModal from '../UnifiedLoginModal';

describe('UnifiedLoginModal', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onLogin: vi.fn(),
    onVerify2FA: vi.fn(),
    onForgot: vi.fn(),
    onContactUs: vi.fn(),
    role: 'BUYER',
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal header, branding, inputs, and submit button', () => {
    render(
      <MemoryRouter>
        <UnifiedLoginModal {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Sign in to Ariiti Market/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email or mobile phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Sign in$/i })).toBeInTheDocument();
    expect(screen.getByText(/Forgot password\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Create your account/i)).toBeInTheDocument();
  });

  it('does NOT render fake Google, Facebook, or LinkedIn social login buttons', () => {
    render(
      <MemoryRouter>
        <UnifiedLoginModal {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.queryByLabelText(/Sign in with Google/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Sign in with Facebook/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Sign in with LinkedIn/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/or sign in with/i)).not.toBeInTheDocument();
  });

  it('toggles password visibility when eye button is clicked', () => {
    render(
      <MemoryRouter>
        <UnifiedLoginModal {...defaultProps} />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText(/^Password$/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleButton = screen.getByLabelText(/Show password/i);
    fireEvent.click(toggleButton);

    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText(/Hide password/i)).toBeInTheDocument();
  });

  it('calls onLogin with trimmed credentials upon submission', async () => {
    render(
      <MemoryRouter>
        <UnifiedLoginModal {...defaultProps} />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email or mobile phone number/i);
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const submitButton = screen.getByRole('button', { name: /^Sign in$/i });

    fireEvent.change(emailInput, { target: { value: '  shopper@example.com  ' } });
    fireEvent.change(passwordInput, { target: { value: 'Secret123!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(defaultProps.onLogin).toHaveBeenCalledWith({
        email: 'shopper@example.com',
        password: 'Secret123!',
      });
    });
  });

  it('calls onForgot when Forgot password link is clicked', () => {
    render(
      <MemoryRouter>
        <UnifiedLoginModal {...defaultProps} />
      </MemoryRouter>
    );

    const forgotButton = screen.getByText(/Forgot password\?/i);
    fireEvent.click(forgotButton);

    expect(defaultProps.onForgot).toHaveBeenCalledTimes(1);
  });

  it('calls onContactUs with role when Create your account is clicked', () => {
    render(
      <MemoryRouter>
        <UnifiedLoginModal {...defaultProps} role="SELLER" />
      </MemoryRouter>
    );

    const registerButton = screen.getByText(/Create your account/i);
    fireEvent.click(registerButton);

    expect(defaultProps.onContactUs).toHaveBeenCalledWith('SELLER');
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <MemoryRouter>
        <UnifiedLoginModal {...defaultProps} />
      </MemoryRouter>
    );

    const closeButton = screen.getByLabelText(/Close modal/i);
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('displays error message when error prop is provided', () => {
    render(
      <MemoryRouter>
        <UnifiedLoginModal {...defaultProps} error="Invalid email or password" />
      </MemoryRouter>
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password');
  });
});
