const Button = ({ children, type = 'button', className = '', ...props }) => (
  <button 
    type={type} 
    className={`h-11 min-h-11 min-w-[110px] px-5 bg-aritii-green text-white font-semibold text-sm rounded-md shadow-sm hover:bg-aritii-green-dark active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus-visible:ring-2 focus-visible:ring-aritii-green/40 ${className}`} 
    {...props}
  >
    {children}
  </button>
);

export default Button;
