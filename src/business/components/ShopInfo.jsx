import { DeliveryAvailability } from '@/shared/components/DeliveryAvailability';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar } from '@/components/common/ImageWithFallback'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styles from '@/styles/styles'
import { logoutSeller } from '@/store/slices/userThunks'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { getAllProductsShop } from '@/store/slices/productThunks'
import { getAllEventsShop } from '@/store/slices/eventThunks'
import shopService from '@/services/shop.service'
import { useBusinessShops } from '@/business/hooks/useBusinessShops'
import { LOGO, PlaceholderAvatar } from '@/assets'

/** Pretty label for a shop lifecycle status (never invented — mapped 1:1). */
const STATUS_LABELS = {
  PENDING_APPROVAL: 'Pending approval',
  APPROVED: 'Approved',
  ACTIVE: 'Active',
  SUSPENDED: 'Suspended',
  INACTIVE: 'Inactive',
}

/**
 * The left-hand shop card (owner view on business pages, public view elsewhere).
 *
 * @param {boolean} isOwner - render the owner actions (edit / log out)
 * @param {string} [shopId] - shop to show; falls back to the route param, then
 *                            to the owner's active shop (multi-shop businesses)
 */
const ShopInfo = ({ isOwner, shopId }) => {
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState({});

  const routeId = useParams().id;
  const id = shopId || routeId;

  // Owner pages know the active shop; the API detail call below is the single
  // source of the shop document (it carries the computed rating/product count).
  const { activeShop, activeShopId } = useBusinessShops();
  const ownerShopId = id || (isOwner ? activeShopId : null);

  useEffect(() => {
    if (!ownerShopId) return;
    let cancelled = false;
    shopService
      .getById(ownerShopId)
      .then((shop) => { if (!cancelled) setData(shop || {}); })
      .catch((error) => {
        if (!cancelled) setData({});
        console.error('Error fetching shop info:', error?.response?.data?.message || error?.message);
      });
    return () => { cancelled = true; };
  }, [ownerShopId]);

  // Resolve the shop we render: the fetched document, else the owner's active
  // shop (its list entry already carries name/status/productCount).
  const shop = (data && data._id ? data : null) || (isOwner ? activeShop : null) || seller || {};

  useEffect(() => {
    if (!shop._id) return;
    dispatch(getAllProductsShop(shop._id));
    dispatch(getAllEventsShop(shop._id));
  }, [dispatch, shop._id]);

  const logoutHandler = async () => {
    try {
      const res = await dispatch(logoutSeller());
      navigate('/');
      toast.success(res?.message || 'Log out successful!');
    } catch (error) {
      toast.error(error?.message || 'Logout failed');
    }
  }

  const snapshot = shop.locationSnapshot || {};
  const location = [snapshot.regionName, snapshot.cityName, snapshot.sectorName].filter(Boolean).join(' › ');

    // THIS IS THE COMPONENT WHICH IS CALLED IN THE SHOP HOMEPAGE AND IT DISPLAYS THE SHOP INFO LIKE ITS AVATAR, NAME, DESCRIPTION,
    // ADDRESS, PHONE NUMBER, TOTAL PRODUCTS, RATINGS, JOINED DATE AND ALSO PROVIDES THE OPTION TO EDIT SHOP OR LOGOUT ONLY
    // IF THE USER IS THE OWNER OF THE SHOP.
    // THIS COMPONENT IS PRESENT ON THE LEFT SIDE OF THE SHOP HOMEPAGE
    return (
      <div>
        <div className="w-full py-5">

          <div className="w-full flex item-center justify-center">
            <Avatar
              data={shop}
              fallback={PlaceholderAvatar || LOGO}
              alt={shop.name || "Seller"}
              className="w-[150px] h-[150px] object-cover rounded-full"
            />
          </div>

          <h3 className="text-center py-2 text-[20px]">{shop.name}</h3>

          <p className="text-[16px] text-[#000000a6] p-[10px] flex items-center">
            {shop.description}
          </p>

        </div>

        <div className="p-3">
          <h5 className="font-[600]">Address</h5>
          <h4 className="text-[#000000a6]">{shop.address}</h4>
        </div>

        <div className="p-3">
          <h5 className="font-[600]">Phone Number</h5>
          <h4 className="text-[#000000a6]">{shop.phoneNumber}</h4>
        </div>

        {isOwner && (
          <div className="p-3">
            <h5 className="font-[600]">Status</h5>
            <h4 className="text-[#000000a6]">{STATUS_LABELS[shop.status] || shop.status || 'Pending approval'}</h4>
          </div>
        )}

        {location ? (
          <div className="p-3">
            <h5 className="font-[600]">Location</h5>
            <h4 className="text-[#000000a6]">{location}</h4>
          </div>
        ) : null}

        <div className="px-3 py-1">
          <DeliveryAvailability shopId={shop._id} />
        </div>
        <div className="p-3">
          <h5 className="font-[600]">Total Products</h5>
          <h4 className="text-[#000000a6]"> {shop.productCount ?? products?.length ?? 0} </h4>
        </div>

        <div className="p-3">
          <h5 className="font-[600]">Shop Ratings</h5>
          <h4 className="text-[#000000b0]">{shop?.ratings != null ? `${Number(shop.ratings).toFixed(1)}/5` : '0/5'}</h4>
        </div>

        <div className="p-3">
          <h5 className="font-[600]">Joined On</h5>
          <h4 className="text-[#000000b0]">{shop?.createdAt?.slice(0, 10)}</h4>
        </div>

        {isOwner && (
          <div className="py-3 px-4">
             <Link to="/business/settings">
             <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}>
              <span className="text-white">Edit Shop</span>
            </div>
             </Link>
            <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
            onClick={logoutHandler}
            >
              <span className="text-white">Log Out</span>
            </div>
          </div>
        )}

      </div>
    )
}

export default ShopInfo