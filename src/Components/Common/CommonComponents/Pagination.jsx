// import React from "react";

// const Pagination = ({ currentPage, totalPages, onPageChange }) => {
//   const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

//   return (
//     <div className="flex justify-center items-center mt-4">
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         className={`px-4 py-2 mx-1 rounded ${
//           currentPage === 1
//             ? "bg-gray-300 text-gray-600"
//             : "bg-blue-500 text-white"
//         }`}
//       >
//         Previous
//       </button>

//       {pageNumbers.map((number) => (
//         <button
//           key={number}
//           onClick={() => onPageChange(number)}
//           className={`px-4 py-2 mx-1 rounded ${
//             number === currentPage
//               ? "bg-blue-500 text-white"
//               : "bg-gray-300 text-gray-600"
//           }`}
//         >
//           {number}
//         </button>
//       ))}

//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         className={`px-4 py-2 mx-1 rounded ${
//           currentPage === totalPages
//             ? "bg-gray-300 text-gray-600"
//             : "bg-blue-500 text-white"
//         }`}
//       >
//         Next
//       </button>
//     </div>
//   );
// };

// export default Pagination;
import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center mt-4">
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-3 py-1 mx-1 rounded border ${
            number === currentPage
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-blue-500 border-blue-500"
          }`}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
