import React, { useEffect, useState } from "react";
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
  const [imgSrc, setImgSrc] = useState(() => blank(src || fallback));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setImgSrc(blank(src || fallback));
    setFailed(false);
  }, [src, fallback]);

  const handleError = () => {
    if (!failed) {
      if (fallback && String(imgSrc) !== String(fallback)) {
        setFailed(true);
        setImgSrc(blank(fallback));
      } else {
        // Even the fallback failed (or missing) -> never leave src empty.
        setFailed(true);
        setImgSrc(BLANK_1PX);
      }
    }
  };

  return (
    <img
      src={imgSrc}
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
const ProductImage = ({ data, fallback = PlaceholderProduct, ...rest }) => {
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