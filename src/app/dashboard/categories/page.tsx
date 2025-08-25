// app/(dashboard)/categories/page.tsx
import React from "react";

const CategoriesPage = () => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          Categories
        </h3>
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          Add Category
        </button>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Category Name
              </th>
              <th scope="col" className="px-6 py-3">
                Slug
              </th>
              <th scope="col" className="px-6 py-3">
                Product Count
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>{/* Add category rows here */}</tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesPage;
