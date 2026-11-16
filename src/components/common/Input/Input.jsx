const Input = ({ label, id, className = '', ...props }) => (
  <label htmlFor={id} className="block w-full">
    {label && <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</span>}
    <input 
      id={id} 
      className={`w-full rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white px-3 py-2.5 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/25 focus:outline-none transition-all duration-200 ${className}`} 
      {...props} 
    />
  </label>
);

export default Input;
