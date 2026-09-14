import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProductsShop } from '../../store/redux/actions/product.js'
import { deleteProduct } from '../../store/redux/actions/product.js'
import { AiOutlineEye, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Link } from "react-router-dom";
import Loader from '../common/Loader.jsx';
import { toast } from 'react-toastify';
import './AllProductsOfASingleShop.css';


const AllProductsOfASingleShop = () => {

 const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
  if (seller && seller._id) {
    dispatch(getAllProductsShop(seller._id));
  }
}, [dispatch, seller]);



// Helper function to get stock status
const getStockStatus = (stock) => {
  if (stock === 0) return 'out-of-stock';
  if (stock <= 5) return 'low-stock';
  return 'in-stock';
};

// Helper function to get stock status label
const getStockLabel = (stock) => {
  if (stock === 0) return 'Out of Stock';
  if (stock <= 5) return 'Low Stock';
  return 'In Stock';
};








const handleDeleteProduct = async (id) => {
  try {
    await dispatch(deleteProduct(id));
   
    if (seller && seller._id) {
      dispatch(getAllProductsShop(seller._id));
    }

    toast.success("Product deleted successfully");  

  } catch (error) {
    console.error("Failed to delete product:", error);
    toast.error("Failed to delete product");
  }
}

  const row = [];

  products &&
    products.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: item.discountPrice,
        stock: item.stock,
        sold: item?.sold_out,
      });
    });

    
  return (
    <>
    {
      isLoading ? (
        <Loader />
      ) : (
        <div className="products-container">
          <div className="products-header">
            <h2>Shop Products</h2>
            <p className="products-count">{row.length} product{row.length !== 1 ? 's' : ''}</p>
          </div>

          {row.length === 0 ? (
            <div className="products-empty">
              <p>No products found</p>
            </div>
          ) : (
            <div className="products-grid">
              {row.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-card-header">
                    <h3 className="product-name">{product.name}</h3>
                    <span className={`stock-indicator ${getStockStatus(product.stock)}`}>
                      {getStockLabel(product.stock)}
                    </span>
                  </div>

                  <div className="product-card-body">
                    <div className="product-info-row">
                      <span className="info-label">Price:</span>
                      <span className="info-value">US ${product.price}</span>
                    </div>
                    <div className="product-info-row">
                      <span className="info-label">Stock:</span>
                      <span className="info-value info-stock">{product.stock} units</span>
                    </div>
                    <div className="product-info-row">
                      <span className="info-label">Sold:</span>
                      <span className="info-value">{product.sold || 0} units</span>
                    </div>
                  </div>

                  <div className="product-card-footer">
                    <Link to={`/dashboard-product/${product.id}`} className="action-btn action-btn--view" title="View details">
                      <AiOutlineEye size={18} />
                      <span>View</span>
                    </Link>
                    <Link to={`/dashboard-edit-product/${product.id}`} className="action-btn action-btn--edit" title="Edit product">
                      <AiOutlineEdit size={18} />
                      <span>Edit</span>
                    </Link>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)} 
                      className="action-btn action-btn--delete"
                      title="Delete product"
                    >
                      <AiOutlineDelete size={18} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }
    </>
  )
}

export default AllProductsOfASingleShop