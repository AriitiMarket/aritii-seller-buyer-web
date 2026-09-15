import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductDetail, updateProduct } from '../../store/redux/actions/product.js'
import { ProductImage } from '../../components/common/ImageWithFallback.jsx'
import SellerLayout from '../../seller/SellerLayout.jsx'
import Loader from '../../components/common/Loader.jsx'
import { toast } from 'react-toastify'

const SellerEditProduct = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { product, isLoading, error, success } = useSelector((state) => state.products)
  const { categories } = useSelector((state) => state.shop)
  const { seller } = useSelector((state) => state.seller)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [discountPrice, setDiscountPrice] = useState('')
  const [stock, setStock] = useState('')
  const [newFiles, setNewFiles] = useState([])
  const [newPreviews, setNewPreviews] = useState([])
  const [imageUrls, setImageUrls] = useState('')

  // load product and prefill the form
  useEffect(() => {
    if (id) {
      dispatch(getProductDetail(id)).then((p) => {
        if (p) {
          setName(p.name || '')
          setDescription(p.description || '')
          setCategory(p.category || '')
          setTags(p.tags || '')
          setOriginalPrice(p.originalPrice ?? '')
          setDiscountPrice(p.discountPrice ?? '')
          setStock(p.stock ?? '')
        }
      }).catch(() => {})
    }
  }, [id, dispatch])

  useEffect(() => {
    if (error) toast.error(error)
    if (success) {
      toast.success('Product updated successfully!')
      navigate('/dashboard-products')
    }
  }, [error, success, navigate])

  if (isLoading && !product) return <Loader />

  const existingImages = (product && product.images) ? product.images : []

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setNewFiles((prev) => [...prev, ...files])
    setNewPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    newFiles.forEach((f) => fd.append('productImg', f))
    if (imageUrls.trim()) fd.append('imageUrls', imageUrls)
    // keep existing images untouched (replace only with new uploads/urls)
    fd.append('keepExistingImages', 'false')
    fd.append('name', name)
    fd.append('description', description)
    fd.append('category', category)
    fd.append('tags', tags)
    if (originalPrice !== '') fd.append('originalPrice', Number(originalPrice))
    if (discountPrice !== '') fd.append('discountPrice', Number(discountPrice))
    if (stock !== '') fd.append('stock', Number(stock))
    if (seller?._id) fd.append('shopId', seller._id)

    try {
      await dispatch(updateProduct(id, fd))
    } catch (err) {
      // toast shown via reducer error
    }
  }
return (
    <SellerLayout sidebarActive={3}>
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-Poppins font-semibold">Edit Product</h1>
            <button
              onClick={() => navigate('/dashboard-products')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
            >
              ← Back to My Products
            </button>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
            {existingImages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Current Images</h3>
                <div className="flex gap-2 flex-wrap">
                  {existingImages.map((im, i) => (
                    <div key={i} className="w-20 h-20 rounded-md overflow-hidden border border-gray-200">
                      <ProductImage data={{ images: [im] }} className="w-full h-full object-cover" alt={product.name} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full border border-gray-300 rounded px-3 h-[38px] focus:outline-none focus:border-[#3BC177]" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="mt-1 w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[#3BC177]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} required className="mt-1 w-full border border-gray-300 rounded h-[38px] px-2">
                    {(categories || []).map((c) => (
                      <option value={c.title} key={c._id || c.title}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tags</label>
                  <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="comma, separated" className="mt-1 w-full border border-gray-300 rounded px-3 h-[38px]" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Original Price</label>
                  <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="Before discount" className="mt-1 w-full border border-gray-300 rounded px-3 h-[38px]" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Price Now <span className="text-red-500">*</span></label>
                  <input type="number" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} required className="mt-1 w-full border border-gray-300 rounded px-3 h-[38px]" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Stock <span className="text-red-500">*</span></label>
                  <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required className="mt-1 w-full border border-gray-300 rounded px-3 h-[38px]" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Image URLs (comma separated, optional)</label>
                <input type="text" value={imageUrls} onChange={(e) => setImageUrls(e.target.value)} placeholder="https://... , https://..." className="mt-1 w-full border border-gray-300 rounded px-3 h-[38px]" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Upload New Images (optional)</label>
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="mt-1 w-full border border-gray-300 rounded p-1" />
                {newPreviews.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {newPreviews.map((p, i) => (
                      <img key={i} src={p} alt="preview" className="w-16 h-16 object-cover rounded border border-gray-200" />
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" className="w-full py-3 bg-[#3BC177] text-white rounded-md font-medium hover:bg-[#2ea763]">
                Save Changes
              </button>
            </form>
      </div>
    </SellerLayout>
  )
}

export default SellerEditProduct