import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { brandingData } from '../../data/data';
import { CATEGORY_IMAGES, PlaceholderCategory } from '../../assets';
import styles from '../../styles/styles';

// Categories are loaded from the backend via GET /category (commerce service
// -> API Gateway). Each category only shows real fields (title, image).
// Icons are local brand assets used as visual fallbacks, keyed by category
// title — they are UI decoration, never business data.
const Categories = () => {
  const navigate = useNavigate();
  const { categories, isLoading, error } = useSelector((state) => state.shop);

  const iconFor = (category) => {
    const title = (category?.title || "").trim();
    // Prefer the backend-provided image if present, else the matching local icon.
    const localIcon = CATEGORY_IMAGES[title] || PlaceholderCategory;
    return category?.image || localIcon;
  };

  return (
    <>

      {/* Branding Section */}
      <div className={`${styles.section} hidden sm:block`}>
        <div
          className="branding my-12 flex justify-between w-full bg-brand-primary p-6 rounded-xl shadow-lg text-white"
        >
          {brandingData &&
            brandingData.map((i, index) => (
              <div className="flex items-start space-x-3" key={index}>
                <div >{i.icon}</div>
                <div>
                  <h3 className="font-semibold text-base md:text-lg">{i.title}</h3>
                  <p className="text-xs md:text-sm opacity-90">{i.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div
        className={`${styles.section} bg-white p-6 rounded-xl mb-12 shadow-md`}
        id="categories"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-brand-charcoal">
              Shop by Categories
            </h2>
            <p className="text-sm text-brand-muted mt-1">
              Explore products across trusted market categories
            </p>
          </div>
        </div>

        {isLoading && categories.length === 0 ? (
          <div className="text-center py-10 text-brand-muted">Loading categories&hellip;</div>
        ) : categories && categories.length !== 0 ? (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((i) => {
            const handleSubmit = () => {
              navigate(`/products?category=${encodeURIComponent(i.title)}`);
            };
            return (
                <div
                  key={i._id || i.title}
                  onClick={handleSubmit}
                  className="w-full flex flex-col items-center justify-start cursor-pointer bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-100 hover:border-brand-primary group overflow-hidden"
                >
                  <div className="w-full h-[110px] overflow-hidden">
                    <img
                      src={iconFor(i)}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
                      alt={i.title}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = PlaceholderCategory;
                      }}
                    />
                  </div>
                  <h5 className="text-sm font-medium text-brand-charcoal group-hover:text-brand-primary text-center my-4 px-2">
                    {i.title}
                  </h5>
                </div>
              );
            })}
        </div>
        ) : (
          <div className="text-center py-10 text-brand-muted">
            {error ? "Unable to load categories right now." : "No categories available yet."}
          </div>
        )}
      </div>
    </>
  );
};

export default Categories;