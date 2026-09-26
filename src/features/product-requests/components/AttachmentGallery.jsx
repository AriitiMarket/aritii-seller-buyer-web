import React, { useMemo, useState } from 'react';
import { resolveImageUrl } from '@/shared/utils/image';
import { FiZoomIn } from 'react-icons/fi';
import ImageLightbox from './ImageLightbox';

/**
 * Thumbnail grid for a request's own attachments (buyer's upload), shared by
 * the buyer and seller workspaces. Every thumb opens the full-size viewer.
 */
const AttachmentGallery = ({ urls = [], title = 'Attachments' }) => {
  const [index, setIndex] = useState(null);

  const images = useMemo(() => urls.filter(Boolean).map(resolveImageUrl).filter(Boolean), [urls]);

  if (!images.length) return null;

  return (
    <div>
      <p className="text-xs text-gray-500 mb-2">{title}</p>
      <div className="flex flex-wrap gap-3">
        {images.map((url, position) => (
          <button
            key={`${url}-${position}`}
            type="button"
            onClick={() => setIndex(position)}
            title="View full size"
            className="group relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 hover:border-brand-primary transition"
          >
            <img src={url} alt="Attachment" className="w-full h-full object-cover" loading="lazy" />
            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
              <FiZoomIn className="text-white opacity-0 group-hover:opacity-100" size={18} />
            </span>
          </button>
        ))}
      </div>

      {index !== null && (
        <ImageLightbox urls={images} initialIndex={index} onClose={() => setIndex(null)} />
      )}
    </div>
  );
};

export default AttachmentGallery;
