import React from "react";

// --- 1. Define the component and destructure its props ---
const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
}) => {
  // --- 2. Define base styles and variant-specific styles ---
  const baseClasses =
    "px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed",
    secondary:
      "bg-gray-700 text-white hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed",
    danger:
      "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed",
  };

  // --- 3. Combine the classes and render the button element ---
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
