import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { formatDate, formatCurrency, initials } from '@/shared/utils/format';
import { resolveImageUrl } from '@/shared/utils/image';
import { SPEC_LABELS, offerTotal } from '../constants';
import ImageLightbox from './ImageLightbox';
import { FiChevronDown, FiChevronUp, FiImage, FiMessageSquare, FiCornerUpLeft, FiSend, FiX, FiZoomIn } from 'react-icons/fi';

const MAX_MESSAGE_IMAGES = 5;
const MAX_IMAGE_BYTES = 1024 * 1024;
const GROUP_WINDOW_MS = 5 * 60 * 1000;
/** How many messages are shown before the user asks for older history. */
const HISTORY_PAGE = 30;
/** How close to the bottom the thread must be to keep auto-following. */
const STICK_THRESHOLD_PX = 80;

const CARD_HEADINGS = {
  requirement: 'Requirement',
  offer: 'Offer',
  counter: 'Counter-offer',
  agreement: 'Agreement',
  system: 'System',
};

const specLabelFor = (key) =>
  SPEC_LABELS.find((entry) => entry.key === key)?.label ||
  key.charAt(0).toUpperCase() + key.slice(1).replace(/[_-]+/g, ' ');

const toUrl = (image) => (typeof image === 'string' ? image : image?.url) || null;

const dayKeyOf = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'unknown';
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

const dayLabelOf = (value) => {
  const key = dayKeyOf(value);
  if (key === 'unknown') return '';
  if (key === dayKeyOf(new Date())) return 'Today';
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (key === dayKeyOf(yesterday)) return 'Yesterday';
  return formatDate(value);
};

const timeOf = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Commerce card body — the structured events the service writes into the
 * thread (`requirement`, `offer`, `counter`, `agreement`, `system`). Each type
 * renders its own payload so both sides read the same numbers in the same
 * place, whatever language the surrounding chat uses.
 */
const CardBody = ({ message }) => {
  const payload = message.payload || {};
  const type = message.type;

  if (type === 'requirement') {
    const specs = Object.entries(payload.specs || {}).filter(([, value]) =>
      String(value ?? '').trim()
    );
    return (
      <>
        <p className="font-semibold text-gray-900 mt-1">
          {payload.title || message.text || 'Requirement'}
        </p>
        <p className="text-sm text-gray-700 mt-1">
          {payload.quantity}
          {payload.unit ? ` ${payload.unit}` : ''}
          {payload.targetPrice != null ? ` · Target price: ${formatCurrency(payload.targetPrice)}` : ''}
        </p>
        {specs.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 mt-2">
            {specs.map(([key, value]) => (
              <li
                key={key}
                className="text-[11px] rounded-full bg-brand-primary-light text-brand-primary-dark px-2 py-0.5"
              >
                {specLabelFor(key)}: {String(value)}
              </li>
            ))}
          </ul>
        )}
        {payload.details ? (
          <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{payload.details}</p>
        ) : null}
      </>
    );
  }

  if (type === 'offer' || type === 'counter') {
    const offer = payload.offer || {};
    const side = offer.createdByRole === 'CUSTOMER' ? 'Buyer counter-offer' : 'Seller offer';
    return (
      <>
        <p className="text-[11px] font-semibold text-brand-primary-dark">{side}</p>
        <p className="font-semibold text-gray-900 mt-1">
          {offer.productName || message.text || 'Quote'}
        </p>
        <p className="text-sm text-gray-700 mt-1">
          {offer.quantity}
          {offer.unit ? ` ${offer.unit}` : ''} × {formatCurrency(offer.unitPrice)} ={' '}
          <span className="font-semibold text-brand-primary-dark">
            {formatCurrency(offerTotal(offer))}
          </span>
        </p>
        {offer.note ? <p className="text-sm text-gray-600 mt-1">{offer.note}</p> : null}
      </>
    );
  }

  if (type === 'agreement') {
    const terms = payload.terms || {};
    return (
      <>
        <p className="text-[11px] font-semibold text-green-700">
          Both sides confirmed — the terms are final.
        </p>
        <p className="text-sm text-gray-800 mt-1">
          {terms.quantity}
          {terms.unit ? ` ${terms.unit}` : ''} × {formatCurrency(terms.unitPrice)} ={' '}
          <span className="font-semibold">{formatCurrency(terms.totalPrice)}</span>
        </p>
        {payload.confirmedAt ? (
          <p className="text-[11px] text-gray-500 mt-1">
            Confirmed {formatDate(payload.confirmedAt)}
          </p>
        ) : null}
      </>
    );
  }

  return <p className="text-sm text-gray-700 whitespace-pre-wrap">{message.text}</p>;
};

