import { MdDashboard, MdStorefront, MdShoppingBag, MdFavoriteBorder, MdRateReview, MdPerson, MdSettings, MdInventory, MdAddBox, MdShoppingCart, MdHistory, MdReceiptLong, MdLocalOffer, MdEvent, MdAnalytics, MdMessage, MdLocationOn, MdStore, MdExplore, MdLogout, MdNotifications, MdReceipt, MdOutlineShoppingCart, MdHelpOutline, MdMoreHoriz, MdBarChart, MdTrendingUp, MdAssignmentReturn } from 'react-icons/md';

export const NAV_ICONS = {
  MdDashboard,
  MdStorefront,
  MdShoppingBag,
  MdFavoriteBorder,
  MdRateReview,
  MdPerson,
  MdSettings,
  MdInventory,
  MdAddBox,
  MdShoppingCart,
  MdHistory,
  MdReceiptLong,
  MdLocalOffer,
  MdEvent,
  MdAnalytics,
  MdMessage,
  MdLocationOn,
  MdStore,
  MdExplore,
  MdLogout,
  MdNotifications,
  MdReceipt,
  MdOutlineShoppingCart,
  MdHelpOutline,
  MdMoreHoriz,
  MdBarChart,
  MdTrendingUp,
  MdAssignmentReturn,
};

export const getNavIcon = (name) => NAV_ICONS[name] || null;
