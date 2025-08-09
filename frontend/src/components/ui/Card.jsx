import React from "react";

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 shadow-lg ${className}`}
  >
    {children}
  </div>
);

export default Card;
