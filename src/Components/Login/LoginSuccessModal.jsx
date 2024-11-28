import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginSuccessModal = ({ isOpen, onClose }) => {
  const modalRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
        navigate("/");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-lg py-16 px-14 w-[30% ] h-[76%] flex flex-col justify-center items-center gap-5 max-w-[428px] max-h-[328px]"
      >
        <div className="text-center w-[64px] h-[64px] py-[10.5px] pl-[15px] pr-[14px] flex  justify-center items-center bg-[#F4EBFF] rounded-[42.3px]">
          <p className="text-[35px] leading-[42px] font-normal text-center">
            🎉
          </p>
        </div>
        <div className="flex  flex-col gap-2 text-center font-figtree">
          <h2 className="text-2xl font-semibold  leading-loose tracking-[-0.48px] text-[#252525] ">
            Welcome!
          </h2>
          <p className="text-sm  font-normal leading-tight text-[#AFAFAF]">
            Successfully logged in. Time to explore and thrive!
          </p>
        </div>
        <div className="w-full ">
          <button
            onClick={onClose}
            className="w-full h-[2.75rem] rounded-[0.5rem] text-[#ffffff] font-[600] text-sm"
            style={{
              background:
                "var(--Quest-Hive, linear-gradient(180deg, #4C4CFF 0%, #7B5CF7 100%))",
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
export default LoginSuccessModal;
