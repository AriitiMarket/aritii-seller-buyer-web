import React from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORY_IMAGES, PlaceholderCategory } from '../../assets';
import styles from '../../styles/styles';

const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();
  const submitHandle = (i) => {
    navigate(`/products?category=${encodeURIComponent(i.title)}`);
    setDropDown(false);
  };

  const iconFor = (category) => {
    const title = (category?.title || "").trim();
    return category?.image || CATEGORY_IMAGES[title] || PlaceholderCategory;
  };

  return (
    <div className="pb-4 w-[270px] bg-[#fff] absolute z-30 rounded-b-md shadow-sm">
      {categoriesData &&
        categoriesData.map((i, index) => (
          <div
            key={i._id || i.title || index}
            className={`${styles.noramlFlex}`}
            onClick={() => submitHandle(i)}
          >
            <img
              src={iconFor(i)}
              style={{
                width: "25px",
                height: "25px",
                objectFit: "contain",
                marginLeft: "10px",
                userSelect: "none",
              }}
              alt=""
            />
            <h3 className="m-3 cursor-pointer select-none">{i.title}</h3>
          </div>
        ))}
    </div>
  );
};

export default DropDown;