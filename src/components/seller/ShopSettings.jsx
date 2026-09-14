import React from 'react'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { AiOutlineCamera } from 'react-icons/ai'
import { Avatar } from '../common/ImageWithFallback'
import { PlaceholderAvatar } from '../../assets'
import { loadSeller } from '../../store/redux/actions/user';
import { useDispatch } from 'react-redux'
import styles from '../../styles/styles.js'
import { useEffect } from 'react'

const ShopSettings = () => {

    const { seller } = useSelector((state) => state.seller);
  const [avatar, setAvatar] = useState();
  const [name, setName] = useState(seller?.name ?? "");
  const [description, setDescription] = useState(
    seller?.description ?? ""
  );
  const [address, setAddress] = useState(seller?.address ?? "");
  const [phoneNumber, setPhoneNumber] = useState(seller?.phoneNumber ?? "");
  const [zipCode, setZipcode] = useState(seller?.zipCode ?? "");

  const dispatch = useDispatch();

  // Sync the form fields whenever the seller/shop data is (re)loaded so the
  // settings page always reflects the current shop info.
  useEffect(() => {
    if (seller) {
      if (seller.name) setName(seller.name);
      if (seller.description) setDescription(seller.description);
      if (seller.address) setAddress(seller.address);
      if (seller.phoneNumber != null) setPhoneNumber(seller.phoneNumber);
      if (seller.zipCode != null) setZipcode(seller.zipCode);
    }
  }, [seller]);







// Function to handle avatar change
  const handleAvatarChange = async (e) => {
    try{
      const file=e.target.files[0];
      setAvatar(file);

      const formData=new FormData();

      formData.append("image", file);

      await api.put('/shop/update-shop-avatar', formData, {
        headers: {
        "Content-Type": "multipart/form-data",
      },
      })
      .then((res)=>{
        toast.success("Avatar updated successfully!");
        dispatch(loadSeller());
      })
      .catch(err=>{
        toast.error(err.response.data.message);
      })
    }
    catch(err){
      toast.error(err.message);
    }
  }









const updateHandler = async (e) => {
    e.preventDefault();


    await api
      .put(
        `/shop/update-shop-info`,
        {
          name,
          description,
          address,
          phoneNumber,
          zipCode,
        }
      )
      .then((res) => {
        toast.success("Shop info updated succesfully!");
        dispatch(loadSeller());
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };






  return (
    <div className="w-full">
      {/* Shop Avatar Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Shop Avatar</h2>
        <div className="flex justify-center">
          <div className="relative">
            <Avatar
              data={seller}
              fallback={PlaceholderAvatar}
              className="w-[150px] h-[150px] rounded-full object-cover border-4 border-green-600"
              alt={seller && seller.name ? seller.name : 'Profile'}
            />
            <div className="w-[40px] h-[40px] bg-green-600 rounded-full flex items-center justify-center cursor-pointer absolute bottom-0 right-0 text-white hover:bg-green-700 transition">
              <input
                type="file"
                className="hidden"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <label htmlFor="avatar" className="cursor-pointer flex items-center justify-center w-full h-full">
                <AiOutlineCamera size={20} />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Information Form */}
      <form
        aria-required={true}
        onSubmit={updateHandler}
      >
        {/* Basic Information Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            {/* Shop Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
              <input
                type="text"
                placeholder="Enter your shop name"
                value={name ?? ""}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                required
              />
            </div>

            {/* Shop Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shop Description</label>
              <input
                type="text"
                placeholder="Enter your shop description"
                value={description ?? ""}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-4">
            {/* Shop Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shop Address</label>
              <input
                type="text"
                placeholder="Enter your shop address"
                value={address ?? ""}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shop Phone Number</label>
              <input
                type="number"
                placeholder="Enter your phone number"
                value={phoneNumber ?? ""}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                required
              />
            </div>

            {/* Zip Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shop Zip Code</label>
              <input
                type="number"
                placeholder="Enter your zip code"
                value={zipCode ?? ""}
                onChange={(e) => setZipcode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex justify-end">
          <button
            type="submit"
            className="bg-green-600 text-white px-8 py-2 rounded-lg hover:bg-green-700 font-semibold transition"
          >
            Update Shop
          </button>
        </div>
      </form>
    </div>
  )
}

export default ShopSettings