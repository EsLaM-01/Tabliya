// import React from "react";
// import { ClipLoader, RingLoader, PulseLoader } from "react-spinners";
import { TailSpin } from "react-loader-spinner";

export default function IsLoding() {
  return (
    <>
      {/* <ClipLoader color="#36d7b7" size={50} />{" "} */}
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="flex flex-col items-center gap-4">
          <TailSpin
            visible={true}
            color="#4E38F7"
            height={80}
            width={80}
            ariaLabel="tail-spin-loading"
          />
          <p className="text-gray-600 font-medium">Loading, please wait...</p>
        </div>
      </div>
    </>
  );
}
