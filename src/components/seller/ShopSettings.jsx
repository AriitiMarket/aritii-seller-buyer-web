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
    <div>
<div className="flex justify-center w-full">
                    <div className="relative mt-5">
                      <Avatar
                        data={seller}
                        fallback={PlaceholderAvatar}
                        className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#F5A623]"
                        alt={seller && seller.name ? seller.name : 'Profile'}
                      />
        
                      <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
                         
                          <input
                            type="file"
                            className="hidden"
                            id="avatar"
                            accept="image/*"
                            onChange={handleAvatarChange}
                          />
                          <label htmlFor="avatar">
        
                            <AiOutlineCamera />
                          </label>
                      </div>
                    </div>
                  </div>



                 {/* shop info */}
        <form
          aria-required={true}
          className="flex flex-col items-center"
          onSubmit={updateHandler}
        >
          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop Name</label>
            </div>
            <input
              type="text"
              placeholder="Shop name"
              value={name ?? ""}
              onChange={(e) => setName(e.target.value)}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
            />
          </div>
          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop description</label>
            </div>
            <input
              type="text"
              placeholder="Enter your shop description"
              value={description ?? ""}
              onChange={(e) => setDescription(e.target.value)}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
            />
          </div>
          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop Address</label>
            </div>
            <input
              type="text"
              placeholder="Shop address"
              value={address ?? ""}
              onChange={(e) => setAddress(e.target.value)}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
            />
          </div>

          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop Phone Number</label>
            </div>
            <input
              type="number"
              placeholder="Phone number"
              value={phoneNumber ?? ""}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
            />
          </div>

          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop Zip Code</label>
            </div>
            <input
              type="number"
              placeholder="Zip code"
              value={zipCode ?? ""}
              onChange={(e) => setZipcode(e.target.value)}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
            />
          </div>

          <div className="w-[100%] cursor-pointer flex items-center flex-col 800px:w-[50%] mt-5 mb-5">
            <button
              type="submit"
              className="bg-brand-primary w-[95%] text-white py-2 rounded-md hover:bg-brand-primary/90 font-semibold"
            >
              Update Shop
            </button>
          </div>
        </form>
        
    </div>
  )
}

export default ShopSettings