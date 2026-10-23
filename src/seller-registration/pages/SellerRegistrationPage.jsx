import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import SellerRegistrationStepper from '@/seller-registration/components/SellerRegistrationStepper';
import SellerTypeForm from '@/seller-registration/forms/SellerTypeForm';
import BusinessInformationForm from '@/seller-registration/forms/BusinessInformationForm';
import LocationInformationForm from '@/seller-registration/forms/LocationInformationForm';
import ShopInformationForm from '@/seller-registration/forms/ShopInformationForm';
import SellerApplicationReviewForm from '@/seller-registration/forms/SellerApplicationReviewForm';
import useSellerRegistration from '@/seller-registration/hooks/useSellerRegistration';
import { validateSellerApplication } from '@/seller-registration/validation/sellerRegistrationSchema';
import { catalogService } from '@/services';
import { MdArrowBack, MdArrowForward, MdSave, MdSend, MdCheckCircle, MdStorefront, MdVerified, MdSecurity, MdSupportAgent } from 'react-icons/md';

const STEPS = [
  { id: 1, label: 'Seller Type', short: 'Type', icon: MdStorefront },
  { id: 2, label: 'Business Info', short: 'Business', icon: MdVerified },
  { id: 3, label: 'Location', short: 'Location', icon: MdSecurity },
  { id: 4, label: 'Shop Details', short: 'Shop', icon: MdSupportAgent },
  { id: 5, label: 'Review', short: 'Review', icon: MdCheckCircle },
];

const BENEFITS = [
  { icon: MdStorefront, title: 'Zero Setup Fee', desc: 'Start selling with no upfront costs' },
  { icon: MdVerified, title: 'Verified Sellers', desc: 'Build trust with verified badge' },
  { icon: MdSecurity, title: 'Secure Payments', desc: 'Protected transactions & payouts' },
  { icon: MdSupportAgent, title: 'Seller Support', desc: 'Dedicated team to help you grow' },
];

