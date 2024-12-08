import React from 'react';

const Forbidden = () => {
  return (
    <div className=" w-full flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold">403 Forbidden</h1>
        <p>Bạn không có quyền truy cập vào trang này.</p>
      </div>
    </div>
  );
};

export default Forbidden;
