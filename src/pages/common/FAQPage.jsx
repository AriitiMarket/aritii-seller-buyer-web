import React, { useState } from 'react'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'

const FAQPage = () => {
  const [openFAQ, setOpenFAQ] = useState(0)

  const faqs = [
    { q: "How long does delivery take?", a: "Most orders are delivered within 24-48 hours across major cities." },
    { q: "Is my payment safe?", a: "Yes, all payments are protected by CBE escrow service until order delivery." },
    { q: "How do I become a seller?", a: "Visit /become-seller and complete our verification process." },
    { q: "What's the return policy?", a: "Most items can be returned within 7 days for a full refund." },
    { q: "How do I track my order?", a: "Use the order tracking feature in your account dashboard." },
    { q: "Is there customer support?", a: "Yes, 24/7 support available in Amharic, Oromo, and English." },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-12">Frequently Asked Questions</h1>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
              <button onClick={() => setOpenFAQ(openFAQ === idx ? -1 : idx)} className="w-full px-6 py-4 text-left font-semibold text-slate-900 hover:bg-slate-50 flex justify-between items-center">
                <span>{faq.q}</span>
                <span>{openFAQ === idx ? '−' : '+'}</span>
              </button>
              {openFAQ === idx && <div className="px-6 py-4 bg-slate-50 text-slate-700">{faq.a}</div>}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default FAQPage
