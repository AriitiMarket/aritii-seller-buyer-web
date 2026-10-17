import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from '@/styles/styles'
import ProductCard from '@/shared/components/ProductCard'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getAllProductsShop } from '@/store/slices/productThunks'
import { getAllEventsShop } from '@/store/slices/eventThunks'
// import Loader from '../common/Loader.jsx'
// import { toast } from 'react-toastify'
import Ratings from '@/components/common/Ratings'
import { Avatar } from '@/components/common/ImageWithFallback'

const ShopProfileData = ({ isOwner, shopId }) => {

  const { products } = useSelector((state) => state.products);
  const { events } = useSelector((state) => state.events);
  const routeId = useParams().id;
  const id = shopId || routeId;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!id) return;
    dispatch(getAllProductsShop(id));
    dispatch(getAllEventsShop(id));
  }, [dispatch, id]);

    const [active, setActive] = useState(1);
    //YE ACTIVE WALA HO HEE HISAAB A JESE USER K PAGE PE SIDEBAR THA ORDERTRACKING, PROFILE, CHANGE PASSWORD ETC.
    //  WAHI HAI YE ACTIVE WALA HISAAB. JAB USER CLICK KAREGA TOH ACTIVE STATE CHANGE HO JAYEGA AUR USKE HISAB SE DATA SHOW HOGA.

  
  const allReviews =
    products && products.map((product) => product.reviews).flat();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <div className="w-full flex overflow-x-auto pb-2 no-scrollbar sm:overflow-visible sm:pb-0">
          <div className="flex items-center shrink-0" onClick={() => setActive(1)}>
            <h5
              className={`font-[600] text-[16px] sm:text-[20px] ${
                active === 1 ? "text-brand-primary" : "text-[#333]"
              } cursor-pointer pr-[20px] sm:pr-[20px]`}
            >
              Shop Products
            </h5>
          </div>



          
          <div className="flex items-center shrink-0" onClick={() => setActive(2)}>
            <h5
              className={`font-[600] text-[16px] sm:text-[20px] ${
                active === 2 ? "text-brand-primary" : "text-[#333]"
              } cursor-pointer pr-[20px] sm:pr-[20px]`}
            >
              Running Events
            </h5>
          </div>

          {/* <div className="flex items-center" onClick={() => setActive(3)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 3 ? "text-brand-primary" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Shop Reviews
            </h5>
          </div> */}
        </div>
        <div>
          {isOwner && (
            <div>
              <Link to="/business">
                <div className={`${styles.button} !rounded-[4px] h-[42px]`}>
                  <span className="text-[#fff]">Go Dashboard</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      <br />
      {active === 1 && (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
          {products &&
            products.map((i, index) => (
              <ProductCard data={i} key={index} isShop={true} />
            ))}
        </div>
      )}

      {active === 2 && (
        <div className="w-full">
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
            {events &&
              events.map((i, index) => (
                <ProductCard
                  data={i}
                  key={index}
                  isShop={true}
                  isEvent={true}
                />
              ))}
          </div>
          {events && events.length === 0 && (
            <h5 className="w-full text-center py-5 text-[18px]">
              No Events have for this shop!
            </h5>
          )}
        </div>
      )}

      {active === 3 && (
        <div className="w-full">
          {allReviews &&
            allReviews.map((item, index) => (
              <div className="w-full flex my-4">
                <Avatar
                  url={item.user?.avatar?.url}
                  data={item.user}
                  className="w-[50px] h-[50px] rounded-full object-cover"
                  alt={item.user?.name || "user avatar"}
                />
                <div className="pl-2">
                  <div className="flex w-full items-center">
                                        <h1 className="font-[600] pr-2">{item.user?.name || 'Anonymous'}</h1>
                    <Ratings rating={item.rating} />
                  </div>
                  <p className="font-[400] text-[#000000a7]">{item?.comment}</p>
                  <p className="text-[#000000a7] text-[14px]">{"2days ago"}</p>
                </div>
              </div>
            ))}
          {allReviews && allReviews.length === 0 && (
            <h5 className="w-full text-center py-5 text-[18px]">
              No Reviews have for this shop!
            </h5>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopProfileData;
