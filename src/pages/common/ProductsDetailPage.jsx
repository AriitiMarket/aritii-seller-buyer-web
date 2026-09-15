import React, { useEffect, useState } from 'react'
import Header from '../../components/layout/Header'
import ProductDetail from '../../components/marketplace/ProductDetail'
import Footer from '../../components/layout/Footer'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SuggestedProducts from '../../components/marketplace/SuggestedProducts'
import productService from '../../services/product.service'

/**
 * Public Product Detail Page
 * 
 * Shows real product data from the backend. Products are loaded from:
 * 1. Redux store (allProducts) - bulk marketplace products
 * 2. Backend API (productService.getById) - detailed product info
 * 
 * No login required. No seller private data shown.
 */
const ProductsDetailPage = () => {
    const { name } = useParams();
    const { allProducts = [] } = useSelector((state) => state.products || {});
    const { allEvents = [] } = useSelector((state) => state.events || {});
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);
            try {
                let foundProduct = null;

                // First try to find by ID in local redux store
                if (allProducts && allProducts.length > 0) {
                    foundProduct = allProducts.find((item) => (item._id || item.id) === name);
                }

                // If not found locally, try to fetch from backend
                if (!foundProduct) {
                    try {
                        foundProduct = await productService.getById(name);
                    } catch {
                        foundProduct = null;
                    }
                }

                // If still not found, try fuzzy match by name in local store
                if (!foundProduct && allProducts && allProducts.length > 0) {
                    const productName = name.replace(/-/g, " ");
                    foundProduct = allProducts.find((item) => 
                        item.name && item.name.toLowerCase() === productName.toLowerCase()
                    );
                }

                // Also check events if product not found
                if (!foundProduct && allEvents && allEvents.length > 0) {
                    foundProduct = allEvents.find((item) => 
                        (item._id || item.id) === name || 
                        (item.name && item.name.toLowerCase() === (name.replace(/-/g, " ")).toLowerCase())
                    );
                }

                setData(foundProduct || null);
            } catch (err) {
                setError(err.message || "Could not load product");
                setData(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [name, allProducts, allEvents]);

    if (loading) {
        return (
            <div>
                <Header />
                <div className="w-11/12 mx-auto py-24 text-center text-brand-muted">
                    Loading product…
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div>
                <Header />
                <div className="w-11/12 mx-auto py-24 text-center">
                    <h2 className="text-2xl font-semibold text-brand-charcoal">Product not found</h2>
                    <p className="text-brand-muted mt-2">{error || "This product is not available on Aritii Market."}</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <ProductDetail data={data} />
            {data && <SuggestedProducts data={data} />}
            <Footer />
        </div>
    );
};

export default ProductsDetailPage