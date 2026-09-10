import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../services/api'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import Loader from '../../components/common/Loader'
import { loadSeller } from '../../store/redux/actions/user'

/**
 * Seller Application Center — "Start Selling on Aritii".
 *
 * A unified onboarding page for any logged-in Aritii account:
 *   - If not logged in -> prompt to sign in / create account.
 *   - If already an approved seller -> show Seller Center status + dashboard link.
 *   - Otherwise -> a guided, short application (About You / Business / Your Shop)
 *     that saves a DRAFT and lets the user SUBMIT for admin review.
 *
 * Submitting only sets PENDING_REVIEW. Full seller access requires backend
 * admin approval (which activates the SELLER role in Identity Service).
 */
const SellerApplicationPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user, loading } = useSelector((s) => s.user)
  const { isSeller, seller } = useSelector((s) => s.seller)

  const [application, setApplication] = useState(null)
  const [sellerType, setSellerType] = useState('INDIVIDUAL')
  const [businessName, setBusinessName] = useState('')
  const [businessCategory, setBusinessCategory] = useState('')
  const [description, setDescription] = useState('')
  const [businessPhone, setBusinessPhone] = useState('')
  const [city, setCity] = useState('')
  const [shopName, setShopName] = useState('')
  const [publicPhone, setPublicPhone] = useState('')
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchStatus = () => {
    api.get('/seller-application/me')
      .then((res) => {
        const app = res?.data?.application || null
        setApplication(app)
        if (app) {
          setStatus(app.status)
          setSellerType(app.sellerType || 'INDIVIDUAL')
          setBusinessName(app.businessInformation?.businessName || '')
          setBusinessCategory(app.businessInformation?.businessCategory || '')
          setDescription(app.businessInformation?.description || '')
          setBusinessPhone(app.businessInformation?.phone || '')
          setCity(app.location?.city || '')
          setShopName(app.shopInformation?.shopName || '')
          setPublicPhone(app.shopInformation?.publicPhone || '')
        }
      })
      .catch(() => { setApplication(null); setStatus(null) })
  }

  useEffect(() => {
    if (isAuthenticated) { dispatch(loadSeller()); fetchStatus() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const submit = (asSubmit) => {
    setSubmitting(true)
    const body = { submit: asSubmit, sellerType,
      businessInformation: { businessName, businessCategory, description, phone: businessPhone, email: undefined },
      location: { country: 'Ethiopia', city, address: city },
      shopInformation: { shopName, description, category: businessCategory, publicPhone } }
    api.post('/seller-application', body)
      .then((res) => {
        const app = res.data.application
        setApplication(app)
        setStatus(app.status)
        setSubmitting(false)
        toast.success(asSubmit ? 'Application submitted for review!' : 'Draft saved')
      })
      .catch((err) => {
        setSubmitting(false)
        toast.error(err?.response?.data?.message || 'Failed to save application')
      })
  }

  if (loading) return <Loader />

  // Not logged in -> prompt to create an Aritii account / sign in.
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <Header activeHeading={8} />
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-brand-charcoal">Sell on Aritii</h1>
          <p className="mt-3 text-brand-muted">Join Aritii to discover and buy. Then, in a few clicks, apply to sell your products.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/login" className="px-6 py-3 rounded-md bg-brand-primary text-white font-[600]">Sign in</Link>
            <Link to="/sign-up" className="px-6 py-3 rounded-md border border-brand-primary text-brand-primary font-[600]">Create an Aritii Account</Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Already an approved seller -> show seller center status + dashboard.
  if (isSeller && seller) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <Header activeHeading={1} />
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-[600]">Approved</span>
          <h1 className="mt-3 text-3xl font-bold text-brand-charcoal">You sell on Aritii, { seller.name || 'Seller' }</h1>
          <p className="mt-3 text-brand-muted">Your seller account is active. Manage your shop, products, and orders from the Seller Center.</p>
          <Link to="/dashboard" className="mt-8 inline-flex px-6 py-3 rounded-md bg-brand-primary text-white font-[600]">Open Seller Center</Link>
        </div>
        <Footer />
      </div>
    )
  }

  // Pending / rejected / draft -> show onboarding form + status.
  const isPending = status === 'PENDING_REVIEW'
  const isRejected = status === 'REJECTED'

  return (
    <div className="min-h-screen bg-brand-cream">
      <Header activeHeading={1} />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-brand-charcoal">Become a Seller on Aritii</h1>
        <p className="mt-2 text-brand-muted">One account. Buy as a customer and sell in your own shop.</p>

        {isPending && (
          <div className="mt-6 p-4 rounded-lg bg-[#FFF7E6] border border-[#F5A623]">
            <span className="text-sm font-[600] text-[#B26A00]">Status: Pending Review</span>
            <p className="text-sm mt-1 text-brand-muted">Your application has been submitted. An administrator will review it shortly.</p>
          </div>
        )}
        {isRejected && (
          <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <span className="text-sm font-[600] text-[#C0392B]">Status: Needs Changes</span>
            <p className="text-sm mt-1 text-brand-muted">{application?.review?.rejectionReason || 'Your application needs adjustments. Update and resubmit below.'}</p>
          </div>
        )}

        <div className="mt-8 space-y-6">
          {/* Step 1: Seller type */}
          <div>
            <label className="block text-sm font-[600] text-brand-charcoal mb-2">What describes you best?</label>
            <select value={sellerType} onChange={(e) => setSellerType(e.target.value)} className="w-full border border-brand rounded-md p-3">
              <option value="INDIVIDUAL">Individual Sellers</option>
              <option value="BUSINESS">Business</option>
              <option value="SHOP">Shop / Store</option>
              <option value="ORGANIZATION">Organization</option>
            </select>
          </div>

          {/* Step 2: Business info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <input placeholder="Business name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="border border-brand rounded-md p-3" />
            <input placeholder="Business category" value={businessCategory} onChange={(e) => setBusinessCategory(e.target.value)} className="border border-brand rounded-md p-3" />
          </div>
          <textarea placeholder="Describe your products / business" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-brand rounded-md p-3" rows={3} />
          <div className="grid sm:grid-cols-2 gap-4">
            <input placeholder="Business phone" value={businessPhone} onChange={(e) => setBusinessPhone(e.target.value)} className="border border-brand rounded-md p-3" />
            <input placeholder="City / location" value={city} onChange={(e) => setCity(e.target.value)} className="border border-brand rounded-md p-3" />
          </div>

          {/* Step 3: Shop */}
          <div className="grid sm:grid-cols-2 gap-4">
            <input placeholder="Shop name" value={shopName} onChange={(e) => setShopName(e.target.value)} className="border border-brand rounded-md p-3" />
            <input placeholder="Public phone" value={publicPhone} onChange={(e) => setPublicPhone(e.target.value)} className="border border-brand rounded-md p-3" />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button onClick={() => submit(false)} disabled={submitting} className="px-6 py-3 rounded-md border border-brand-primary text-brand-primary font-[600]">Save Draft</button>
            <button onClick={() => submit(true)} disabled={submitting} className="px-6 py-3 rounded-md bg-brand-primary text-white font-[600]">{isRejected ? 'Resubmit for Review' : 'Submit for Review'}</button>
          </div>
          <p className="text-xs text-brand-muted pt-2">Submitting for review does not grant selling access immediately. An administrator approves your shop before you can publish products.</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default SellerApplicationPage