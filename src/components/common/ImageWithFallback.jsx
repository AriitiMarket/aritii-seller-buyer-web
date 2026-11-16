import React, { useState } from "react";
import { resolveImageUrl, getFirstImage, getAvatarImage } from "@/shared/utils/image";
import { PlaceholderProduct, PlaceholderShop, PlaceholderAvatar } from "@/assets";

// Absolute last-resort 1x1 transparent pixel (data URI) so an <img> with no
// usable image NEVER emits `src=""` (which triggers a React network warning).
const BLANK_1PX =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5CBAADPZBHiywAAdpYxin8MAAh/g==";
const blank = (v) => (v && v.toString().trim() ? v : BLANK_1PX);

/** Shared image primitive: loading / error / fallback / lazy / object-fit. */
const ImageWithFallback = ({
  src,
  fallback,
  alt = "",
  className = "",
  objectFit = "cover",
  loading = "lazy",
  style,
  ...rest
}) => {
  const [prevSrc, setPrevSrc] = useState(src);
  const [failed, setFailed] = useState(false);

  // Reset error state when src changes without requiring an effect
  if (src !== prevSrc) {
    setPrevSrc(src);
    setFailed(false);
  }

  const effectiveSrc = failed
    ? (fallback ? blank(fallback) : BLANK_1PX)
    : blank(src || fallback);

  const handleError = () => {
    if (!failed) {
      setFailed(true);
    }
  };

  return (
    <img
      src={effectiveSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
      style={{ objectFit, ...style }}
      {...rest}
    />
  );
};

/** Product image aware of backend image shapes. */
const ProductImage = ({ data, src, fallback = PlaceholderProduct, ...rest }) => {
  const resolved =
    (src && resolveImageUrl(src)) || getFirstImage(data) || fallback;
  return <ImageWithFallback src={resolved} fallback={fallback} {...rest} />;
};

/** Shop avatar / cover image. */
const ShopImage = ({ data, fallback = PlaceholderShop, ...rest }) => {
  const src = getFirstImage(data) || fallback;
  return <ImageWithFallback src={src} fallback={fallback} {...rest} />;
};

/** Person/seller/customer avatar. Accepts external URLs or storage keys. */
const Avatar = ({ data, url, src, fallback = PlaceholderAvatar, ...rest }) => {
  const resolved =
    (src && resolveImageUrl(src)) ||
    (url && resolveImageUrl(url)) ||
    getAvatarImage(data) ||
    fallback;
  return <ImageWithFallback src={resolved} fallback={fallback} {...rest} />;
};

/** Category image with per-category fallback. */
const CategoryImage = ({ data, fallback = PlaceholderShop, ...rest }) => {
  const src = getFirstImage(data) || fallback;
  return <ImageWithFallback src={src} fallback={fallback} {...rest} />;
};

export default ImageWithFallback;
export { ProductImage, ShopImage, Avatar, CategoryImage };