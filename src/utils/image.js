// Single source of truth for resolving image URLs coming from the API gateway
// or local static assets. Keeps every component consistent (no duplicated
// resolve logic across the codebase).

import { backend_url } from "../services/api";

/**
 * Normalized gateway roots derived from VITE_API_URL (e.g. "http://localhost:8000/api").
 * All joins happen against these trimmed roots, so the produced URL is correct
 * whether or not the configured base ends with a trailing slash.
 *   API_ROOT        -> "http://localhost:8000/api"
 *   GATEWAY_ORIGIN  -> "http://localhost:8000"
 */
const RAW_BASE = (backend_url || "").trim().replace(/\/+$/, "");
const API_ROOT = RAW_BASE || "http://localhost:8000/api";
const GATEWAY_ORIGIN = API_ROOT.replace(/\/api\/?$/, "") || API_ROOT;

/** Join a gateway-relative path ("uploads/x.png") onto the /api root. */
const apiJoin = (path) => `${API_ROOT}/${String(path).replace(/^\/+/, "")}`;

/**
 * Normalize a raw backend image value into a browser-loadable absolute URL.
 *
 * Handles every shape the backend may return:
 *  - { url: "..." } objects      -> unwrapped
 *  - https:// / http:// / data: / blob: -> returned as-is
 *  - /app/uploads/xxx.png        -> legacy commerce container path; the gateway
 *                                   serves it as /api/uploads/xxx.png
 *  - local filesystem paths like /home/.../commerce-service/uploads/xxx.png
 *                                -> extract the trailing uploads/<file>
 *  - /uploads/xxx.png            -> gateway uploads route
 *  - /api/uploads/xxx.png        -> already gateway-rooted
 *  - bare "xxx.png"              -> assume an uploaded file
 *
 * Every branch joins through apiJoin(), so the "/api" segment is never
 * glued to the path (the old "apiuploads/..." bug).
 */
export const resolveImageUrl = (image) => {
  if (!image) return null;

  let value = image;
  if (typeof image === "object") {
    value = image.url || image.src;
  }
  if (!value || typeof value !== "string") return null;
  value = value.trim();
  if (!value) return null;

  // Already absolute -> use as-is.
  if (/^(https?:|data:|blob:)/i.test(value)) {
    return value;
  }

  const bare = value.replace(/^\/+/, "");

  // Already gateway-rooted ("api/..." after slash-stripping).
  if (bare === "api" || bare.startsWith("api/")) {
    return `${GATEWAY_ORIGIN}/${bare}`;
  }

  // Legacy commerce container path "/app/uploads/<file>".
  if (bare.startsWith("app/uploads/")) {
    return apiJoin(`uploads/${bare.substring("app/uploads/".length)}`);
  }

  // Any path that embeds ".../uploads/<file>" (container or filesystem).
  const uploadsIdx = bare.indexOf("uploads/");
  if (uploadsIdx >= 0) {
    return apiJoin(`uploads/${bare.substring(uploadsIdx + "uploads/".length)}`);
  }

  // Bare filename -> assume an uploaded file.
  if (!value.startsWith("/")) {
    return apiJoin(`uploads/${bare}`);
  }

  // Any other root-relative backend path (e.g. "/some/asset.png").
  return apiJoin(bare);
};

/**
 * Collect every candidate image on a product/shop/user data object and return
 * the first that resolves.
 */
export const getImageCandidates = (data) => [
  ...(Array.isArray(data?.images) ? data.images : []),
  ...(Array.isArray(data?.image_Url) ? data.image_Url : []),
  data?.image_Url,
  data?.image,
  data?.thumbnail,
  data?.avatar,
  data?.logo,
  data?.shop_avatar,
];

export const getFirstImage = (data) => {
  if (!data) return null;
  return getImageCandidates(data)
    .map(resolveImageUrl)
    .find(Boolean);
};

export const getAvatarImage = (data) => {
  if (!data) return null;
  return [data?.avatar, data?.url, data?.shop_avatar, data?.image_Url]
    .map(resolveImageUrl)
    .find(Boolean);
};