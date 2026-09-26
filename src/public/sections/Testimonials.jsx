import React from 'react';

/**
 * Testimonials - Customer reviews and testimonials
 * Social proof from happy customers
 */
const Testimonials = () => {
  const testimonials = [
    {
      name: 'Abebe Kebede',
      location: 'Addis Ababa',
      rating: 5,
      text: 'Aritii Market has made shopping so convenient. I can find everything I need from local sellers and get it delivered quickly. Highly recommended!',
    },
    {
      name: 'Tigist Haile',
      location: 'Hawassa',
      rating: 5,
      text: 'As a seller, Aritii Market has helped me reach customers across Ethiopia. The platform is easy to use and the support team is always helpful.',
    },
    {
      name: 'Dawit Alemu',
      location: 'Bahir Dar',
      rating: 5,
      text: 'Great selection of products at competitive prices. The delivery is reliable and the customer service is excellent. My go-to marketplace!',
    },
  ];

  return (
    <section className="py-10 md:py-14 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Join thousands of happy shoppers and sellers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-4">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#75d04b] flex items-center justify-center text-white font-semibold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Testimonials };
export default Testimonials;
