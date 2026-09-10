import React from "react";

const Loader = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="relative w-[80px] h-[80px]">
        <div className="absolute inset-0 border-4 border-brand-border rounded-full" />
        <div className="absolute inset-0 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
};

export default Loader;