export default function SellerRegistrationPage() {
  const navigate = useNavigate();
  const { application, setApplication, loading, saving, error, save } = useSellerRegistration();
  const [step, setStep] = useState(1);
  const [touched, setTouched] = useState({});
  const [categories, setCategories] = useState([]);
  useEffect(() => { catalogService.getCategoriesByType('business').then(setCategories).catch(() => setCategories([])); }, []);

  useEffect(() => {
    if (['PENDING_REVIEW', 'APPROVED', 'SUSPENDED'].includes(application.status)) {
      navigate('/seller-registration/status', { replace: true });
    }
  }, [application.status, navigate]);
  if (loading) return <LoadingState />;
  if (['PENDING_REVIEW', 'APPROVED', 'SUSPENDED'].includes(application.status)) return null;

  const update = (key, value) => {
    setApplication((current) => ({ ...current, [key]: value }));
    setTouched((t) => ({ ...t, [key]: true }));
  };

  const validateCurrentStep = () => {
    const errors = validateSellerApplication(application);
    if (step === 1 && errors.sellerType) return toast.error(errors.sellerType);
    if (step === 2 && (errors.businessName || errors.businessCategory)) return toast.error(errors.businessName || errors.businessCategory);
    if (step === 3 && (errors.city || errors.address)) return toast.error(errors.city || errors.address);
    if (step === 4 && errors.shopName) return toast.error(errors.shopName);
    return true;
  };

  const next = () => {
    if (validateCurrentStep()) {
      setStep((current) => Math.min(5, current + 1));
    }
  };

  const prev = () => setStep((current) => Math.max(1, current - 1));

  const saveDraft = async () => {
    try {
      await save(application);
      toast.success('Draft saved');
    } catch (err) {
      toast.error(error || 'Unable to save draft');
    }
  };

  const submit = async () => {
    const errors = validateSellerApplication(application);
    if (Object.keys(errors).length) return toast.error(Object.values(errors)[0]);
    try {
      const business = application.businessInformation || {};
      const category = String(business.businessCategory || '').trim();
      const location = application.location || {};
      const city = String(location.city || location.cityName || '').trim();
      const normalized = {
        ...application,
        businessInformation: { ...business, businessCategory: category },
        location: { ...location, city, cityName: city, address: String(location.address || location.specificPlace || city).trim() },
        shopInformation: { ...(application.shopInformation || {}), category, description: application.shopInformation?.description || business.description || '' },
      };
      await save(normalized, true);
      navigate('/seller-registration/status', { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.errors?.join(', ') || err?.response?.data?.message || err?.message || 'Unable to submit application');
    }
  };

  const progress = ((step - 1) / 4) * 100;
  const currentStepConfig = STEPS[step - 1];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF6EC] to-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 h-1.5 bg-gray-100">
        <div
          className="h-full bg-gradient-to-r from-[#75d04b] to-[#5ac12f] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="pt-10 pb-16 px-4">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#75d04b] hover:text-[#5ac12f] mb-6"
            >
              <MdArrowBack className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#f3ffee] rounded-full text-sm font-semibold text-[#75d04b] mb-4">
              <MdCheckCircle className="w-4 h-4" />
              <span>Step {step} of 5</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {currentStepConfig.label}
            </h1>
            <p className="text-gray-500">Complete this section to continue your application</p>
          </div>

          {/* Progress Steps Visual */}
          <div className="hidden md:flex items-center justify-between mb-8 relative">
            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0" />
            {STEPS.map((s, i) => (
              <div key={s.id} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    i + 1 < step
                      ? 'bg-[#75d04b] text-white border-2 border-[#75d04b]'
                      : i + 1 === step
                      ? 'bg-white text-[#75d04b] border-2 border-[#75d04b] ring-4 ring-white'
                      : 'bg-white text-gray-300 border-2 border-gray-200'
                  }`}
                >
                  {i + 1 < step ? (
                    <MdCheckCircle className="w-5 h-5" />
                  ) : (
                    <s.icon className={`w-5 h-5 ${i + 1 === step ? 'text-[#75d04b]' : 'text-gray-300'}`} />
                  )}
                </div>
                <span className={`mt-1.5 text-xs font-semibold text-center w-20 ${i + 1 <= step ? 'text-gray-900' : 'text-gray-400'}`}>
                  {s.short}
                </span>
              </div>
            ))}
          </div>

          {/* Mobile Stepper */}
          <div className="md:hidden mb-8">
            <SellerRegistrationStepper currentStep={step} />
          </div>

          {/* Benefits Bar (only on first step) */}
          {step === 1 && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              {BENEFITS.map((b, i) => (
                <div key={i} className="p-4 bg-white rounded-xl border border-gray-100 hover:border-[#75d04b]/30 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-[#f3ffee] flex items-center justify-center text-[#75d04b] mb-3">
                    <b.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm">{b.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{b.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              <section className="min-h-[320px]">
                {step === 1 && (
                  <SellerTypeForm
                    value={application.sellerType}
                    onChange={(value) => update('sellerType', value)}
                    touched={touched.sellerType}
                  />
                )}
                {step === 2 && (
                  <BusinessInformationForm
                    value={application.businessInformation || {}}
                    onChange={(value) => update('businessInformation', value)}
                    categories={categories}
                    touched={touched}
                  />
                )}
                {step === 3 && (
                  <LocationInformationForm
                    value={application.location || {}}
                    onChange={(value) => update('location', value)}
                    touched={touched}
                  />
                )}
                {step === 4 && (
                  <ShopInformationForm
                    value={application.shopInformation || {}}
                    onChange={(value) => update('shopInformation', value)}
                    touched={touched}
                  />
                )}
                {step === 5 && (
                  <SellerApplicationReviewForm application={application} />
                )}
              </section>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-100 px-6 py-5 bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <button
                  type="button"
                  onClick={prev}
                  disabled={step === 1 || saving}
                  className="w-full sm:w-auto rounded-xl border border-gray-200 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                >
                  <MdArrowBack className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={saveDraft}
                    disabled={saving}
                    className="w-full sm:w-auto rounded-xl border border-[#75d04b] px-6 py-3 font-medium text-[#4ca72b] hover:bg-[#f3ffee] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    <MdSave className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Draft'}</span>
                  </button>
                  {step < 5 ? (
                    <button
                      type="button"
                      onClick={next}
                      disabled={saving}
                      className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-[#75d04b] to-[#5ac12f] px-6 py-3 font-medium text-white hover:from-[#5ac12f] hover:to-[#4ca72f] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#75d04b]/30"
                    >
                      <span>Next</span>
                      <MdArrowForward className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={submit}
                      disabled={saving}
                      className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-[#75d04b] to-[#5ac12f] px-6 py-3 font-medium text-white hover:from-[#5ac12f] hover:to-[#4ca72f] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#75d04b]/30"
                    >
                      <MdSend className="w-4 h-4" />
                      <span>{saving ? 'Submitting...' : 'Submit Application'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <p className="mt-6 text-center text-xs text-gray-400">
            By submitting, you agree to our{' '}
            <Link to="/terms" className="text-[#75d04b] hover:underline">Terms of Service</Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-[#75d04b] hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

function LoadingState() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FDF6EC] to-white flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-[#75d04b] to-[#5ac12f] rounded-2xl flex items-center justify-center animate-pulse">
          <MdStorefront className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Application</h2>
        <p className="text-gray-500">Preparing your seller registration...</p>
      </div>
    </main>
  );
}