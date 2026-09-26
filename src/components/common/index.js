/**
 * Shared UI primitives barrel.
 *
 * Domain-agnostic building blocks used by every domain. Anything domain
 * specific belongs in `src/features/<domain>/components/`.
 *
 * NOTE: `@/components/common/*` must not import from `@/features/*`, otherwise
 * the domain boundary is broken (see docs/ARCHITECTURE.md).
 */
export { default as Button } from '@/components/common/Button/Button';
export { default as Input } from '@/components/common/Input/Input';
export { default as Modal } from '@/components/common/Modal/Modal';
export { default as EmptyState } from '@/components/common/EmptyState/EmptyState';
export { default as Loading } from '@/components/common/Loading/Loading';
export { default as Loader } from '@/components/common/Loading/Loading';
export { default as BrandLogo } from '@/components/common/BrandLogo';
export { default as Ratings } from '@/components/common/Ratings';
export { default as LocationSelector } from '@/components/common/LocationSelector';
export {
  default as ImageWithFallback,
  ProductImage,
  ShopImage,
  Avatar,
} from '@/components/common/ImageWithFallback';