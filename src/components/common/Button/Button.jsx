const Button = ({ children, type = 'button', className = '', ...props }) => (
  <button 
    type={type} 
    className={`h-[45px] min-w-[110px] px-5 bg-[#75d04b] text-white font-semibold text-sm rounded-full shadow-none hover:brightness-95 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#75d04b]/40 ${className}`} 
    {...props}
  >
    {children}
  </button>
);

export default Button;
