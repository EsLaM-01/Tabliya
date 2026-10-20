import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <div className="min-h-scree pt-10 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          {/* رقم الخطأ بتصميم بارز */}
          <h1 className="text-9xl font-extrabold text-indigo-600 tracking-widest">
            404
          </h1>

          {/* رسالة الخطأ */}
          <div className="bg-indigo-500 text-white px-2 text-sm rounded rotate-12 absolute inline-block">
            الصفحة غير موجودة
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-2">
            عذراً، لم نتمكن من العثور على هذه الصفحة
          </h2>

          <p className="text-gray-600 mb-8">
            يبدو أن الرابط الذي قمت بزيارته قد تم حذفه، أو تم تغيير مساره، أو
            أنك كتبته بشكل خاطئ.
          </p>

          {/* زر العودة للصفحة الرئيسية */}
          <Link
            to="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </>
  );
}
