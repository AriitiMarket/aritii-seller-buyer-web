import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DataGrid } from "@mui/x-data-grid";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import Loader from '@/components/common/Loading';
import { getAllOrdersOfShop } from '@/store/slices/orderThunks';
import { normalizeStatus, isRefundStatus, ORDER_STATUSES } from '@/shared/utils/orderStatus';

const AllRefundOrders = () => {
  const { ShopOrders=[], isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    const sellerUserId = seller?.id || seller?._id;
    if (sellerUserId) {
      dispatch(getAllOrdersOfShop(sellerUserId));
    }
  }, [dispatch, seller]);

  // Refund HISTORY = only orders in a refund state (requested by the buyer and
  // then approved/rejected — normally by admin). Plain Delivered orders are not
  // refunds, so they must NOT appear here (they live on the Orders page).
  // Matching goes through normalizeStatus so legacy spellings are caught too.
  const refundOrders = (ShopOrders || []).filter((item) => isRefundStatus(item.status));

  const columns = [
    { field: "id",
      headerName: "Order ID",
      minWidth: 150,
      flex: 0.7 
    },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => {
        const s = normalizeStatus(params.row?.status);
        const success = s === ORDER_STATUSES.REFUND_SUCCESS || s === ORDER_STATUSES.DELIVERED;
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {s}
          </span>
        );
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/business/orders/${params.id}`}>
              <button>
                <AiOutlineArrowRight size={20} />
              </button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

   refundOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart?.length || 0,
        total: "ETB " + item.totalPrice,
        status: item.status,
      });
    });


    
    if (!isLoading && refundOrders.length === 0) {
      return (
        <div className="text-center py-12 px-4">
          <p className="text-gray-500 text-base mb-1">No refund requests found</p>
          <p className="text-gray-400 text-sm">When customers request refunds for items from your shop, they will show up here.</p>
        </div>
      );
    }

  return (
    <>
    {
      isLoading ? (
        <Loader />
      ) : (
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          autoHeight
          disableSelectionOnClick
        />
      )
    }
    </>
  )
}

export default AllRefundOrders
