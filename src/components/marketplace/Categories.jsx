import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { brandingData } from '../../data/data';
import { CATEGORY_IMAGES, PlaceholderCategory } from '../../assets';

/**
 * Categories Component - Modern marketplace category browser
 * Features:
 * - Modern green accent styling (#0A4230)
 * - Responsive grid (2 cols mobile → 6 cols desktop)
 * - Hover animations and transitions
 * - Branding section with icons and descriptions
 * - Fallback images on error
 */
const Categories = () => {
  const navigate = useNavigate();
  const { categories, isLoading, error } = useSelector((state) => state.shop);

  const iconFor = (category) => {
    const title = (category?.title || "").trim();
    const localIcon = CATEGORY_IMAGES[title] || PlaceholderCategory;
    return category?.image || localIcon;
  };

  return (
    <div className="w-full">
      {/* Branding Section - Hidden on mobile */}
      <div className="hidden sm:block max-w-7xl mx-auto px-4 md:px-8 lg:px-12 mb-8 md:mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {brandingData && brandingData.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-5 md:p-6 bg-gradient-to-br from-green-50 to-gray-50 rounded-lg border border-green-100 hover:border-green-300 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 text-green-600 group-hover:text-green-700 transition-colors">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 mt-1 leading-snug">
                  {item.Description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Shop by Categories
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Explore products across trusted market categories
          </p>
        </div>

        {isLoading && categories.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse mx-auto mb-3"></div>
              <p className="text-gray-500 text-sm md:text-base">Loading categories&hellip;</p>
            </div>
          </div>
        ) : categories && categories.length !== 0 ? (
          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-5 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => {
              const handleSubmit = () => {
                navigate(`/products?category=${encodeURIComponent(category.title)}`);
              };

              return (
                <div
                  key={category._id || category.title}
                  onClick={handleSubmit}
                  className="flex flex-col items-center justify-start cursor-pointer bg-white rounded-xl border border-gray-200 hover:border-green-400 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  {/* Image Container */}
                  <div className="w-full h-24 md:h-28 lg:h-32 bg-gradient-to-b from-gray-100 to-gray-50 overflow-hidden">
                    <img
                      src={iconFor(category)}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                      alt={category.title}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = PlaceholderCategory;
                      }}
                    />
                  </div>
                  
                  {/* Title */}
                  <div className="w-full px-3 py-3 text-center border-t border-gray-100 group-hover:bg-green-50 transition-colors">
                    <h5 className="text-xs md:text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                      {category.title}
                    </h5>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-500 text-sm md:text-base">
                {error ? "Unable to load categories right now." : "No categories available yet."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;