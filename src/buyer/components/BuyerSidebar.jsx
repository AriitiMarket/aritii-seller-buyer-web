import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/store/slices/userThunks';
import { toast } from 'react-toastify';
import { BUYER_SIDEBAR } from '@/config/navigation';
import { getNavIcon } from '@/config/navIcons';
import { Avatar } from '@/components/common/ImageWithFallback';
import { MdFirstPage, MdLastPage, MdLogout } from 'react-icons/md';
import { PlaceholderAvatar } from '@/assets';

const BADGE_COLORS = {
  orders: '#75d04b',
  wishlist: 'bg-#cc0c39',
  cart: 'bg-#75d04b',
}

function getBadgeValue(key, cart, wishlist, orders) {
  switch (key) {
    case 'orders':
      return orders.filter(o => {
        const s = (o.orderStatus || o.status || '').toLowerCase();
        return s !== 'delivered' && s !== 'cancelled' && s !== 'completed' && s !== 'failed';
      }).length;
    case 'wishlist':
      return wishlist.length;
    case 'cart':
      return cart.reduce((total, item) => total + (Number(item.quantity) || 1), 0);
    default:
      return 0;
  }
}

const BuyerSidebar = ({ onClose, collapsed = false, onToggleCollapse }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.user);
  const cart = useSelector((state) => state.cart?.cart || []);
  const wishlist = useSelector((state) => state.wishlist?.wishlist || []);
  const orders = useSelector((state) => state.order?.orders || []);

  const logoutHandler = async () => {
    try {
      const res = await dispatch(logoutUser());
      toast.success(res?.message || 'Logged out successfully');
      navigate('/');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Logout failed');
    }
  };

  return (
    <aside
      className={"flex flex-col h-full #141414 border-r #232f3e transition-all duration-300 ease-in-out " + (collapsed ? 'w-[68px]' : 'w-64')}
      aria-label="Buyer navigation"
    >
      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 scrollbar-none" role="navigation" aria-label="Main navigation">
        {BUYER_SIDEBAR.map((it, index) => {
          if (it.section) {
            if (collapsed) return null;
            return (
              <p key={"sec-" + index} className="px-3 pt-4 pb-1.5 text-[10px] font-semibold text-white-variant uppercase tracking-wider">
                {it.section}
              </p>
            );
          }

          const Icon = getNavIcon(it.icon);
          const badgeCount = it.badge ? getBadgeValue(it.badge, cart, wishlist, orders) : 0;
          const badgeColor = it.badge ? BADGE_COLORS[it.badge] || 'bg-text-white-variant' : '';

          return (
            <NavLink
              key={"sec-" + index}
              to={it.to}
              end={it.end}
              onClick={onClose}
              title={collapsed ? it.label : undefined}
              aria-current={it.to ? 'page' : undefined}
              className={({ isActive }) => {
                const base = "flex items-center gap-3 rounded-button transition-all duration-150 font-medium group relative ";
                const collapsedClass = "justify-center px-2 py-2.5";
                const activeClass = "#75d04b-container #141414 shadow-sm border-l-2 border-#75d04b";
                const hoverClass = "text-white hover:#141414-container-low hover:text-white border-l-2 border-transparent";
                return collapsed ? base + collapsedClass : base + (isActive ? activeClass : hoverClass);
              }}
            >
              {Icon && <Icon className="text-[19px] flex-shrink-0" />}
              {!collapsed && <span className=" flex-1">{it.label}</span>}
              {!collapsed && badgeCount > 0 && (
                <span className={`min-w-[18px] h-[18px] px-1 ${badgeColor} text-white text-[10px] font-bold rounded-full flex items-center justify-center`}>
                  {badgeCount > 99 ? '99+' : badgeCount}
                </span>
              )}
              {collapsed && badgeCount > 0 && (
                <span className={`absolute top-1 right-1 w-2 h-2 ${badgeColor} rounded-full`} aria-hidden="true" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User card */}
      {!collapsed && user && (
        <div className="border-t #232f3e p-3 flex-shrink-0">
          <div className="flex items-center gap-2.5 px-1 py-1 rounded-lg">
            <Avatar data={user} fallback={PlaceholderAvatar} alt={user.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className=" font-semibold text-white truncate">{user.name || 'Account'}</p>
              <p className="text-[10px] text-white-variant truncate">{user.email || 'Buyer'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Collapse toggle + Logout */}
      <div className="border-t #232f3e p-2 flex-shrink-0 space-y-1">
        <button
          onClick={logoutHandler}
          className={`flex items-center gap-3 rounded-button w-full #c9d1d9 hover:#141414 hover:bg-#cc0c39/10 font-medium transition-all duration-200 ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}`}
          aria-label="Log out"
        >
          <MdLogout className="text-[18px] flex-shrink-0" />
          {!collapsed && <span className="">Log out</span>}
        </button>

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={`flex items-center gap-3 rounded-button w-full text-white-variant hover:text-white hover:#141414-container-low transition-all duration-200 ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}`}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <MdLastPage size={18} /> : <MdFirstPage size={18} />}
            {!collapsed && <span className="text-[10px]">Collapse</span>}
          </button>
        )}
      </div>
    </aside>
  );
};

export default BuyerSidebar;
