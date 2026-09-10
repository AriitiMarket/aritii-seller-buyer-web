import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Store from '../../../store/redux/store'
import { getAllOrdersOfUser } from '../../../store/redux/actions/order'

// Buyer Account: My Orders.
// Shows ONLY the logged-in buyer's own orders (getAllOrdersOfUser(user._id)).
// Each order links to its own detail page.
const CustomerOrdersPage = () => {
  const user = useSelector((state) => state.user?.user)
  const orders = useSelector((state) => state.order?.orders || [])
  const loading = useSelector((state) => state.order?.loading || false)

  useEffect(() => {
    if (user?._id) Store.dispatch(getAllOrdersOfUser(user._id))
    // eslint-disable-next-line
  }, [user?._id])

  if (loading) return <p className="py-20 text-center text-gray-400">Loading your orders…</p>

  return (
    <div className="rounded-[12px] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-[600] text-[#1F2937] mb-1">My Orders</h2>
      <p className="text-sm text-gray-500 mb-4">Only orders placed by your account are shown here.</p>
      {orders.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-gray-500 text-lg mb-3">No orders yet.</p>
          <Link to="/products" className="px-5 py-2 rounded-md bg-[#0B6E4F] text-white font-[500]">Start shopping</Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[640px] text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2">Items</th>
                <th className="px-3 py-2">Total</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2"> </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-mono text-xs">#{o._id?.slice?.(-8)}</td>
                  <td className="px-3 py-2">{o.products?.length || o.items?.length || 0}</td>
                  <td className="px-3 py-2 font-[600]">{Number(o.totalPrice || 0).toLocaleString()} ETB</td>
                  <td className="px-3 py-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#0B6E4F]/10 text-[#0B6E4F] capitalize">{o.orderStatus || o.status}</span>
                  </td>
                  <td className="px-3 py-2 text-gray-500">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="px-3 py-2">
                    <Link to={`/user/order/${o._id}`} className="text-[#0B6E4F] hover:underline">Details →</Link>
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

export default CustomerOrdersPage