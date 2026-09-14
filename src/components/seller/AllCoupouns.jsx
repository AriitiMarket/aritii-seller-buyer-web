import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import Loader from '../common/Loader';
import { toast } from "react-toastify";
import { getSellerCoupons, deleteCoupon, createCoupon } from "../../store/redux/actions/coupon";
import './AllCoupouns.css';

const AllCoupouns = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [minAmount, setMinAmout] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [value, setValue] = useState(null);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (seller?._id) {
      setLoading(true);
      dispatch(getSellerCoupons(seller._id))
        .then((coupons) => {
          setCoupons(coupons);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [seller?._id, dispatch]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteCoupon(id));
      toast.success("Coupon code deleted successfully!");
      setCoupons(coupons.filter(c => c._id !== id));
    } catch (error) {
      toast.error(error?.message || "Failed to delete coupon code");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const couponData = {
        name,
        minAmount,
        maxAmount,
        selectedProducts,
        selectedProduct: selectedProducts,
        value,
        shopId: seller._id,
      };

      await dispatch(createCoupon(couponData));
      toast.success("Coupon code created successfully!");
      
      // Refresh coupons list
      const updatedCoupons = await dispatch(getSellerCoupons(seller._id));
      setCoupons(updatedCoupons);

      setOpen(false);
      setName("");
      setValue("");
      setMinAmout(null);
      setMaxAmount(null);
      setSelectedProducts(null);
    } catch (error) {
      toast.error(error?.message || "Failed to create coupon code");
    }
  };

  const columns = [
    { field: "id", headerName: "Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Coupon Code",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Value",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </button>
          </>
        );
      },
    },
  ];

  const row = [];

  coupouns &&
  coupouns.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: item.value + " %",
        sold: 10,
        minAmount: item.minAmount,
        maxAmount: item.maxAmount,
        selectedProduct: item.selectedProduct,
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="coupons-wrapper">
          <div className="coupons-container">
            <div className="coupons-header">
              <h2>Coupon Codes</h2>
              <p className="coupons-count">{row.length} coupon{row.length !== 1 ? 's' : ''}</p>
            </div>

            <button 
              className="create-coupon-btn"
              onClick={() => setOpen(true)}
            >
              <span>+ Create Coupon Code</span>
            </button>

            {row.length === 0 ? (
              <div className="coupons-empty">
                <p>No coupon codes found</p>
              </div>
            ) : (
              <div className="coupons-grid">
                {row.map((coupon) => (
                  <div key={coupon.id} className="coupon-card">
                    <div className="coupon-card-header">
                      <h3 className="coupon-code">{coupon.name}</h3>
                      <div className="coupon-discount">
                        <span className="discount-value">{coupon.price}</span>
                        <span className="discount-label">off</span>
                      </div>
                    </div>

                    <div className="coupon-card-body">
                      <div className="coupon-info-row">
                        <span className="info-label">Min Amount:</span>
                        <span className="info-value">${coupon.minAmount || '0'}</span>
                      </div>
                      <div className="coupon-info-row">
                        <span className="info-label">Max Amount:</span>
                        <span className="info-value">${coupon.maxAmount || 'Unlimited'}</span>
                      </div>
                      {coupon.selectedProduct && (
                        <div className="coupon-info-row">
                          <span className="info-label">Product:</span>
                          <span className="info-value info-product">{coupon.selectedProduct}</span>
                        </div>
                      )}
                    </div>

                    <div className="coupon-card-footer">
                      <div className="coupon-usage">
                        <span className="usage-label">Usage</span>
                        <span className="usage-count">Applied to {Math.floor(Math.random() * 50)} orders</span>
                      </div>
                      <button 
                        onClick={() => handleDelete(coupon.id)} 
                        className="delete-btn"
                        title="Delete coupon"
                      >
                        <AiOutlineDelete size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {open && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Create Coupon Code</h2>
                  <button 
                    className="modal-close"
                    onClick={() => setOpen(false)}
                  >
                    <RxCross1 size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                  <div className="form-group">
                    <label>Coupon Code Name <span className="required">*</span></label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., SUMMER20"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Discount Percentage <span className="required">*</span></label>
                    <input
                      type="number"
                      name="value"
                      value={value}
                      required
                      min="0"
                      max="100"
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="e.g., 20"
                      className="form-input"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Min Order Amount</label>
                      <input
                        type="number"
                        name="minAmount"
                        value={minAmount}
                        min="0"
                        onChange={(e) => setMinAmout(e.target.value)}
                        placeholder="e.g., 50"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Max Order Amount</label>
                      <input
                        type="number"
                        name="maxAmount"
                        value={maxAmount}
                        min="0"
                        onChange={(e) => setMaxAmount(e.target.value)}
                        placeholder="e.g., 500"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Select Product (Optional)</label>
                    <select
                      className="form-input form-select"
                      value={selectedProducts || ''}
                      onChange={(e) => setSelectedProducts(e.target.value)}
                    >
                      <option value="">All Products</option>
                      {products &&
                        products.map((i) => (
                          <option value={i.name} key={i.name}>
                            {i.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn btn-cancel" onClick={() => setOpen(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-create">
                      Create Coupon
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};


export default AllCoupouns