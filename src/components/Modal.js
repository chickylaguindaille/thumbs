import React from 'react';

const Modal = ({ isOpen, onClose, children, size = 'w-[90%]' }) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      ></div>
      <div
        className="fixed inset-0 flex items-center justify-center"
        onClick={e => e.stopPropagation()}
        style={{ zIndex: 100 }}
      >
        <div className={`bg-white p-6 rounded-lg shadow-lg ${size} max-w-full max-h-full overflow-auto`}>
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
