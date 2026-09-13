import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar, ProductImage } from '../../../components/common/ImageWithFallback'
import { getAllOrdersOfUser } from '../../../store/redux/actions/order'
import Store from '../../../store/redux/store'

// Buyer Dashboard — the customer's own overview.
// Shows only the logged-in buyer's private data: their avatar + name,
// their order history, saved addresses and wishlist. Never any seller/admin data.
// A "Keep exploring" section also lets the buyer continue browsing the marketplace
// from within their own dashboard (products link to their details, shops are public).
const CustomerOverviewPage = () => {
  const user = useSelector((state) => state.user?.user)
  const { isSeller } = useSelector((state) => state.seller)
  const orders = useSelector((state) => state.order?.orders || [])
  const wishlist = useSelector((state) => state.wishlist?.wishlist || [])
  const addresses = user?.addresses || []
  const allProducts = useSelector((state) => state.product?.allProducts || [])
  const allShops = useSelector((state) => state.shop?.shops || [])

  useEffect(() => {
    if (user?._id) Store.dispatch(getAllOrdersOfUser(user._id))
    // eslint-disable-next-line
  }, [user?._id])

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.totalPrice || 0), 0)
  const recentOrders = orders.slice(0, 5)
  const explore = allProducts.slice(0, 4)

  return (
    <div className="space-y-6">
      <div className="rounded-[12px] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Avatar data={user} className="w-16 h-16 rounded-full" />
          <div>
            <p className="text-xl font-[600] text-[#1F2937]">Welcome back, {user?.name} 👋</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
        <p className="mt-2 text-sm text-[#0B6E4F]">Manage your orders, addresses, wishlist and profile — all in one private account.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="rounded-[12px] bg-[#0B6E4F] p-5 text-white">
          <p className="text-3xl font-[700]">{orders.length}</p>
          <p className="text-sm">Orders</p>
        </div>
        <div className="rounded-[12px] bg-[#F5A623] p-5 text-white">
          <p className="text-3xl font-[700]">{addresses.length}</p>
          <p className="text-sm">Saved Addresses</p>
        </div>
        <div className="rounded-[12px] bg-[#C0392B] p-5 text-white">
          <p className="text-3xl font-[700]">{wishlist.length}</p>
          <p className="text-sm">Wishlist Items</p>
        </div>
      </div>

      <div className="rounded-[12px] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-[600] text-[#1F2937]">Recent Orders</h3>
          <Link to="/my-dashboard/orders" className="text-sm text-[#0B6E4F] hover:underline">View all →</Link>
        </div>
        <p className="mt-2 text-sm text-gray-500">Total spent on Aritii: <b className="text-[#C0392B]">{Number(totalSpent).toLocaleString()} ETB</b></p>
        {recentOrders.length === 0 ? (
          <p className="mt-4 py-6 text-center text-gray-400">You have no orders yet. <Link to="/products" className="text-[#0B6E4F]">Start shopping →</Link></p>
        ) : (
          <ul className="mt-3 divide-y text-sm">
            {recentOrders.map((o) => (
              <li key={o._id} className="py-2 flex justify-between">
                <span className="text-gray-700">Order <b className="text-gray-800">#{o._id?.slice?.(-8)}</b></span>
                <span className="text-[#0B6E4F] capitalize">{o.orderStatus || o.status}</span>
                <span className="text-gray-500">{Number(o.totalPrice || 0).toLocaleString()} ETB</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-[12px] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-[600] text-[#1F2937]">Quick Links</h3>
        <div className={`mt-3 grid ${isSeller ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2'} gap-3 text-sm`}>
          <Link to="/products" className="px-4 py-3 rounded-md bg-[#0B6E4F]/10 text-[#0B6E4F] font-[500]">🛒 Continue Shopping</Link>
          <Link to="/my-dashboard/wishlist" className="px-4 py-3 rounded-md bg-[#C0392B]/10 text-[#C0392B] font-[500]">❤️ My Wishlist</Link>
          {isSeller && (
            <Link to="/dashboard" className="px-4 py-3 rounded-md bg-[#0B6E4F] text-white font-[500]">🏪 Seller Center</Link>
          )}
          <Link to="/my-dashboard/addresses" className="px-4 py-3 rounded-md bg-[#F5A623]/10 text-[#B8860B] font-[500]">📒 Address Book</Link>
          <Link to="/my-dashboard/settings" className="px-4 py-3 rounded-md bg-gray-100 text-gray-700 font-[500]">⚙️ Settings</Link>
          {!isSeller && (
            <Link to="/sell" className="px-4 py-3 rounded-md bg-brand-primary/10 text-brand-primary font-[500]">🏬 Become a Seller</Link>
          )}
        </div>
      </div>

      {/* Keep exploring — the buyer can also browse the marketplace & view details from their own dashboard */}
      <div className="rounded-[12px] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-[600] text-[#1F2937]">Keep exploring on Aritii Market</h3>
          <Link to="/products" className="text-sm text-[#0B6E4F] hover:underline">All products →</Link>
        </div>
        {explore.length === 0 ? (
          <p className="py-8 text-center text-gray-400">No products are live yet. <Link to="/shops" className="text-[#0B6E4F]">Browse shops →</Link></p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
            {explore.map((p) => (
              <Link key={p._id} to={`/product/${p.name?.toLowerCase().replace(/ /g, '-')}`}
                className="rounded-[12px] border p-2 hover:shadow-md">
                <ProductImage data={p} className="w-full h-28 object-cover rounded-md" />
                <p className="mt-1 font-[600] text-sm text-[#1F2937] line-clamp-1">{p.name}</p>
                <p className="text-[#C0392B] font-[700] text-sm">{Number(p.discountPrice || p.price || 0).toLocaleString()} ETB</p>
              </Link>
            ))}
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link to="/shops" className="px-3 py-1.5 rounded-full bg-[#0B6E4F]/10 text-[#0B6E4F] font-[500]">🛍️ Browse {allShops.length} shops</Link>
          <Link to="/products" className="px-3 py-1.5 rounded-full bg-[#F5A623]/10 text-[#B8860B] font-[500]">🧭 Browse categories</Link>
          <Link to="/events" className="px-3 py-1.5 rounded-full bg-[#C0392B]/10 text-[#C0392B] font-[500]">🎁 Deals & events</Link>
        </div>
      </div>
    </div>
  )
}

export default CustomerOverviewPage