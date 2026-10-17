import React from "react";

const Ratings = ({ rating }) => {
  const stars = [];
  const value = Number(rating) || 0;

  for (let i = 1; i <= 5; i++) {
    if (i <= value) {
      stars.push(<span key={i} className="market-rating-star" aria-hidden="true">★</span>);
    } else {
      stars.push(<span key={i} className="market-rating-star-empty" aria-hidden="true">★</span>);
    }
  }
  return <div className="flex items-center gap-0.5" role="img" aria-label={`Rating ${value} out of 5`}>{stars}</div>;
};

export default Ratings;
