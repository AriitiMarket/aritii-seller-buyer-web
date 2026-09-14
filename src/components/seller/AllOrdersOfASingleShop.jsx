import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteProduct } from '../../store/redux/actions/product.js'
import { AiOutlineEye, AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import Loader from '../common/Loader.jsx';
import { toast } from 'react-toastify';
import { getAllOrdersOfShop } from '../../store/redux/actions/order.js';  
import { AiOutlineArrowRight } from "react-icons/ai";
import './AllOrdersOfASingleShop.css';


const AllOrdersOfASingleShop = () => {

 const { ShopOrders=[], isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
  if (seller && seller._id) {
    dispatch(getAllOrdersOfShop(seller._id));
  }
}, [dispatch, seller]);

// Helper function to determine status badge color
const getStatusBadgeClass = (status) => {
  const statusLower = status?.toLowerCase() || '';
  if (statusLower === 'delivered') return 'status-badge status-badge--delivered';
  if (statusLower === 'processing' || statusLower === 'pending') return 'status-badge status-badge--processing';
  if (statusLower === 'shipped') return 'status-badge status-badge--shipped';
  if (statusLower === 'cancelled') return 'status-badge status-badge--cancelled';
  return 'status-badge status-badge--default';
};





  const row = [];

   ShopOrders &&
    ShopOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });


    
  return (
    <>
    {
      isLoading ? (
        <Loader />
      ) : (
        <div className="orders-container">
          <div className="orders-header">
            <h2>Shop Orders</h2>
            <p className="orders-count">{row.length} order{row.length !== 1 ? 's' : ''}</p>
          </div>
          
          {row.length === 0 ? (
            <div className="orders-empty">
              <p>No orders found</p>
            </div>
          ) : (
            <div className="orders-table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Status</th>
                    <th>Items Qty</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {row.map((order) => (
                    <tr key={order.id} className="order-row">
                      <td className="order-id">{order.id}</td>
                      <td>
                        <span className={getStatusBadgeClass(order.status)}>
                          {order.status}
                        </span>
                      </td>
                      <td className="items-qty">{order.itemsQty}</td>
                      <td className="order-total">{order.total}</td>
                      <td className="order-action">
                        <Link to={`/order/${order.id}`}>
                          <button className="view-btn" title="View Order Details">
                            <AiOutlineArrowRight size={18} />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )
    }
    </>
  )
}

export default AllOrdersOfASingleShop