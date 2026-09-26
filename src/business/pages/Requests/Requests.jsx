import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';
import requestService from '@/business/services/requestService';
import productService from '@/services/product.service';
import { userService } from '@/services/user.service';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import {
  ActivityTimeline,
  AttachmentGallery,
  CLOSED_STATUSES,
  DiscussionThread,
  OPEN_STATUSES,
  OfferCard,
  ParticipantCard,
  RequestStatusBadge,
  RequestSummary,
  RequestTabs,
  SELLER_TABS,
  WORKSPACE_TABS,
  agreementOf,
  countByTab,
  isAgreementConfirmed,
  offerTotal,
  quantityLabel,
  realtimeNotice,
  requestCode,
  requestMatchesSearch,
  specEntries,
  statusOf,
  unitOf,
  useRequestEvents,
} from '@/features/product-requests';
import { formatCurrency, formatDateTime, initials } from '@/shared/utils/format';
import {
  FiMessageSquare,
  FiCheckCircle,
  FiXCircle,
  FiTag,
  FiArrowLeft,
  FiSearch,
  FiUser,
  FiPackage,
  FiClock,
} from 'react-icons/fi';

/**
 * Seller — Product Requests (`/business/requests`).
 *
 * One sidebar entry ("Product Requests") with stage tabs and a master/detail
 * workspace: the list shows who asked for what (buyer avatar + name, product,
 * quantity, target price, date, status) and new requests are visually
 * unmistakable. Everything — buyer profile, review, response, offer,
 * accept/decline — happens INSIDE the request workspace; there is no separate
 * Messages/Conversations page.
 *
 * Agreement → order stays with the buyer (they create it from the agreed
 * terms); once converted the order lives in Orders.
 */
