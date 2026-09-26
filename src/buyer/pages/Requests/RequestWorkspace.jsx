import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import requestService from '@/services/request.service';
import shopService from '@/services/shop.service';
import { addressService } from '@/services';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import {
  ActivityTimeline,
  AttachmentGallery,
  CANCELLABLE_STATUSES,
  CLOSED_STATUSES,
  DiscussionThread,
  OPEN_STATUSES,
  OfferCard,
  ParticipantCard,
  RequestStatusBadge,
  RequestSummary,
  RequestTabs,
  WORKSPACE_TABS,
  agreementOf,
  currentOfferOf,
  isAgreementConfirmed,
  offerTotal,
  quantityLabel,
  realtimeNotice,
  requestCode,
  specEntries,
  statusOf,
  unitOf,
  useRequestEvents,
} from '@/features/product-requests';
import { formatCurrency, formatDateTime } from '@/shared/utils/format';
import { buildDestination, isUsableAddress } from '@/shared/utils/destination';
import { getAvatarImage } from '@/shared/utils/image';
import { useSelector } from 'react-redux';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiMessageSquare,
  FiTag,
  FiMapPin,
  FiFileText,
} from 'react-icons/fi';

/**
 * Buyer — Request Workspace (`/my-dashboard/requests/:id`).
 *
 * Every request opens its own workspace; discussion, offer and activity are
 * TABS of the same request, never a separate Messages/Conversations page.
 * When both sides agree, the workspace creates the normal order directly
 * (no cart, no conversion module) and the order continues through
 * Payment → Logistics.
 */
