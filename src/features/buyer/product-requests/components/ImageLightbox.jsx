import React, { useCallback, useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiExternalLink, FiX } from 'react-icons/fi';

/**
 * Full-size image viewer ("own image standard"): the original file is shown
 * in a dark overlay at its natural resolution, with prev/next, a counter and
 * a link to open the untouched original in a new tab.
 */
const ImageLightbox = ({ urls = [], initialIndex = 0, onClose }) => {
  const images = urls.filter(Boolean);
  const safeIndex = Math.min(Math.max(Number(initialIndex) || 0, 0), Math.max(images.length - 1, 0));
  const [index, setIndex] = useState(safeIndex);

  useEffect(() => {
    setIndex(safeIndex);
  }, [safeIndex]);

  const close = useCallback(() => onClose?.(), [onClose]);
  const previous = useCallback(
    () => setIndex((current) => (current - 1 + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(
    () => setIndex((current) => (current + 1) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (!images.length) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft' && images.length > 1) previous();
      if (event.key === 'ArrowRight' && images.length > 1) next();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [images.length, close, previous, next]);

  if (!images.length) return null;

  const current = images[index];

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/95 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={close}
    >
      <div className="flex items-center justify-between px-3 sm:px-5 py-3 text-white/90 border-b border-white/10">
        <span className="text-xs sm:text-sm font-medium tabular-nums">
          {index + 1} / {images.length}
        </span>
        <div className="flex items-center gap-1.5">
          <a
            href={current}
            target="_blank"
            rel="noreferrer"
            title="Open original image"
            onClick={(event) => event.stopPropagation()}
            className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-white/10 transition"
          >
            <FiExternalLink size={17} />
          </a>
          <button
            type="button"
            onClick={close}
            title="Close"
            className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-white/10 transition"
          >
            <FiX size={19} />
          </button>
        </div>
      </div>

      <div
        className="flex-1 min-h-0 flex items-center justify-center gap-2 sm:gap-4 px-2 sm:px-6"
        onClick={(event) => event.stopPropagation()}
      >
        {images.length > 1 && (
          <button
            type="button"
            onClick={previous}
            title="Previous image"
            className="h-11 w-11 flex-shrink-0 inline-flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <FiChevronLeft size={22} />
          </button>
        )}
        <img
          src={current}
          alt="Attachment preview"
          className="max-h-full max-w-full object-contain rounded-lg select-none"
          onClick={(event) => event.stopPropagation()}
        />
        {images.length > 1 && (
          <button
            type="button"
            onClick={next}
            title="Next image"
            className="h-11 w-11 flex-shrink-0 inline-flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <FiChevronRight size={22} />
          </button>
        )}
      </div>

      <p className="py-3 text-center text-xs text-white/50">
        Click anywhere to close · ← → to browse · Esc to exit
      </p>
    </div>
  );
};

export default ImageLightbox;