const BusinessRequestsPage = () => {
  const { activeShop, activeShopId, loading: shopsLoading } = useBusinessShops();
  const currentUser = useSelector((state) => state.user?.user);
  const currentUserId = currentUser?._id || currentUser?.id || null;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [detailTab, setDetailTab] = useState('overview');
  const [newMessageCount, setNewMessageCount] = useState(0);

  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const [offerForm, setOfferForm] = useState({
    quantity: '',
    unitPrice: '',
    note: '',
    productId: '',
  });
  const [savingOffer, setSavingOffer] = useState(false);
  const [shopProducts, setShopProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [attachProductId, setAttachProductId] = useState('');
  const [attaching, setAttaching] = useState(false);
  const [decliningId, setDecliningId] = useState(null);
  const [acceptingId, setAcceptingId] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [buyerProfile, setBuyerProfile] = useState(null);

  const load = useCallback(async ({ quiet = false } = {}) => {
    if (!activeShopId) return;
    if (!quiet) {
      setLoading(true);
      setError(null);
    }
    try {
      const result = await requestService.getForShop(activeShopId);
      setRequests(result.requests || []);
    } catch (err) {
      // Quiet refreshes fail silently: the visible list keeps its last-good
      // data instead of flashing an error on a background update.
      if (quiet) return;
      setError(err.response?.data?.message || err.message || 'Could not load requests');
      setRequests([]);
    } finally {
      if (!quiet) setLoading(false);
    }
  }, [activeShopId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!activeShopId) return;
    let cancelled = false;
    (async () => {
      setProductsLoading(true);
      try {
        const list = await productService.getByShop(activeShopId);
        if (!cancelled) setShopProducts(Array.isArray(list) ? list : []);
      } catch {
        if (!cancelled) setShopProducts([]);
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeShopId]);

  const selected = useMemo(
    () => requests.find((request) => request._id === selectedId) || null,
    [requests, selectedId]
  );
  const selectedStatus = statusOf(selected);

  const counts = useMemo(() => countByTab(SELLER_TABS, requests), [requests]);

  const visible = useMemo(() => {
    const tab = SELLER_TABS.find((item) => item.id === activeTab);
    return requests.filter((request) => {
      if (tab && tab.statuses && !tab.statuses.includes(statusOf(request))) return false;
      return requestMatchesSearch(request, query);
    });
  }, [requests, activeTab, query]);

  const loadMessages = useCallback(async (id) => {
    if (!id) return;
    try {
      setMessages(await requestService.getMessages(id));
    } catch {
      setMessages([]);
    }
  }, []);

  const loadBuyerProfile = useCallback(async (request) => {
    const buyerId = request?.buyer?.id || request?.customerId;
    if (!buyerId) {
      setBuyerProfile(null);
      return;
    }
    try {
      setBuyerProfile(await userService.getPublicProfile(buyerId));
    } catch {
      setBuyerProfile(null);
    }
  }, []);

  const openRequest = async (request, tab = 'overview') => {
    setSelectedId(request._id);
    setDetailTab(tab);
    setNewMessageCount(0);
    setReply('');
    setOfferForm({
      quantity: String(request.quantity || 1),
      unitPrice: request.targetPrice != null ? String(request.targetPrice) : '',
      note: '',
      productId: request.productId || '',
    });
    setAttachProductId(request.productId || '');
    await Promise.all([loadMessages(request._id), loadBuyerProfile(request)]);
  };

  /* ------------------------------------------------------------- realtime
   * One subscription for everything addressed to this seller. New requests
   * are inserted into the list immediately; any other change schedules a
   * quiet list refresh (the detail reads from that same list, so status and
   * offers stay in sync) and only the OPEN request refetches its thread.
   * The unread pill appears when the chat tab is not on screen. */
  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;
  const detailTabRef = useRef(detailTab);
  detailTabRef.current = detailTab;
  const refreshTimerRef = useRef(null);
  const myId = currentUserId;

  const scheduleRefresh = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(() => load({ quiet: true }), 250);
  }, [load]);

  useEffect(() => () => clearTimeout(refreshTimerRef.current), []);

  useRequestEvents((event) => {
    if (event.type === 'request.created') {
      const incoming = event.data?.request;
      if (incoming) {
        setRequests((current) =>
          current.some((item) => String(item._id) === String(incoming._id)) ? current : [incoming, ...current]
        );
      }
      if (event.actorId && myId && String(event.actorId) === String(myId)) return;
      toast.info('A new product request just arrived.');
      return;
    }

    if (event.type === 'request.message.created') {
      const openId = selectedIdRef.current;
      if (openId && String(event.requestId) === String(openId)) {
        loadMessages(openId);
        if (detailTabRef.current !== 'discussion') setNewMessageCount((count) => count + 1);
      }
      scheduleRefresh();
      return;
    }

    scheduleRefresh();
    if (event.actorId && myId && String(event.actorId) === String(myId)) return;
    const notice = realtimeNotice(event);
    if (notice) toast.info(notice);
  }, null);

  const handleReply = async ({ text, images = [], replyTo = null }) => {
    if (!selected) return false;
    const body = String(text || '').trim();
    if (!body && images.length === 0) return false;
    setSendingReply(true);
    try {
      await requestService.sendMessage(selected._id, {
        text: body,
        ...(images.length ? { images } : {}),
        ...(replyTo ? { replyTo } : {}),
      });
      await loadMessages(selected._id);
      await load();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Could not send the message');
      return false;
    } finally {
      setSendingReply(false);
    }
  };

  const handleMakeOffer = async (event) => {
    event.preventDefault();
    if (!selected) return;
    const quantity = Number(offerForm.quantity);
    const unitPrice = Number(offerForm.unitPrice);
    if (!Number.isInteger(quantity) || quantity < 1) {
      toast.error('Quantity must be a whole number of at least 1');
      return;
    }
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      toast.error('Unit price must be a number of at least 0');
      return;
    }
    const product = shopProducts.find((item) => String(item._id) === String(offerForm.productId));
    setSavingOffer(true);
    try {
      await requestService.makeOffer(selected._id, {
        quantity,
        unitPrice,
        productName: product?.name || selected.title || selected.subject || 'Product',
        productId: product ? String(product._id) : undefined,
        note: offerForm.note.trim(),
      });
      toast.success('Offer sent to the customer');
      setOfferForm((current) => ({ ...current, note: '' }));
      await Promise.all([loadMessages(selected._id), load()]);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Could not send the offer');
    } finally {
      setSavingOffer(false);
    }
  };

  const handleAttachProduct = async () => {
    if (!selected || !attachProductId) return;
    setAttaching(true);
    try {
      await requestService.attachOfferProduct(selected._id, { productId: attachProductId });
      toast.success('Product linked — the buyer can create the order');
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Could not link the product');
    } finally {
      setAttaching(false);
    }
  };

  /**
   * Seller confirms THEIR side of the agreement. Once both sides confirmed,
   * the buyer can create the order from the final terms.
   */
  const handleConfirmAgreement = async () => {
    if (!selected) return;
    setConfirmingId(selected._id);
    try {
      await requestService.confirmAgreement(selected._id);
      await load();
      const fresh = (await requestService.get?.(selected._id)) || null;
      if (fresh && isAgreementConfirmed(fresh)) {
        toast.success('Both sides confirmed — the agreement is final.');
      } else {
        toast.success('Your confirmation is recorded — waiting for the buyer.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Could not confirm the agreement');
    } finally {
      setConfirmingId(null);
    }
  };

  /** Accept an incoming request: PENDING → REVIEWING. */
  const handleAcceptRequest = async (request) => {
    setAcceptingId(request._id);
    try {
      await requestService.acceptRequest(request._id);
      toast.success('Request accepted — it moved to Reviewing');
      const wasOpen = selectedId === request._id;
      await load();
      if (wasOpen) openRequest({ ...request, status: 'REVIEWING' }, detailTab);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Could not accept the request');
    } finally {
      setAcceptingId(null);
    }
  };

  const handleDecline = async (request) => {
    if (!window.confirm('Decline this request? The customer is notified it was refused.')) return;
    setDecliningId(request._id);
    try {
      await requestService.declineRequest(request._id);
      toast.success('Request declined');
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Could not decline the request');
    } finally {
      setDecliningId(null);
    }
  };

  const buyerName =
    buyerProfile?.name || selected?.buyer?.name || selected?.buyer?.email || 'A customer';
  const buyerAvatar = buyerProfile?.avatar?.url || null;

  /* ------------------------------------------------------------- guards */

  if (shopsLoading && !activeShopId) {
    return <Loading variant="inline" label="Loading your shops…" />;
  }

  if (!activeShopId) {
    return (
      <EmptyState
        title="No shop to manage yet"
        description="Create or link a shop before answering product requests."
        action={
          <Link to="/business/shops">
            <Button className="bg-brand-primary text-white">Go to Shops</Button>
          </Link>
        }
      />
    );
  }

  /* --------------------------------------------------------------- list */

  const renderList = () => (
    <div className="space-y-3">
      {loading ? (
        <Loading variant="inline" label="Loading requests…" />
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : visible.length === 0 ? (
        <EmptyState
          title="Nothing here"
          description="No customer request is in this stage right now."
        />
      ) : (
        visible.map((request) => {
          const status = statusOf(request);
          const activeOffer = (request.offers || []).find((offer) => offer.status === 'ACTIVE');
          const isOpen = selectedId === request._id;
          const isNew = status === 'PENDING';
          return (
            <button
              key={request._id}
              type="button"
              onClick={() => openRequest(request)}
              className={`w-full text-left rounded-xl p-4 border transition ${
                isOpen
                  ? 'border-brand-primary bg-brand-primary-light/50'
                  : isNew
                  ? 'border-brand-primary bg-white ring-2 ring-brand-primary/30 hover:shadow-md'
                  : 'border-gray-100 bg-gray-50 hover:border-brand-primary'
              }`}
            >
              {isNew && (
                <span className="inline-flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-full bg-brand-primary text-white text-[11px] font-bold uppercase tracking-wide">
                  <FiPackage size={11} />
                  New Product Request
                </span>
              )}
              <div className="flex items-start gap-3">
                {/* Buyer avatar */}
                <span className="w-10 h-10 rounded-full flex-shrink-0 bg-brand-primary-light text-brand-primary-dark border border-brand-primary/30 font-semibold flex items-center justify-center text-sm">
                  {initials(request.buyer?.name || request.buyer?.email) || '?'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {request.title || request.subject}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                        <FiUser size={12} />
                        <span className="truncate">
                          {request.buyer?.name || request.buyer?.email || 'A customer'}
                        </span>
                      </p>
                    </div>
                    <RequestStatusBadge status={status} className="flex-shrink-0" />
                  </div>
                  <p className="text-xs text-gray-600 mt-2 flex flex-wrap gap-x-3 gap-y-1">
                    <span>Qty {request.quantity}</span>
                    {request.targetPrice != null && (
                      <span>Target {formatCurrency(request.targetPrice)}</span>
                    )}
                    {activeOffer && (
                      <span className="text-brand-primary-dark font-semibold">
                        Your offer {formatCurrency(offerTotal(activeOffer))}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-gray-400">
                      <FiClock size={11} />
                      {formatDateTime(request.updatedAt || request.createdAt)}
                    </span>
                  </p>
                </div>
              </div>
              {isNew && (
                <span className="mt-3 inline-flex items-center text-xs font-semibold text-brand-primary-dark">
                  Review →
                </span>
              )}
            </button>
          );
        })
      )}
    </div>
  );

  /* ------------------------------------------------------------- detail */

  const detailActions = () => {
    if (!selected) return null;
    const focus = (tab) => () => setDetailTab(tab);
    return (
      <div className="flex flex-wrap gap-2">
        {selectedStatus === 'PENDING' && (
          <>
            <button
              type="button"
              onClick={() => setDetailTab('overview')}
              className="h-[42px] px-4 inline-flex items-center justify-center gap-2 bg-white border border-brand-primary/50 rounded-full text-brand-primary-dark text-sm font-semibold hover:bg-brand-primary-light transition"
            >
              <FiPackage size={15} />
              Review
            </button>
            <Button
              onClick={() => handleAcceptRequest(selected)}
              disabled={acceptingId === selected._id}
              className="bg-brand-primary text-white"
            >
              {acceptingId === selected._id ? 'Accepting…' : 'Accept'}
            </Button>
          </>
        )}
        {OPEN_STATUSES.includes(selectedStatus) && (
          <>
            <button
              type="button"
              onClick={focus('discussion')}
              className="h-[42px] px-4 inline-flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-full text-gray-700 text-sm font-semibold hover:border-brand-primary transition"
            >
              <FiMessageSquare size={15} />
              Respond
            </button>
            <button
              type="button"
              onClick={focus('offers')}
              className="h-[42px] px-4 inline-flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-full text-gray-700 text-sm font-semibold hover:border-brand-primary transition"
            >
              <FiTag size={15} />
              Offers
            </button>
            <button
              type="button"
              onClick={() => handleDecline(selected)}
              disabled={decliningId === selected._id}
              className="h-[42px] px-4 inline-flex items-center justify-center gap-2 bg-white border border-red-300 rounded-full text-red-600 text-sm font-semibold hover:bg-red-50 disabled:opacity-50 transition"
            >
              <FiXCircle size={15} />
              {decliningId === selected._id ? 'Declining…' : 'Decline'}
            </button>
          </>
        )}
        {selectedStatus === 'CONVERTED' && selected.orderId && (
          <Link to={`/business/orders/${selected.orderId}`}>
            <Button className="bg-brand-primary text-white">View Order</Button>
          </Link>
        )}
      </div>
    );
  };

  const renderDetail = () => {
    if (!selected) {
      return (
        <EmptyState
          title="Select a request"
          description="Pick a request to read it, reply to the customer and send an offer."
        />
      );
    }
    const isOpen = OPEN_STATUSES.includes(selectedStatus);
    const isAgreed = selectedStatus === 'AGREED';
    const isConverted = selectedStatus === 'CONVERTED';
    const isClosed = CLOSED_STATUSES.includes(selectedStatus) || isConverted;
    const agreement = agreementOf(selected);
    const confirmed = isAgreementConfirmed(selected);
    const specs = specEntries(selected?.specs);
    const selectedUnit = unitOf(selected);
    const canConfirm = isOpen && !confirmed && !agreement.sellerConfirmedAt;

    return (
      <div className="space-y-4">
        {/* Workspace header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="lg:hidden p-1.5 -ml-1.5 rounded-lg hover:bg-gray-100"
                aria-label="Back to list"
              >
                <FiArrowLeft size={16} />
              </button>
              <h2 className="text-lg font-bold text-gray-900">
                Request {requestCode(selected._id)}
              </h2>
              <RequestStatusBadge status={selectedStatus} />
            </div>
            <p className="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="flex items-center gap-1">
                <FiClock size={12} />
                {formatDateTime(selected.createdAt)}
              </span>
              <span className="truncate">{selected.title || selected.subject}</span>
            </p>
          </div>
        </div>

        {selectedStatus === 'PENDING' && (
          <div className="rounded-xl border-2 border-brand-primary bg-brand-primary-light/60 p-3 sm:p-4">
            <p className="font-bold text-brand-primary-dark flex items-center gap-2">
              <FiPackage size={16} />
              New Product Request
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Review the request and respond — accepting tells the buyer you are on it.
            </p>
          </div>
        )}

        {detailActions()}

        {newMessageCount > 0 && detailTab !== 'discussion' && (
          <button
            type="button"
            onClick={() => {
              setDetailTab('discussion');
              setNewMessageCount(0);
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primary-hover transition"
          >
            <FiMessageSquare size={16} />
            {newMessageCount} new message{newMessageCount > 1 ? 's' : ''} — open chat
          </button>
        )}

        {/* Workspace tabs */}
        <RequestTabs
          tabs={WORKSPACE_TABS}
          active={detailTab}
          onChange={(tab) => {
            setDetailTab(tab);
            if (tab === 'discussion') setNewMessageCount(0);
          }}
          ariaLabel="Request workspace sections"
        />

        {detailTab === 'overview' && (
          <div className="space-y-4">
            <RequestSummary request={selected} buyerName={buyerName} sellerName={activeShop?.name} />
            <div className="grid gap-4 sm:grid-cols-2">
              <ParticipantCard
                role="Buyer"
                name={buyerName}
                avatarUrl={buyerAvatar}
                accent
                meta={[
                  { label: 'Email', value: buyerProfile?.email || selected?.buyer?.email },
                  { label: 'Member since', value: buyerProfile?.createdAt ? formatDateTime(buyerProfile.createdAt) : '' },
                ]}
              />
              <ParticipantCard
                role="Seller / Brand"
                name={activeShop?.name || 'Your shop'}
                avatarUrl={activeShop?.avatar?.url}
                meta={[
                  { label: 'Serving', value: 'This request was addressed to your shop' },
                ]}
              />
            </div>
            {isAgreed && !confirmed && (
              <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 space-y-2">
                <p className="text-sm text-yellow-800 font-medium flex items-start gap-2">
                  <FiClock size={16} className="mt-0.5 flex-shrink-0" />
                  The buyer accepted your offer — confirm the agreement on your side so the order
                  can be created.
                </p>
                <div>
                  <Button
                    onClick={handleConfirmAgreement}
                    disabled={confirmingId === selected._id}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {confirmingId === selected._id ? 'Confirming…' : 'Confirm Agreement'}
                  </Button>
                </div>
              </div>
            )}
            {isAgreed && confirmed && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 flex items-start gap-2">
                <FiCheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                Both sides confirmed — the buyer creates the order from these agreed terms. No cart
                required; payment and logistics follow from there.
              </div>
            )}
            {isConverted && (
              <div className="rounded-xl border border-brand-primary/40 bg-brand-primary-light/60 p-4 text-sm text-gray-700 flex items-start gap-2">
                <FiCheckCircle size={16} className="mt-0.5 flex-shrink-0 text-brand-primary-dark" />
                Converted into order{' '}
                {selected.orderId ? `#${String(selected.orderId).slice(-6).toUpperCase()}` : ''} —
                it now lives in Orders.
              </div>
            )}

            {/* Request details live in Overview — the brief is never a tab away. */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FiPackage size={16} className="text-brand-primary" />
                Request details
              </h3>
              <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-500">Requested product</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selected.productName || selected.title || selected.subject}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Quantity</p>
                  <p className="text-sm font-medium text-gray-900">
                    {quantityLabel(selected.quantity, selectedUnit)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Buyer target price</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selected.targetPrice != null
                      ? formatCurrency(selected.targetPrice)
                      : 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Request date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDateTime(selected.createdAt)}
                  </p>
                </div>
              </div>
              {specs.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">Structured requirements</p>
                  <ul className="flex flex-wrap gap-2">
                    {specs.map((entry) => (
                      <li
                        key={entry.key}
                        className="text-xs rounded-full bg-brand-primary-light text-brand-primary-dark px-2.5 py-1"
                      >
                        <span className="font-semibold">{entry.label}:</span> {entry.value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 mb-1">Requirements</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {selected.details || 'No extra requirements provided.'}
                </p>
              </div>
              {(selected.attachments || []).length > 0 && (
                <AttachmentGallery
                  urls={(selected.attachments || []).map((attachment) =>
                    typeof attachment === 'string' ? attachment : attachment?.url
                  )}
                />
              )}
            </div>
          </div>
        )}

        {detailTab === 'discussion' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FiMessageSquare size={16} className="text-brand-primary" />
                Discussion
              </h3>
              <span className="text-xs text-gray-400">Chat happens inside this request</span>
            </div>
            <DiscussionThread
              messages={messages}
              currentUserId={currentUserId}
              draft={reply}
              onDraftChange={setReply}
              onSend={handleReply}
              sending={sendingReply}
              canSend={isOpen}
              placeholder="Answer the customer…"
              closedHint={`This request is ${String(selectedStatus).toLowerCase()} and closed for new messages.`}
              peerName={buyerName}
              peerAvatar={buyerAvatar}
            />
          </div>
        )}

        {detailTab === 'offers' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FiTag size={16} className="text-brand-primary" />
                Offers
              </h3>
              {(selected.offers || []).length === 0 ? (
                <p className="text-sm text-gray-400">No offer sent yet.</p>
              ) : (
                <div className="space-y-2">
                  {[...(selected.offers || [])].reverse().map((offer, index) => (
                    <OfferCard
                      key={offer._id || index}
                      offer={offer}
                      highlighted={offer.status === 'ACCEPTED'}
                    />
                  ))}
                </div>
              )}
            </div>

            {isOpen && (
              <form onSubmit={handleMakeOffer} className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 space-y-3">
                <h3 className="font-semibold text-gray-900">Send an offer</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    required
                    type="number"
                    min="1"
                    placeholder="Quantity"
                    value={offerForm.quantity}
                    onChange={(event) => setOfferForm({ ...offerForm, quantity: event.target.value })}
                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Unit price (ETB)"
                    value={offerForm.unitPrice}
                    onChange={(event) => setOfferForm({ ...offerForm, unitPrice: event.target.value })}
                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
                {shopProducts.length > 0 ? (
                  <div>
                    <label className="text-xs text-gray-500">Catalogue product to link (optional)</label>
                    <select
                      value={offerForm.productId}
                      onChange={(event) => setOfferForm({ ...offerForm, productId: event.target.value })}
                      className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      <option value="">
                        {productsLoading ? 'Loading your products…' : 'None — order created from this agreement'}
                      </option>
                      {shopProducts.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    No catalogue product yet — send your offer anyway. The order is created from the
                    agreement (product, quantity, agreed price), not from the catalogue.
                  </p>
                )}
                <textarea
                  rows={2}
                  maxLength={1000}
                  placeholder="Note for the buyer (availability, lead time, condition…)"
                  value={offerForm.note}
                  onChange={(event) => setOfferForm({ ...offerForm, note: event.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
                <p className="text-xs text-gray-500">
                  A new offer supersedes the previous one. The buyer accepts it to reach an agreement.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button type="submit" disabled={savingOffer} className="bg-brand-primary text-white">
                    {savingOffer ? 'Sending…' : 'Send Offer'}
                  </Button>
                  <button
                    type="button"
                    onClick={() => handleDecline(selected)}
                    disabled={decliningId === selected._id}
                    className="h-[45px] min-w-[110px] px-5 inline-flex items-center justify-center gap-2 bg-white border border-red-300 rounded-full text-red-600 font-semibold text-sm hover:bg-red-50 disabled:opacity-50 transition"
                  >
                    <FiXCircle size={16} />
                    {decliningId === selected._id ? 'Declining…' : 'Decline'}
                  </button>
                </div>
              </form>
            )}

            {isAgreed && (
              <div className="bg-white rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-2">
                <p className="text-sm text-amber-800 font-medium">
                  Optional: link the catalogue product this agreement covers so the order shows it
                  too. Ordering works either way.
                </p>
                {shopProducts.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={attachProductId}
                      onChange={(event) => setAttachProductId(event.target.value)}
                      className="flex-1 min-w-[220px] border border-amber-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      <option value="">Select a product…</option>
                      {shopProducts.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <Button
                      onClick={handleAttachProduct}
                      disabled={attaching || !attachProductId}
                      className="bg-brand-primary text-white"
                    >
                      {attaching ? 'Linking…' : 'Link product'}
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs text-amber-700">
                    Your shop has no catalogue product yet — add one in Products if you want it linked.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {detailTab === 'agreement' && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FiCheckCircle size={16} className="text-brand-primary" />
                Final agreement
              </h3>
              {confirmed && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                  Confirmed
                </span>
              )}
            </div>

            {(() => {
              const liveOffer = [...(selected.offers || [])].reverse();
              const terms =
                agreement.terms ||
                liveOffer.find((offer) => offer.status === 'ACCEPTED') ||
                liveOffer.find((offer) => offer.status === 'ACTIVE');
              if (!terms) {
                return (
                  <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-center">
                    <FiClock className="w-7 h-7 text-yellow-500 mx-auto mb-2" />
                    <p className="font-semibold text-gray-900">No terms to confirm yet</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Send an offer from the Offers tab — both sides confirm the final terms here
                      before the buyer can create the order.
                    </p>
                  </div>
                );
              }
              return (
                <>
                  <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div>
                      <p className="text-xs text-gray-500">Product</p>
                      <p className="text-sm font-medium text-gray-900">
                        {terms.productName || selected.productName || selected.title}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Quantity</p>
                      <p className="text-sm font-medium text-gray-900">
                        {quantityLabel(terms.quantity, terms.unit || selectedUnit)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Unit price</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(terms.unitPrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="text-sm font-semibold text-brand-primary-dark">
                        {formatCurrency(offerTotal(terms))}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {String(selectedStatus).toLowerCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Last updated</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDateTime(selected.updatedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { side: 'Buyer', done: Boolean(agreement.buyerConfirmedAt), at: agreement.buyerConfirmedAt },
                      { side: 'You (Seller)', done: Boolean(agreement.sellerConfirmedAt), at: agreement.sellerConfirmedAt },
                    ].map((row) => (
                      <div
                        key={row.side}
                        className={`rounded-xl border p-3.5 flex items-center gap-3 ${
                          row.done ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
                        }`}
                      >
                        <FiCheckCircle
                          size={20}
                          className={row.done ? 'text-green-600' : 'text-gray-300'}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{row.side}</p>
                          <p className="text-xs text-gray-500">
                            {row.done ? `Confirmed ${formatDateTime(row.at)}` : 'Not confirmed yet'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {isOpen && !confirmed && (
                    <div className="flex flex-wrap items-center gap-3">
                      {canConfirm ? (
                        <Button
                          onClick={handleConfirmAgreement}
                          disabled={confirmingId === selected._id}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {confirmingId === selected._id ? 'Confirming…' : 'Confirm Agreement'}
                        </Button>
                      ) : (
                        <p className="text-xs text-gray-500">
                          {agreement.sellerConfirmedAt
                            ? 'You already confirmed — waiting for the buyer.'
                            : 'Waiting for the buyer to accept the live offer first.'}
                        </p>
                      )}
                    </div>
                  )}

                  {confirmed && (
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 flex items-start gap-2">
                      <FiCheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                      Both sides confirmed. The buyer creates the order from these final terms —
                      it then moves through payment and logistics.
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {detailTab === 'activity' && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Activity</h3>
            <ActivityTimeline request={selected} />
          </div>
        )}
      </div>
    );
  };

  /* -------------------------------------------------------------- render */

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Requests</h1>
            <p className="text-gray-500">
              Products customers asked {activeShop?.name ? activeShop.name : 'your shop'} for.
              Review, respond, send an offer — the buyer turns the agreement into an order.
            </p>
          </div>
        </div>

        <div className="mt-4 relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search requests or buyers…"
            aria-label="Search requests"
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        <div className="mt-4">
          <RequestTabs tabs={SELLER_TABS} counts={counts} active={activeTab} onChange={setActiveTab} />
        </div>
      </div>

      {/* Mobile: list ⇄ detail. Desktop: master/detail side by side. */}
      <div className="lg:grid lg:grid-cols-5 lg:gap-4 lg:items-start">
        <div className={`${selectedId ? 'hidden lg:block' : 'block'} lg:col-span-2`}>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            {renderList()}
          </div>
        </div>
        <div className={`${selectedId ? 'block' : 'hidden lg:block'} lg:col-span-3 mt-4 lg:mt-0`}>
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
            {renderDetail()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessRequestsPage;
