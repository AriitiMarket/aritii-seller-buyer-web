import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { createProduct } from '@/store/slices/productThunks';
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories';
import { toast } from 'react-toastify'
import { useBusinessShops } from '@/business/hooks/useBusinessShops';

const CreateProduct = () => {

    const { seller } = useSelector((state) => state.seller);
    // Category model uses `title` (not `name`) — the hook fetches the product
    // list on mount so the select is never empty when the seller opens the form.
    const { categories } = useCatalogCategories({ type: 'product' });
    const { isLoading, success, error } = useSelector((state) => state.products);
    const { activeShopId, loading: shopsLoading } = useBusinessShops();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [imageUrls, setImageUrls] = useState('');
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [sku, setSku] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("5");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success('Product created successfully! It\'s saved as a draft.');
      navigate("/business/products");
      // Clear the flag so reopening this form does not fire the effect again
      // on mount and instantly bounce the seller back out.
      dispatch({ type: "productCreateReset" });
    }
  }, [error, success, navigate, dispatch]);



  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    setImagesPreview((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
  };
  


  const removePreview = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagesPreview((prev) => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed);
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mirror the backend validator so the seller sees the reason before a round-trip.
    if (name.trim().length < 2) { toast.error('Product name is required (min 2 chars)'); return; }
    if (name.trim().length > 200) { toast.error('Product name must be at most 200 chars'); return; }
    if (description.trim().length < 10) { toast.error('Description must be at least 10 chars'); return; }
    if (description.trim().length > 5000) { toast.error('Description must be at most 5000 chars'); return; }
    if (!category) { toast.error('Category is required'); return; }
    if (!Number.isFinite(Number(discountPrice)) || Number(discountPrice) <= 0) { toast.error('Price must be greater than 0'); return; }
    if (originalPrice !== '' && Number(originalPrice) > 0 && Number(discountPrice) > Number(originalPrice)) {
      toast.error('Price cannot exceed the original price'); return;
    }
    if (!Number.isFinite(Number(stock)) || Number(stock) < 0 || !Number.isInteger(Number(stock))) {
      toast.error('Stock must be a whole number >= 0'); return;
    }

    const newForm = new FormData();

    images.forEach((file) => {
      newForm.append("productImg", file);
    });
    if (imageUrls.trim()) {
      newForm.append("imageUrls", imageUrls);
    }
    newForm.append("name", name.trim());
    newForm.append("description", description.trim());
    newForm.append("category", category);
    newForm.append("tags", tags);
    if (sku.trim()) {
      newForm.append("sku", sku.trim());
    }
    if (originalPrice !== undefined && originalPrice !== "") {
      newForm.append("originalPrice", Number(originalPrice));
    }
    if (discountPrice !== undefined && discountPrice !== "") {
      newForm.append("discountPrice", Number(discountPrice));
    }
    if (stock !== undefined && stock !== "") {
      newForm.append("stock", Number(stock));
    }
    if (lowStockThreshold !== undefined && lowStockThreshold !== "") {
      newForm.append("lowStockThreshold", Number(lowStockThreshold));
    }
    // Prefer the active shop id; `seller._id` is the IDENTITY user id (a UUID),
    // so it may only be used when it actually is a shop ObjectId — otherwise the
    // server answers "Business not found".
    const candidate = activeShopId || seller?._id;
    const shopIdForCreate = /^[a-f0-9]{24}$/i.test(String(candidate || '')) ? candidate : '';
    if (!shopIdForCreate) {
      toast.error("Create your shop before adding products.");
      return;
    }
    newForm.append("shopId", shopIdForCreate);

    // Success toast fires from the `success` effect — not before the server responds.
    setIsSubmitting(true);
    dispatch(createProduct(newForm)).finally(() => setIsSubmitting(false));
  };


  // Backend resolves shops via /shop/getseller; a seller with no shop gets an
  // empty state (200 + seller:null), not an error — gate the form on it so the
  // create-product call never fires without a shopId (which would 404).
  if (!shopsLoading && !activeShopId) {
    return (
      <div className="w-full bg-white shadow h-[80vh] rounded-[4px] p-3 flex flex-col items-center justify-center text-center">
        <h5 className="text-[24px] font-Poppins">You don&apos;t have a shop yet</h5>
        <p className="text-sm text-gray-500 mt-2 mb-4">
          Create your shop first — then you can add products to it.
        </p>
        <Link
          to="/create-shop"
          className="px-6 py-2 bg-blue-600 text-white rounded-[3px] hover:bg-blue-700"
        >
          Create a shop
        </Link>
      </div>
    );
  }

   return (
    <div className="w-full bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Create Product</h5>
      {/* create product form */}
      <form onSubmit={handleSubmit}>
        <br />




        <div>
          <label className="pb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            minLength={2}
            maxLength={200}
            value={name}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your product name..."
          />
        </div>





        <br />
        <div>
          <label className="pb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            required
            rows="8"
            type="text"
            name="description"
            minLength={10}
            maxLength={5000}
            value={description}
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your product description..."
           />
        </div>








        <br />
        <div>
          <label className="pb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Choose a category</option>
            {(categories || []).map((i) => (
                <option value={i.title || i.name} key={i._id || i.title || i.name}>
                  {i.title || i.name}
                </option>
              ))}
          </select>
        </div>







        <br />
        <div>
          <label className="pb-2">Tags</label>
          <input
            type="text"
            name="tags"
            maxLength={500}
            value={tags}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter your product tags..."
          />
        </div>

        <br />
        <div>
          <label className="pb-2">SKU <span className="text-gray-400 text-xs">(optional, must be unique per shop)</span></label>
          <input
            type="text"
            name="sku"
            maxLength={64}
            value={sku}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setSku(e.target.value)}
            placeholder="e.g. SHOE-001"
          />
        </div>







        <br />
        <div>
          <label className="pb-2">Previous price (Write only if you are providing discount)</label>
          <input
            type="number"
            name="price"
            value={originalPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="Enter your product price before discount..."
          />
        </div>








        <br />
        <div>
          <label className="pb-2">
            Price Now <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            required
            min="1"
            value={discountPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDiscountPrice(e.target.value)}
            placeholder="Enter your product price ..."
          />
        </div>









        
        <br />
        <div>
          <label className="pb-2">
            Product Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="stock"
            required
            min="0"
            step="1"
            value={stock}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setStock(e.target.value)}
            placeholder="Enter your product stock..."
          />
        </div>

        <br />
        <div>
          <label className="pb-2">Low-stock threshold</label>
          <input
            type="number"
            name="lowStockThreshold"
            min="0"
            step="1"
            value={lowStockThreshold}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setLowStockThreshold(e.target.value)}
            placeholder="Warn me when stock falls to this level"
          />
        </div>










        <br />
        <div>
          <label className="pb-2">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name=""
            id="upload"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
            </label>
            {imagesPreview &&
              imagesPreview.map((i, index) => (
                <div key={`${i}-${index}`} className="relative m-2">
                  <img
                    src={i}
                    alt=""
                    className="h-[120px] w-[120px] object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePreview(index)}
                    className="absolute top-0 right-0 w-5 h-5 bg-black/60 text-white text-xs flex items-center justify-center hover:bg-red-600 transition"
                    title="Remove image"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
          </div>
          <br />
          <div>
            <label className="pb-2 block text-sm text-gray-500">
              Or enter image URLs or storage keys (comma-separated)
            </label>
            <input
              type="text"
              value={imageUrls}
              onChange={(e) => setImageUrls(e.target.value)}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="https://example.com/image1.jpg, eshop/1710000000000-abc.png"
            />
          </div>
          <br />
          <div>
            <input
              type="submit"
              value={isSubmitting ? "Creating..." : "Create"}
              disabled={isSubmitting || isLoading}
              className={`mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${isSubmitting || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;