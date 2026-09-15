import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import SellerLayout from '../SellerLayout.jsx'
import Loader from '../../components/common/Loader.jsx'

/**
 * Seller Edit Product Page
 * Allows sellers to edit existing product details
 */
const SellerEditProductPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch product details if needed
    setLoading(false)
  }, [id, dispatch])

  if (loading) {
    return <Loader />
  }

  return (
    <SellerLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
        {/* Add product edit form here */}
      </div>
    </SellerLayout>
  )
}

export default SellerEditProductPage
