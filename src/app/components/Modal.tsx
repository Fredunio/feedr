import React, { useState } from "react";

const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  const overlayClass = isOpen ? "block" : "hidden";

  return (
    <div className={`fixed inset-0 z-10 overflow-y-auto ${overlayClass}`}>
      <div className="flex items-center justify-center min-h-screen">
        <div
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="fixed inset-0 bg-black opacity-50"
        ></div>
        <div className="relative z-10 bg-white p-12 max-w-lg mx-auto rounded-md">
          <button
            type="button"
            title="Close"
            className="absolute top-4 right-4 text-gray-700 hover:text-gray-800"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
