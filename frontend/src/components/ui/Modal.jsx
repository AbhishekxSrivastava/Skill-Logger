import React from "react";
import { XCircle } from "lucide-react";

const Modal = ({ isOpen, onClose, children }) => {
  // 1. If the modal isn't open, render nothing.
  if (!isOpen) return null;

  // 2. If it is open, render the modal structure.
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <XCircle size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
