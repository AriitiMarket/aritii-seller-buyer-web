import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import CustomerPortalLoginModal from './CustomerPortalLoginModal';

describe('CustomerPortalLoginModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<CustomerPortalLoginModal open={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the portal login UI when open', () => {
    render(<CustomerPortalLoginModal open onClose={vi.fn()} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('CUSTOMER PORTAL')).toBeInTheDocument();
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to access your projects and assets.')).toBeInTheDocument();

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();

    expect(screen.getByRole('checkbox', { name: 'Remember me' })).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(screen.getByText('Contact us')).toBeInTheDocument();

    // Social sign-in buttons
    expect(screen.getByRole('link', { name: 'Sign in with Google' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign in with Facebook' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign in with LinkedIn' })).toBeInTheDocument();
  });

  it('closes when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<CustomerPortalLoginModal open onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when Escape is pressed', () => {
    const onClose = vi.fn();
    render(<CustomerPortalLoginModal open onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('locks body scroll while open', () => {
    render(<CustomerPortalLoginModal open onClose={vi.fn()} />);
    expect(document.body.style.overflow).toBe('hidden');
  });
});
