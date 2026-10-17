/**
 * useAuth - Authentication hook for marketplace
 *
 * Provides authentication state and user information
 * for marketplace pages and components.
 */
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, logoutUser } from '@/store/slices/userThunks'

/**
 * Get auth state from Redux store.
 * Selects stable primitives so the hook never returns a fresh object
 * reference (which would cause unnecessary re-renders).
 */
export const useAuth = () => {
  const isAuthenticated = useSelector((state) => state.user?.isAuthenticated ?? false)
  const user = useSelector((state) => state.user?.user ?? null)
  return { isAuthenticated, user }
}

export default useAuth