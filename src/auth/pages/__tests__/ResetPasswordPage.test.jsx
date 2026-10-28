import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResetPasswordPage from '../ResetPasswordPage';
import authService from '@/services/auth.service';

vi.mock('@/services/auth.service', () => ({
  default: {
    verifyResetToken: vi.fn(),
    resetPassword: vi.fn(),
  },
}));

describe('ResetPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays error if reset token is missing', async () => {
    render(
      <MemoryRouter initialEntries={['/reset-password']}>
        <ResetPasswordPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Password reset token is missing from the link/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Request New Reset Link/i })).toBeInTheDocument();
  });

  it('displays form when token is valid and updates password on submit', async () => {
    authService.verifyResetToken.mockResolvedValueOnce({
      valid: true,
      email: 'u***r@example.com',
    });
    authService.resetPassword.mockResolvedValueOnce({
      success: true,
      message: 'Password reset successfully',
    });

    render(
      <MemoryRouter initialEntries={['/reset-password?token=valid-secret-token']}>
        <ResetPasswordPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Setting new password for u\*\*\*r@example\.com/i)).toBeInTheDocument();

    const newPassInput = screen.getByLabelText(/New Password \(min 8 characters\)/i);
    const confirmPassInput = screen.getByLabelText(/Confirm New Password/i);
    const submitBtn = screen.getByRole('button', { name: /Reset Password/i });

    fireEvent.change(newPassInput, { target: { value: 'NewPassword123!' } });
    fireEvent.change(confirmPassInput, { target: { value: 'NewPassword123!' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(authService.resetPassword).toHaveBeenCalledWith({
        token: 'valid-secret-token',
        newPassword: 'NewPassword123!',
        confirmPassword: 'NewPassword123!',
      });
    });

    expect(await screen.findByText(/Password Reset Complete/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In with New Password/i })).toBeInTheDocument();
  });
});