export default function RequestWorkspacePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.user);

  const [request, setRequest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);

  const [confirming, setConfirming] = useState(false);
  const [counterOpen, setCounterOpen] = useState(false);
  const [counter, setCounter] = useState({ quantity: '', unit: '', unitPrice: '', note: '' });
  const [counterSaving, setCounterSaving] = useState(false);

  const [converting, setConverting] = useState(false);
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState('');

  const loadRequest = useCallback(async () => {
    setLoading(true);
    try {
      const [requestData, messagesData] = await Promise.all([
        requestService.get(id),
        requestService.getMessages(id),
      ]);
      setRequest(requestData);
      setMessages(messagesData || []);
      if (requestData?.shopId) {
        shopService
          .getPublicById(requestData.shopId)
          .then(setShop)
          .catch(() => setShop(null));
      } else {
        setShop(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load request');
      navigate('/my-dashboard/requests');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadRequest();
  }, [loadRequest]);

  /* --------------------------------------------------------------- realtime
   * One subscription scoped to THIS request only. Events are signals: the
   * affected slice is refetched over REST (draft, tab and selection are never
   * touched), the message pill appears only when the chat is not on screen,
   * and toasts are suppressed for events I caused myself. */
  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;
  const refreshTimerRef = useRef(null);
  const myId = user?.id || user?._id || null;

  const refreshQuiet = useCallback(async () => {
    try {
      const [requestData, messagesData] = await Promise.all([
        requestService.get(id),
        requestService.getMessages(id),
      ]);
      setRequest(requestData);
      setMessages(messagesData || []);
    } catch {
      /* silent: the next user action reloads whatever did not land */
    }
  }, [id]);

  const scheduleRefresh = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(refreshQuiet, 250);
  }, [refreshQuiet]);

  useEffect(() => () => clearTimeout(refreshTimerRef.current), []);

  useRequestEvents((event) => {
    if (event.type === 'request.message.created') {
      scheduleRefresh();
      if (activeTabRef.current !== 'discussion') setNewMessageCount((count) => count + 1);
      return;
    }
    scheduleRefresh();
    if (event.actorId && myId && String(event.actorId) === String(myId)) return;
    const notice = realtimeNotice(event);
    if (notice) toast.info(notice);
  }, id);

  const handleSendMessage = async ({ text, images = [], replyTo = null }) => {
    const body = String(text || '').trim();
    if (!body && images.length === 0) return false;
    setSending(true);
    try {
      await requestService.sendMessage(id, {
        text: body,
        ...(images.length ? { images } : {}),
        ...(replyTo ? { replyTo } : {}),
      });
      const [messagesData, requestData] = await Promise.all([
        requestService.getMessages(id),
        requestService.get(id),
      ]);
      setMessages(messagesData);
      setRequest(requestData);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send message');
      return false;
    } finally {
      setSending(false);
    }
  };

  const handleAcceptOffer = async () => {
    try {
      await requestService.acceptOffer(id);
      toast.success('Offer accepted — confirm the agreement to finalise the deal.');
      setActiveTab('agreement');
      loadRequest();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not accept offer');
    }
  };

  const handleConfirmAgreement = async () => {
    setConfirming(true);
    try {
      await requestService.confirmAgreement(id);
      const updated = await requestService.get(id);
      setRequest(updated);
      if (isAgreementConfirmed(updated)) {
        toast.success('Both sides confirmed — the agreement is final.');
      } else {
        toast.success('Your confirmation is recorded — waiting for the seller.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not confirm the agreement');
    } finally {
      setConfirming(false);
    }
  };

  const handleCounterOffer = async (event) => {
    event.preventDefault();
    const quantity = Number(counter.quantity);
    const unitPrice = Number(counter.unitPrice);
    if (!Number.isInteger(quantity) || quantity < 1) {
      toast.error('Enter a valid quantity');
      return;
    }
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      toast.error('Enter a valid unit price');
      return;
    }
    setCounterSaving(true);
    try {
      await requestService.makeOffer(id, {
        quantity,
        unitPrice,
        ...(counter.unit ? { unit: counter.unit } : {}),
        ...(counter.note ? { note: counter.note } : {}),
        ...(request?.productName ? { productName: request.productName } : {}),
      });
      toast.success('Counter-offer sent');
      setCounterOpen(false);
      setCounter({ quantity: '', unit: '', unitPrice: '', note: '' });
      loadRequest();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send the counter-offer');
    } finally {
      setCounterSaving(false);
    }
  };

  const handleDeclineOffer = async () => {
    try {
      await requestService.declineOffer(id);
      toast.success('Offer declined — you can keep negotiating.');
      loadRequest();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not decline offer');
    }
  };

  const openAddressPicker = async () => {
    setShowAddressPicker(true);
    setLoadingAddresses(true);
    try {
      const list = await addressService.getAll();
      setAddresses(list);
      const firstUsable = list.find(isUsableAddress) || list[0];
      setSelectedAddressId((current) =>
        current && list.some((address) => address._id === current)
          ? current
          : firstUsable?._id || ''
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load your saved addresses');
      setAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleConvertToOrder = async (destination) => {
    const target =
      (destination && destination.sectorId ? destination : null) || request?.destination;
    if (!target) {
      await openAddressPicker();
      return;
    }
    setConverting(true);
    try {
      await requestService.convertToOrder(id, { destination: target });
      toast.success('Order created from your agreement');
      setShowAddressPicker(false);
      const updated = await requestService.get(id);
      setRequest(updated);
      const orderId = updated?.orderId || updated?.order?._id;
      navigate(orderId ? `/user/order/${orderId}` : '/my-dashboard/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create the order');
    } finally {
      setConverting(false);
    }
  };

  const confirmConvert = () => {
    const address = addresses.find((item) => item._id === selectedAddressId);
    if (!address) {
      toast.error('Please choose a delivery address');
      return;
    }
    if (!isUsableAddress(address)) {
      toast.error(
        'That address has no delivery sector or contact phone. Please update it on your Addresses page.'
      );
      return;
    }
    handleConvertToOrder(buildDestination(address));
  };

  const handleCancelRequest = async () => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;
    try {
      await requestService.cancelRequest(id);
      toast.success('Request cancelled');
      navigate('/my-dashboard/requests');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel request');
    }
  };

  const status = statusOf(request);
  const activeOffer = useMemo(
    () => request?.offers?.find((offer) => offer.status === 'ACTIVE'),
    [request]
  );
  const acceptedOffer = useMemo(
    () => request?.offers?.find((offer) => offer.status === 'ACCEPTED'),
    [request]
  );
  const agreement = agreementOf(request);
  const confirmed = isAgreementConfirmed(request);
  const specs = specEntries(request?.specs);
  const requestUnit = unitOf(request, activeOffer);
  const isActive = OPEN_STATUSES.includes(status);
  const isAgreed = status === 'AGREED';
  const isConverted = status === 'CONVERTED';
  const isClosed = CLOSED_STATUSES.includes(status) || isConverted;
  const canCancel = CANCELLABLE_STATUSES.includes(status);
  const canConfirm =
    isActive &&
    !confirmed &&
    !agreement.buyerConfirmedAt &&
    Boolean(activeOffer || acceptedOffer);
  const counterTotal =
    Number.isFinite(Number(counter.quantity)) && Number.isFinite(Number(counter.unitPrice))
      ? Number(counter.quantity) * Number(counter.unitPrice)
      : null;

  const buyerName =
    request?.buyer?.name || user?.name || user?.email || 'You';
  const buyerEmail = request?.buyer?.email || user?.email || '';
  const sellerName = shop?.name || (request?.shopId ? 'Selected seller' : 'Open to all sellers');

  const attachmentUrls = (request?.attachments || [])
    .map((attachment) => (typeof attachment === 'string' ? attachment : attachment?.url))
    .filter(Boolean);

  if (loading) return <Loading variant="inline" label="Loading request…" />;
  if (!request) {
    return (
      <EmptyState
        title="Request not found"
        description="This request may have been removed."
        action={
          <Link to="/my-dashboard/requests">
            <Button className="bg-brand-primary text-white">Back to Product Requests</Button>
          </Link>
        }
      />
    );
  }

  const renderPrimaryActions = (className = '') => (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {activeOffer && isActive && (
        <>
          <Button onClick={handleAcceptOffer} className="bg-green-600 hover:bg-green-700 text-white">
            <FiCheckCircle className="w-4 h-4 mr-2" />
            Accept Offer
          </Button>
          <button
            type="button"
            onClick={handleDeclineOffer}
            className="h-[45px] min-w-[110px] px-5 inline-flex items-center justify-center gap-2 bg-white border border-red-300 rounded-full text-red-600 font-semibold text-sm hover:bg-red-50 transition"
          >
            <FiXCircle className="w-4 h-4" />
            Decline Offer
          </button>
        </>
      )}
      {isAgreed && !confirmed && (
        <Button
          onClick={() => setActiveTab('agreement')}
          className="bg-brand-primary text-white"
        >
          Review &amp; Confirm Agreement
        </Button>
      )}
      {isAgreed && confirmed && (
        <Button
          onClick={() => handleConvertToOrder()}
          disabled={converting}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {converting ? 'Creating Order…' : 'Create Order'}
        </Button>
      )}
      {isConverted && request.orderId && (
        <Link to={`/user/order/${request.orderId}`}>
          <Button className="bg-brand-primary text-white">View Order</Button>
        </Link>
      )}
      {canCancel && !isConverted && (
        <button
          type="button"
          onClick={handleCancelRequest}
          className="h-[45px] min-w-[110px] px-5 inline-flex items-center justify-center gap-2 bg-white border border-red-300 rounded-full text-red-600 font-semibold text-sm hover:bg-red-50 transition"
        >
          <FiXCircle className="w-4 h-4" />
          Cancel Request
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Link
              to="/my-dashboard/requests"
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Back to Product Requests"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-gray-900">
                  Request {requestCode(request._id)}
                </h1>
                <RequestStatusBadge status={status} />
              </div>
              <p className="text-xs text-gray-500 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex items-center gap-1">
                  <FiClock size={12} />
                  Created {formatDateTime(request.createdAt)}
                </span>
                <span className="truncate">{request.title || request.subject}</span>
              </p>
            </div>
          </div>
          <div className="sm:hidden">{renderPrimaryActions()}</div>
        </div>

        <div className="hidden sm:block mt-4 pt-4 border-t border-gray-100">
          {renderPrimaryActions()}
        </div>
      </header>

      {/* Realtime: unread-message shortcut (only while the chat is hidden) */}
      {newMessageCount > 0 && activeTab !== 'discussion' && (
        <button
          type="button"
          onClick={() => {
            setActiveTab('discussion');
            setNewMessageCount(0);
          }}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primary-hover transition"
        >
          <FiMessageSquare size={16} />
          {newMessageCount} new message{newMessageCount > 1 ? 's' : ''} — open chat
        </button>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <RequestTabs
          tabs={WORKSPACE_TABS}
          active={activeTab}
          onChange={(tab) => {
            setActiveTab(tab);
            if (tab === 'discussion') setNewMessageCount(0);
          }}
          ariaLabel="Request workspace sections"
        />
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <RequestSummary
            request={request}
            buyerName={buyerName}
            sellerName={sellerName}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <ParticipantCard
              role="Buyer"
              name={buyerName}
              avatarUrl={user?.avatar?.url}
              accent
              meta={[
                { label: 'Email', value: buyerEmail },
                { label: 'Quantity requested', value: String(request.quantity ?? '—') },
              ]}
            />
            <ParticipantCard
              role="Seller / Brand"
              name={sellerName}
              avatarUrl={shop?.avatar?.url}
              meta={[
                { label: 'Category', value: shop?.category || '—' },
                { label: 'Response', value: request.respondedAt ? formatDateTime(request.respondedAt) : 'Awaiting response' },
              ]}
              action={
                request.shopId ? (
                  <Link
                    to={`/my-dashboard/shops/${request.shopId}`}
                    className="text-sm font-semibold text-brand-primary-dark hover:underline"
                  >
                    View shop profile
                  </Link>
                ) : null
              }
            />
          </div>

          {isActive && !activeOffer && (
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-center">
              <FiClock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">Waiting for the seller</p>
              <p className="text-sm text-gray-600 mt-1">
                The seller has not made an offer yet. Keep the conversation going in the Discussion tab.
              </p>
            </div>
          )}
          {isAgreed && !confirmed && (
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-center">
              <FiClock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">Offer accepted — confirm the agreement</p>
              <p className="text-sm text-gray-600 mt-1">
                Both sides must confirm the final terms before the order can be created.
              </p>
              <div className="mt-3 flex justify-center">
                <Button
                  onClick={() => setActiveTab('agreement')}
                  className="bg-brand-primary text-white"
                >
                  Go to Agreement
                </Button>
              </div>
            </div>
          )}
          {isAgreed && confirmed && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
              <FiCheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">Agreement confirmed</p>
              <p className="text-sm text-gray-600 mt-1">
                Create the order to continue with payment and delivery. No cart needed.
              </p>
              <div className="mt-3 flex justify-center">
                <Button
                  onClick={() => handleConvertToOrder()}
                  disabled={converting}
                  className="bg-brand-primary text-white"
                >
                  {converting ? 'Creating Order…' : 'Create Order'}
                </Button>
              </div>
            </div>
          )}
          {isConverted && (
            <div className="rounded-xl border border-brand-primary/40 bg-brand-primary-light/50 p-4 text-center">
              <FiCheckCircle className="w-8 h-8 text-brand-primary mx-auto mb-2" />
              <p className="font-semibold text-gray-900">Order created</p>
              <p className="text-sm text-gray-600 mt-1">
                Order{' '}
                {request.orderId ? `#${String(request.orderId).slice(-6).toUpperCase()}` : ''} is
                now in Orders — payment and logistics follow from there.
              </p>
              <div className="mt-3 flex justify-center">
                <Link to={request.orderId ? `/user/order/${request.orderId}` : '/my-dashboard/orders'}>
                  <Button className="bg-brand-primary text-white">View Order</Button>
                </Link>
              </div>
            </div>
          )}
          {['DECLINED', 'CANCELLED', 'EXPIRED'].includes(status) && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
              <FiXCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="font-semibold text-gray-900 capitalize">Request {status.toLowerCase()}</p>
              <p className="text-sm text-gray-600 mt-1">
                This request is closed. Start a new one any time from Product Requests.
              </p>
            </div>
          )}

          {/* Request details live in Overview — the brief is never a tab away. */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <FiFileText size={16} className="text-brand-primary" />
              Request details
            </h2>
            <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">Requested product</p>
                <p className="text-sm font-medium text-gray-900">
                  {request.productName || request.title || request.subject}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Quantity</p>
                <p className="text-sm font-medium text-gray-900">
                  {quantityLabel(request.quantity, requestUnit)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Expected / target price</p>
                <p className="text-sm font-medium text-gray-900">
                  {request.targetPrice != null ? formatCurrency(request.targetPrice) : 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDateTime(request.createdAt)}
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
              <p className="text-xs text-gray-500 mb-1">Description & requirements</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {request.details || 'No description provided.'}
              </p>
            </div>

            {attachmentUrls.length > 0 && (
              <AttachmentGallery urls={attachmentUrls} />
            )}

            <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-500">
              <span>
                Request code: <span className="font-semibold text-gray-700">{requestCode(request._id)}</span>
              </span>
              <span>
                Status:{' '}
                <span className="font-semibold text-gray-700 capitalize">{status.toLowerCase()}</span>
              </span>
              <span>
                Last updated: <span className="font-semibold text-gray-700">{formatDateTime(request.updatedAt)}</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Discussion */}
      {activeTab === 'discussion' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <h2 className="font-semibold text-gray-900">Discussion</h2>
            <span className="text-xs text-gray-400">Chat happens inside this request</span>
          </div>
          <DiscussionThread
            messages={messages}
            currentUserId={request.customerId || user?.id || user?._id}
            draft={draft}
            onDraftChange={setDraft}
            onSend={handleSendMessage}
            sending={sending}
            canSend={!isClosed}
            placeholder="Write a message to the seller…"
            closedHint={`This request is ${String(status).toLowerCase()} and closed for new messages.`}
            peerName={sellerName}
            peerAvatar={shop?.avatar?.url || getAvatarImage(shop)}
          />
        </div>
      )}

      {/* Offers */}
      {activeTab === 'offers' && (
        <div className="space-y-4">
          {(activeOffer || acceptedOffer) && (
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 space-y-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <FiTag size={16} className="text-brand-primary" />
                {acceptedOffer && !activeOffer ? 'Agreed offer' : 'Current offer'}
              </h2>
              <OfferCard offer={activeOffer || acceptedOffer} highlighted />
              <div className="flex flex-wrap gap-2">
                {isActive && !confirmed && (
                  <>
                    <Button
                      onClick={handleAcceptOffer}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <FiCheckCircle className="w-4 h-4 mr-2" />
                      Accept Offer
                    </Button>
                    <button
                      type="button"
                      onClick={handleDeclineOffer}
                      className="h-[45px] min-w-[110px] px-5 inline-flex items-center justify-center gap-2 bg-white border border-red-300 rounded-full text-red-600 font-semibold text-sm hover:bg-red-50 transition"
                    >
                      <FiXCircle className="w-4 h-4" />
                      Decline Offer
                    </button>
                  </>
                )}
                {isActive && !confirmed && (
                  <button
                    type="button"
                    onClick={() => setCounterOpen((open) => !open)}
                    className="h-[45px] px-5 inline-flex items-center justify-center gap-2 bg-white border border-brand-primary/40 rounded-full text-brand-primary-dark font-semibold text-sm hover:bg-brand-primary-light transition"
                  >
                    <FiTag className="w-4 h-4" />
                    {counterOpen ? 'Close counter form' : 'Send counter-offer'}
                  </button>
                )}
              </div>
              {isAgreed && !confirmed && (
                <p className="text-xs text-gray-500">
                  The offer is accepted — confirm the agreement in the Agreement tab to finalise.
                </p>
              )}
            </div>
          )}

          {/* Buyer counter-offer — same structured fields as the seller's quote. */}
          {counterOpen && isActive && !confirmed && (
            <form
              onSubmit={handleCounterOffer}
              className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 space-y-4"
            >
              <div>
                <h3 className="font-semibold text-gray-900">Counter-offer</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Propose your own quantity, unit and price — the seller sees exactly what changed.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-4">
                <label className="block">
                  <span className="text-xs text-gray-500">Quantity</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={counter.quantity}
                    onChange={(e) => setCounter((c) => ({ ...c, quantity: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-500">Unit</span>
                  <input
                    type="text"
                    value={counter.unit}
                    placeholder={requestUnit}
                    onChange={(e) => setCounter((c) => ({ ...c, unit: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-500">Unit price</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={counter.unitPrice}
                    onChange={(e) => setCounter((c) => ({ ...c, unitPrice: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </label>
                <div>
                  <span className="text-xs text-gray-500">Total</span>
                  <p className="mt-1 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-900">
                    {counterTotal != null ? formatCurrency(counterTotal) : '—'}
                  </p>
                </div>
              </div>
              <label className="block">
                <span className="text-xs text-gray-500">Note (optional)</span>
                <textarea
                  rows={2}
                  value={counter.note}
                  onChange={(e) => setCounter((c) => ({ ...c, note: e.target.value }))}
                  placeholder="Explain your counter in one line…"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </label>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={counterSaving}
                  className="bg-brand-primary text-white"
                >
                  {counterSaving ? 'Sending…' : 'Send counter-offer'}
                </Button>
                <Button
                  type="button"
                  onClick={() => setCounterOpen(false)}
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 space-y-3">
            <h3 className="font-semibold text-gray-900">Offer history</h3>
            {(request.offers || []).length === 0 ? (
              <p className="text-sm text-gray-500">
                No offer yet. The seller will send pricing here once they review your request.
              </p>
            ) : (
              <div className="space-y-2">
                {[...(request.offers || [])]
                  .reverse()
                  .map((offer, index) => (
                    <OfferCard
                      key={offer._id || index}
                      offer={offer}
                      highlighted={offer === (activeOffer || acceptedOffer)}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Agreement — structured final terms + both-side confirmation */}
      {activeTab === 'agreement' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 space-y-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <FiFileText size={16} className="text-brand-primary" />
                Final agreement
              </h2>
              {confirmed && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                  Confirmed
                </span>
              )}
            </div>

            {(() => {
              const terms = agreement.terms || activeOffer || acceptedOffer;
              if (!terms) {
                return (
                  <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-center">
                    <FiClock className="w-7 h-7 text-yellow-500 mx-auto mb-2" />
                    <p className="font-semibold text-gray-900">No terms to confirm yet</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Once the seller sends an offer (or you counter), both sides confirm it here
                      before an order can be created.
                    </p>
                  </div>
                );
              }
              const total = offerTotal(terms) ?? terms.totalPrice;
              return (
                <>
                  <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div>
                      <p className="text-xs text-gray-500">Product</p>
                      <p className="text-sm font-medium text-gray-900">
                        {terms.productName || request.productName || request.title}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Quantity</p>
                      <p className="text-sm font-medium text-gray-900">
                        {quantityLabel(terms.quantity, terms.unit || requestUnit)}
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
                        {formatCurrency(total)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {String(status).toLowerCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Last updated</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDateTime(request.updatedAt)}
                      </p>
                    </div>
                  </div>

                  {agreement.note ? (
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      <span className="font-medium text-gray-800">Note: </span>
                      {agreement.note}
                    </p>
                  ) : null}

                  {/* Both confirmations, side by side */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { side: 'You (Buyer)', done: Boolean(agreement.buyerConfirmedAt), at: agreement.buyerConfirmedAt },
                      { side: 'Seller', done: Boolean(agreement.sellerConfirmedAt), at: agreement.sellerConfirmedAt },
                    ].map((row) => (
                      <div
                        key={row.side}
                        className={`rounded-xl border p-3.5 flex items-center gap-3 ${
                          row.done
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <FiCheckCircle
                          size={20}
                          className={row.done ? 'text-green-600' : 'text-gray-300'}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{row.side}</p>
                          <p className="text-xs text-gray-500">
                            {row.done
                              ? `Confirmed ${formatDateTime(row.at)}`
                              : 'Not confirmed yet'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {isActive && !confirmed && (
                    <div className="flex flex-wrap items-center gap-3">
                      {canConfirm ? (
                        <Button
                          onClick={handleConfirmAgreement}
                          disabled={confirming}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {confirming
                            ? 'Confirming…'
                            : agreement.buyerConfirmedAt
                            ? 'Already confirmed'
                            : 'Confirm Agreement'}
                        </Button>
                      ) : (
                        <p className="text-xs text-gray-500">
                          {agreement.buyerConfirmedAt
                            ? 'You already confirmed — waiting for the seller.'
                            : 'Waiting for the other side of the negotiation.'}
                        </p>
                      )}
                    </div>
                  )}

                  {confirmed && (
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
                      <FiCheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="font-semibold text-gray-900">Agreement confirmed</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Both sides signed off — create the order to continue with payment and
                        delivery.
                      </p>
                      <div className="mt-3 flex justify-center">
                        <Button
                          onClick={() => handleConvertToOrder()}
                          disabled={converting}
                          className="bg-brand-primary text-white"
                        >
                          {converting ? 'Creating Order…' : 'Create Order'}
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Activity */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Activity</h2>
          <ActivityTimeline request={request} />
        </div>
      )}

      {/* Converting the agreement needs a ship-to address — pick a saved one. */}
      <Modal
        open={showAddressPicker}
        title="Choose a delivery address"
        onClose={() => setShowAddressPicker(false)}
      >
        <p className="text-sm text-gray-600 mb-4">
          The order created from this agreement will be shipped to the address you choose.
        </p>

        {loadingAddresses ? (
          <p className="text-sm text-gray-500 py-6 text-center">Loading your addresses…</p>
        ) : addresses.length === 0 ? (
          <div className="text-center py-6">
            <FiMapPin className="w-10 h-10 mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-600 mb-4">
              You have no saved delivery addresses yet. An address with a delivery sector and
              contact phone is required to ship the order.
            </p>
            <Link
              to="/my-dashboard/addresses"
              className="inline-block px-5 py-2 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primary-hover transition"
            >
              Add a delivery address
            </Link>
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {addresses.map((address) => {
              const usable = isUsableAddress(address);
              return (
                <label
                  key={address._id}
                  className={`flex items-start gap-3 border rounded-lg p-3 cursor-pointer transition ${
                    selectedAddressId === address._id
                      ? 'border-brand-primary bg-brand-primary-light/50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${usable ? '' : 'opacity-60'}`}
                >
                  <input
                    type="radio"
                    name="convert-address"
                    className="mt-1"
                    checked={selectedAddressId === address._id}
                    disabled={!usable}
                    onChange={() => setSelectedAddressId(address._id)}
                  />
                  <span className="flex-1 text-sm">
                    <span className="block font-medium text-gray-900">
                      {[address.address1, address.address2].filter(Boolean).join(', ') || 'Address'}
                    </span>
                    <span className="block text-gray-500">
                      {[address.cityName || address.city, address.regionName || address.country]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                    <span className="block text-gray-500">{address.phone || 'No phone'}</span>
                    {!usable && (
                      <span className="block text-xs text-red-600 mt-1">
                        Missing delivery sector or phone — update it on the Addresses page.
                      </span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        )}

        <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
          <Button
            onClick={() => setShowAddressPicker(false)}
            className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmConvert}
            disabled={converting || loadingAddresses || !selectedAddressId}
            className="flex-1 bg-brand-primary text-white"
          >
            {converting ? 'Creating Order…' : 'Create Order'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
