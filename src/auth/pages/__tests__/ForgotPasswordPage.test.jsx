import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ForgotPasswordPage from '../ForgotPasswordPage';
import authService from '@/services/auth.service';

vi.mock('@/services/auth.service', () => ({
  default: {
    forgotPassword: vi.fn(),
  },
}));

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders recovery form with email input and submit button', () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Reset Your Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Registered Email Address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Reset Link/i })).toBeInTheDocument();
  });

  it('validates email format before submitting', async () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole('button', { name: /Send Reset Link/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Please enter your email address/i)).toBeInTheDocument();
    expect(authService.forgotPassword).not.toHaveBeenCalled();

    const input = screen.getByLabelText(/Registered Email Address/i);
    fireEvent.change(input, { target: { value: 'not-an-email' } });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Please enter a valid email address/i)).toBeInTheDocument();
    expect(authService.forgotPassword).not.toHaveBeenCalled();
  });

  it('calls authService.forgotPassword and displays neutral confirmation', async () => {
    authService.forgotPassword.mockResolvedValueOnce({ success: true });

    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    );

    const input = screen.getByLabelText(/Registered Email Address/i);
    const submitBtn = screen.getByRole('button', { name: /Send Reset Link/i });

    fireEvent.change(input, { target: { value: 'user@example.com' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(authService.forgotPassword).toHaveBeenCalledWith('user@example.com');
    });

    expect(await screen.findByText(/Check Your Email/i)).toBeInTheDocument();
    expect(screen.getByText(/If an account exists for/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Return to Sign In/i })).toBeInTheDocument();
  });
});