/**
 * Messenger-style chat for the request workspace — bubbles, day dividers,
 * grouped messages, avatars, inline photo attachments and a composer with
 * image attach. Used by BOTH sides (buyer `RequestWorkspace` and seller
 * `business/pages/Requests`), so the discussion always looks the same.
 *
 * Contract: `onSend({ text, images })` resolves to `true` on success; return
 * `false` to keep the draft (the composer clears itself otherwise).
 *
 * History: only the newest `HISTORY_PAGE` messages render at first; a "load
 * earlier messages" control walks backwards through the thread without losing
 * the reader's scroll position, and auto-follow is suspended while they are
 * reading older messages.
 */
const DiscussionThread = ({
  messages = [],
  currentUserId,
  draft = '',
  onDraftChange,
  onSend,
  sending = false,
  canSend = true,
  placeholder = 'Write a message…',
  closedHint = 'This request is closed for new messages.',
  peerName = '',
  peerAvatar = null,
}) => {
  const listRef = useRef(null);
  const fileRef = useRef(null);
  const [pending, setPending] = useState([]);
  const [viewer, setViewer] = useState(null);
  const [visibleCount, setVisibleCount] = useState(HISTORY_PAGE);
  const stickRef = useRef(true);
  const anchorRef = useRef(null);
  // Mirrors `stickRef` in state so the "jump to latest" control can render.
  const [following, setFollowing] = useState(true);
  // The message currently being replied to (id + a short quote for the UI);
  // the server rebuilds a trusted snapshot from the id on send.
  const [replyTo, setReplyTo] = useState(null);

  // Conversation identity: every refresh returns a fresh array, but only
  // switching to ANOTHER request may reset the history window.
  const threadKey = messages[0]?.conversationId || messages[0]?._id || '';

  useEffect(() => {
    setVisibleCount(HISTORY_PAGE);
    stickRef.current = true;
    setFollowing(true);
    const element = listRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [threadKey]);

  // Follow the tail only while the reader is already at the bottom (or the
  // thread just opened) — never yank them away from older history.
  useEffect(() => {
    const element = listRef.current;
    if (element && stickRef.current) element.scrollTop = element.scrollHeight;
  }, [messages.length]);

  // After revealing older messages, keep the previously visible message
  // anchored in place instead of jumping back to the bottom.
  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const element = listRef.current;
    if (!anchor || !element) return;
    anchorRef.current = null;
    element.scrollTop = element.scrollHeight - anchor.scrollHeight + anchor.scrollTop;
  }, [visibleCount]);

  const handleScroll = () => {
    const element = listRef.current;
    if (!element) return;
    const next =
      element.scrollHeight - element.scrollTop - element.clientHeight <= STICK_THRESHOLD_PX;
    stickRef.current = next;
    setFollowing((previousFollowing) =>
      previousFollowing === next ? previousFollowing : next
    );
  };

  const loadEarlier = () => {
    const element = listRef.current;
    if (element) {
      anchorRef.current = { scrollHeight: element.scrollHeight, scrollTop: element.scrollTop };
    }
    setVisibleCount((count) => Math.min(count + HISTORY_PAGE, messages.length));
  };

  const jumpToLatest = () => {
    const element = listRef.current;
    if (element) element.scrollTop = element.scrollHeight;
    stickRef.current = true;
    setFollowing(true);
  };

  const pickImages = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length) return;

    const room = MAX_MESSAGE_IMAGES - pending.length;
    if (room <= 0) {
      toast.error(`Up to ${MAX_MESSAGE_IMAGES} images per message`);
      return;
    }

    files.slice(0, room).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error('Only image attachments are supported.');
        return;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        toast.error('Images must be smaller than 1 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () =>
        setPending((current) =>
          current.length >= MAX_MESSAGE_IMAGES
            ? current
            : [...current, { name: file.name, url: String(reader.result) }]
        );
      reader.onerror = () => toast.error('Could not read that file.');
      reader.readAsDataURL(file);
    });
  };

  const submit = async (event) => {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (sending || !canSend || !onSend) return;
    const text = String(draft || '').trim();
    if (!text && pending.length === 0) return;

    const images = pending.map((item) => ({ url: item.url }));
    const result = await onSend({ text, images, replyTo: replyTo?.id || null });
    if (result === false) return;
    setPending([]);
    setReplyTo(null);
    onDraftChange?.('');
  };

  const peerInitials = initials(peerName) || '?';
  const hasMessages = messages.length > 0;
  const visibleCountClamped = Math.min(visibleCount, messages.length);
  const offset = messages.length - visibleCountClamped;
  const visibleMessages = hasMessages ? messages.slice(offset) : [];
  const hiddenCount = offset;

  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 overflow-hidden bg-white">
      {/* chat header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
        <span className="h-9 w-9 rounded-full overflow-hidden flex-shrink-0 bg-brand-primary-light text-brand-primary-dark border border-brand-primary/30 flex items-center justify-center text-sm font-semibold">
          {resolveImageUrl(peerAvatar) ? (
            <img
              src={resolveImageUrl(peerAvatar)}
              alt={peerName}
              className="w-full h-full object-cover"
            />
          ) : (
            peerInitials
          )}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{peerName || 'Request chat'}</p>
          <p className="text-[11px] text-gray-400">Messages stay inside this request</p>
        </div>
        <span className="ml-auto text-xs text-gray-400 flex-shrink-0">
          {messages.length} message{messages.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* thread */}
      <div className="relative">
        <div
          ref={listRef}
          onScroll={handleScroll}
          className="overflow-y-auto px-3 sm:px-4 py-4 bg-gray-50 h-[340px] sm:h-[400px]"
        >
        {!hasMessages ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
            <FiMessageSquare className="w-10 h-10 mb-2 opacity-50" />
            <p className="text-sm">No messages yet — start the discussion.</p>
          </div>
        ) : (
          <>
            {hiddenCount > 0 && (
              <div className="flex justify-center mb-1">
                <button
                  type="button"
                  onClick={loadEarlier}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:border-brand-primary hover:text-brand-primary transition"
                >
                  <FiChevronUp size={14} />
                  Load earlier messages ({hiddenCount})
                </button>
              </div>
            )}
            {visibleMessages.map((message, relativeIndex) => {
            const index = offset + relativeIndex;
            const previous = index > 0 ? messages[index - 1] : null;
            const mine = String(message.sender) === String(currentUserId);
            const senderKey = String(message.sender || '');
            const createdAt = message.createdAt || new Date();
            const dayKey = dayKeyOf(createdAt);
            const newDay = !previous || dayKeyOf(previous.createdAt) !== dayKey;
            const startsGroup =
              !previous ||
              String(previous.sender || '') !== senderKey ||
              new Date(createdAt) - new Date(previous.createdAt || createdAt) > GROUP_WINDOW_MS;
            const imageUrls = (message.images || [])
              .map(toUrl)
              .map(resolveImageUrl)
              .filter(Boolean);
            const showPeerName = startsGroup && !mine;
            const bubbleImages =
              imageUrls.length === 1 ? 'w-44 h-44 sm:w-56 sm:h-56' : 'w-32 h-32 sm:w-36 sm:h-36';

            const isCard = Boolean(message.type && message.type !== 'text');

            return (
              <div key={message._id || `${senderKey}-${index}`}>
                {newDay && (
                  <div className="flex items-center gap-3 my-4">
                    <span className="h-px flex-1 bg-gray-200" />
                    <span className="text-[11px] font-medium text-gray-400">
                      {dayLabelOf(createdAt)}
                    </span>
                    <span className="h-px flex-1 bg-gray-200" />
                  </div>
                )}

                {isCard ? (
                  <div className="mt-3 flex justify-center">
                    <div className="w-full max-w-lg rounded-xl border border-dashed border-brand-primary/40 bg-white px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">
                          {CARD_HEADINGS[message.type] || message.type}
                        </span>
                        {message.senderName ? (
                          <span className="text-[10px] text-gray-400 truncate">
                            · {message.senderName}
                          </span>
                        ) : null}
                        <span className="ml-auto text-[10px] text-gray-400 flex-shrink-0">
                          {timeOf(createdAt)}
                        </span>
                      </div>
                      <CardBody message={message} />
                    </div>
                  </div>
                ) : (
                <div className={`flex gap-2 ${mine ? 'flex-row-reverse' : ''} ${startsGroup ? 'mt-3' : 'mt-0.5'}`}>
                  {!mine ? (
                    startsGroup ? (
                      <span className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 self-end bg-brand-primary-light text-brand-primary-dark border border-brand-primary/30 flex items-center justify-center text-xs font-semibold">
                        {resolveImageUrl(peerAvatar) ? (
                          <img
                            src={resolveImageUrl(peerAvatar)}
                            alt={peerName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          peerInitials
                        )}
                      </span>
                    ) : (
                      <span className="w-8 flex-shrink-0" />
                    )
                  ) : null}

                  <div className={`max-w-[80%] sm:max-w-[70%] group ${mine ? 'items-end' : ''}`}>
                    {showPeerName && (
                      <p className="text-[11px] font-semibold text-brand-primary-dark mb-1 px-1">
                        {message.senderName || peerName || 'Customer'}
                      </p>
                    )}

                    <div
                      className={`inline-block w-full px-3 py-2 rounded-2xl text-sm shadow-sm ${
                        mine
                          ? 'bg-brand-primary text-white rounded-br-sm'
                          : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
                      }`}
                    >
                      {message.replyTo ? (
                        <div
                          className={`mb-1.5 rounded-lg border-l-2 border-brand-primary px-2 py-1 ${
                            mine ? 'bg-white/15' : 'bg-gray-100'
                          }`}
                        >
                          <p
                            className={`text-[11px] font-semibold truncate ${
                              mine ? 'text-white' : 'text-brand-primary-dark'
                            }`}
                          >
                            {String(message.replyTo.sender) === String(currentUserId)
                              ? 'You'
                              : message.replyTo.senderName || peerName || 'Them'}
                          </p>
                          <p
                            className={`text-[11px] truncate ${
                              mine ? 'text-white/80' : 'text-gray-500'
                            }`}
                          >
                            {message.replyTo.text ||
                              (message.replyTo.type === 'text'
                                ? 'Attachment'
                                : CARD_HEADINGS[message.replyTo.type] || 'Message')}
                          </p>
                        </div>
                      ) : null}

                      {message.text ? (
                        <p className="break-words whitespace-pre-wrap">{message.text}</p>
                      ) : null}

                      {imageUrls.length > 0 && (
                        <div
                          className={`grid gap-1.5 mt-2 ${
                            imageUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                          }`}
                        >
                          {imageUrls.map((url, imageIndex) => (
                            <button
                              key={`${url}-${imageIndex}`}
                              type="button"
                              onClick={() => setViewer({ urls: imageUrls, index: imageIndex })}
                              title="View full size"
                              className={`group/img relative overflow-hidden rounded-xl border ${
                                mine ? 'border-white/40' : 'border-gray-200'
                              } ${bubbleImages}`}
                            >
                              <img
                                src={url}
                                alt={message.label || 'Attachment'}
                                loading="lazy"
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                                <FiZoomIn
                                  size={18}
                                  className="text-white opacity-0 group-hover/img:opacity-100"
                                />
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {message.label ? (
                        <p
                          className={`text-[11px] font-medium mt-2 italic ${
                            mine ? 'text-white/85' : 'text-gray-500'
                          }`}
                        >
                          {message.label}
                        </p>
                      ) : null}
                    </div>

                    <div
                      className={`flex items-center gap-2 mt-1 px-1 ${
                        mine ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <button
                        type="button"
                        title="Reply"
                        onClick={() =>
                          setReplyTo({
                            id: message._id,
                            text: message.text || '',
                            sender: message.sender,
                            name: message.senderName || peerName,
                          })
                        }
                        className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-gray-400 hover:text-brand-primary transition"
                      >
                        <FiCornerUpLeft size={13} />
                      </button>
                      <p className="text-[10px] text-gray-400">{timeOf(createdAt)}</p>
                    </div>
                  </div>
                </div>
                )}
              </div>
            );
          })}
          </>
        )}
        </div>

        {/* jump back to the tail while reading history */}
        {hasMessages && !following && (
          <button
            type="button"
            onClick={jumpToLatest}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-primary text-white text-xs font-semibold shadow-md hover:bg-brand-primary-hover transition"
          >
            <FiChevronDown size={14} />
            Latest messages
          </button>
        )}
      </div>

      {/* composer */}
      {canSend ? (
        <div className="border-t border-gray-200 bg-white p-2.5">
          {replyTo && (
            <div className="flex items-center gap-2 mb-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
              <FiCornerUpLeft size={14} className="flex-shrink-0 text-brand-primary" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-brand-primary-dark truncate">
                  Replying to {replyTo.name || peerName || 'them'}
                </p>
                <p className="text-[11px] text-gray-500 truncate">
                  {replyTo.text || 'Attachment'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                title="Cancel reply"
                className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition"
              >
                <FiX size={13} />
              </button>
            </div>
          )}
          {pending.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-2.5">
              {pending.map((item, itemIndex) => (
                <div key={`${item.url}-${itemIndex}`} className="relative">
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setPending((current) => current.filter((_, i) => i !== itemIndex))
                    }
                    title="Remove image"
                    className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-black"
                  >
                    <FiX size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={submit} className="flex items-end gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={pickImages}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={sending || pending.length >= MAX_MESSAGE_IMAGES}
              title="Attach image"
              className="h-10 w-10 flex-shrink-0 inline-flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-brand-primary hover:text-brand-primary transition disabled:opacity-40"
            >
              <FiImage size={18} />
            </button>

            <textarea
              rows={1}
              value={draft}
              onChange={(event) => onDraftChange?.(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) submit(event);
              }}
              placeholder={placeholder}
              disabled={sending}
              className="flex-1 min-w-0 resize-none rounded-2xl border border-gray-200 px-3.5 py-2.5 text-sm leading-5 max-h-28 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            />

            <button
              type="submit"
              disabled={sending || (!String(draft || '').trim() && pending.length === 0)}
              title="Send message"
              className="h-10 w-10 flex-shrink-0 inline-flex items-center justify-center rounded-full bg-brand-primary text-white hover:bg-brand-primary-hover transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FiSend size={17} />
            </button>
          </form>
        </div>
      ) : (
        <p className="text-xs text-gray-500 px-4 py-3 border-t border-gray-200 bg-white text-center">
          {closedHint}
        </p>
      )}

      {viewer && (
        <ImageLightbox
          urls={viewer.urls}
          initialIndex={viewer.index}
          onClose={() => setViewer(null)}
        />
      )}
    </div>
  );
};

export default DiscussionThread;
