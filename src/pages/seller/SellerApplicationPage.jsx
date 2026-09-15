import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import Loader from '../../components/common/Loader'
import { submitSellerApplication, loadSeller } from '../../store/redux/actions/user'

/**
 * Seller Application — "Become a Seller on Aritii".
 *
 * States per UX spec:
 * - Not logged in → prompt to sign in
 * - No application → Start Now / Maybe Later
 * - Pending → Under Review status
 * - Rejected → Not Approved + Apply Again
 * - Approved → redirect to dashboard
 */
const SellerApplicationPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user, loading } = useSelector((s) => s.user)
  const { isSeller, seller, isLoading: sellerLoading } = useSelector((s) => s.seller)

  const [showForm, setShowForm] = useState(false)
  const [sellerType, setSellerType] = useState('INDIVIDUAL')
  const [businessName, setBusinessName] = useState('')
  const [businessCategory, setBusinessCategory] = useState('')
  const [description, setDescription] = useState('')
  const [businessPhone, setBusinessPhone] = useState('')
  const [city, setCity] = useState('')
  const [shopName, setShopName] = useState('')
  const [publicPhone, setPublicPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const application = seller?.application
  const status = application?.status

  useEffect(() => {
    if (isAuthenticated && (user?.role === 'SELLER' || user?.shopId)) {
      dispatch(loadSeller())
    }
  }, [isAuthenticated, user?.role, user?.shopId, dispatch])

  // Approved sellers → redirect to dashboard
  if (isSeller && seller) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <Header activeHeading={1} />
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-brand-charcoal">You're an Approved Seller</h1>
          <p className="mt-3 text-brand-muted">Your business features are now available in your dashboard.</p>
          <Link to="/my-dashboard" className="mt-8 inline-flex px-6 py-3 rounded-md bg-brand-primary text-white font-[600]">Open Dashboard</Link>
        </div>
        <Footer />
      </div>
    )
  }

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <Header activeHeading={1} />
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-brand-charcoal">Sell on Aritii</h1>
          <p className="mt-3 text-brand-muted">Sign in to start your seller application.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/login" className="px-6 py-3 rounded-md bg-brand-primary text-white font-[600]">Sign in</Link>
            <Link to="/sign-up" className="px-6 py-3 rounded-md border border-brand-primary text-brand-primary font-[600]">Create Account</Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Pending review
  if (status === 'PENDING_REVIEW') {
    return (
      <div className="min-h-screen bg-brand-cream">
        <Header activeHeading={1} />
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⏳</span>
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-[600]">Under Review</span>
          <h1 className="mt-3 text-3xl font-bold text-brand-charcoal">Seller Application</h1>
          <p className="mt-3 text-brand-muted">Your application has been submitted and is waiting for administrator approval.</p>
          <button onClick={() => setShowForm(!showForm)} className="mt-6 px-5 py-2 border border-brand-primary text-brand-primary rounded-md font-[600] text-sm">
            {showForm ? 'Hide Details' : 'View Application'}
          </button>
          {showForm && (
            <div className="mt-6 text-left bg-white rounded-lg p-6 border border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Business:</span> <span className="font-semibold">{businessName || application?.businessInformation?.businessName || '—'}</span></div>
                <div><span className="text-gray-500">Category:</span> <span className="font-semibold">{businessCategory || application?.businessInformation?.businessCategory || '—'}</span></div>
                <div><span className="text-gray-500">Shop:</span> <span className="font-semibold">{shopName || application?.shopInformation?.shopName || '—'}</span></div>
                <div><span className="text-gray-500">Type:</span> <span className="font-semibold">{sellerType || application?.sellerType || '—'}</span></div>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    )
  }

  // Rejected
  if (status === 'REJECTED') {
    return (
      <div className="min-h-screen bg-brand-cream">
        <Header activeHeading={1} />
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✕</span>
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-[600]">Not Approved</span>
          <h1 className="mt-3 text-3xl font-bold text-brand-charcoal">Seller Application</h1>
          <p className="mt-3 text-brand-muted">{application?.review?.rejectionReason || 'Your application was not approved. You can update and apply again.'}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => setShowForm(true)} className="px-6 py-3 rounded-md border border-brand-primary text-brand-primary font-[600]">View Details</button>
            <button onClick={() => setShowForm(true)} className="px-6 py-3 rounded-md bg-brand-primary text-white font-[600]">Apply Again</button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Not applied or drafting — show intro or form
  if (!showForm) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <Header activeHeading={1} />
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🏪</span>
          </div>
          <h1 className="text-3xl font-bold text-brand-charcoal">Become a Seller on Aritii</h1>
          <p className="mt-3 text-brand-muted">Start your business on the platform. One account — buy and sell.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => setShowForm(true)} className="px-6 py-3 rounded-md bg-brand-primary text-white font-[600]">Start Now</button>
            <Link to="/my-dashboard" className="px-6 py-3 rounded-md border border-gray-300 text-gray-700 font-[600]">Maybe Later</Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Application form
  const submit = async (asSubmit) => {
    setSubmitting(true)
    try {
      const body = { submit: asSubmit, sellerType,
        businessInformation: { businessName, businessCategory, description, phone: businessPhone },
        location: { country: 'Ethiopia', city, address: city },
        shopInformation: { shopName, description, category: businessCategory, publicPhone } }
      const app = await dispatch(submitSellerApplication(body))
      toast.success(asSubmit ? 'Application submitted for review!' : 'Draft saved')
      if (asSubmit) setShowForm(false)
    } catch (err) {
      toast.error(err?.message || 'Failed to save')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <Header activeHeading={1} />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <button onClick={() => setShowForm(false)} className="text-sm text-brand-primary hover:underline mb-4">← Back</button>
        <h1 className="text-3xl font-bold text-brand-charcoal">Become a Seller on Aritii</h1>
        <p className="mt-2 text-brand-muted">Fill in your business details. You can save as draft and submit when ready.</p>

        <div className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-[600] text-brand-charcoal mb-2">What describes you best?</label>
            <select value={sellerType} onChange={(e) => setSellerType(e.target.value)} className="w-full border border-brand rounded-md p-3">
              <option value="INDIVIDUAL">Individual Seller</option>
              <option value="BUSINESS">Business</option>
              <option value="SHOP">Shop / Store</option>
              <option value="ORGANIZATION">Organization</option>
            </select>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <input placeholder="Business name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="border border-brand rounded-md p-3" />
            <input placeholder="Business category" value={businessCategory} onChange={(e) => setBusinessCategory(e.target.value)} className="border border-brand rounded-md p-3" />
          </div>
          <textarea placeholder="Describe your products / business" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-brand rounded-md p-3" rows={3} />
          <div className="grid sm:grid-cols-2 gap-4">
            <input placeholder="Business phone" value={businessPhone} onChange={(e) => setBusinessPhone(e.target.value)} className="border border-brand rounded-md p-3" />
            <input placeholder="City / location" value={city} onChange={(e) => setCity(e.target.value)} className="border border-brand rounded-md p-3" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <input placeholder="Shop name" value={shopName} onChange={(e) => setShopName(e.target.value)} className="border border-brand rounded-md p-3" />
            <input placeholder="Public phone" value={publicPhone} onChange={(e) => setPublicPhone(e.target.value)} className="border border-brand rounded-md p-3" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button onClick={() => submit(false)} disabled={submitting} className="px-6 py-3 rounded-md border border-brand-primary text-brand-primary font-[600] disabled:opacity-50">Save Draft</button>
            <button onClick={() => submit(true)} disabled={submitting} className="px-6 py-3 rounded-md bg-brand-primary text-white font-[600] disabled:opacity-50">{submitting ? 'Submitting...' : 'Submit for Review'}</button>
          </div>
          <p className="text-xs text-brand-muted pt-2">An administrator approves your shop before you can publish products.</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default SellerApplicationPage
