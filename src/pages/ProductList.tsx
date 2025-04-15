import React, { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  weight: number;
}

const sampleItems: Product[] = [
  { id: 1, name: "Item 1", price: 100, weight: 200 },
  { id: 2, name: "Item 2", price: 120, weight: 300 },
  { id: 3, name: "Item 3", price: 90, weight: 150 },
  { id: 4, name: "Item 4", price: 80, weight: 180 },
];

const ProductListPage: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<Product[]>([]);

  const handleCheckboxChange = (item: Product) => {
    const exists = selectedItems.find((i) => i.id === item.id);
    if (exists) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handlePlaceOrder = () => {
    console.log("Selected Items:", selectedItems);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="w-full mb-4">
        <h3 className="text-lg font-semibold text-slate-800">
          Select Items to Order
        </h3>
        <p className="text-slate-500">
          Choose the products you’d like to order from the list below.
        </p>
      </div>

      <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              <th className="p-4 border-b border-slate-300 bg-slate-50">
                <p className="block text-sm font-normal leading-none text-slate-500">
                  Select
                </p>
              </th>
              <th className="p-4 border-b border-slate-300 bg-slate-50">
                <p className="block text-sm font-normal leading-none text-slate-500">
                  Name
                </p>
              </th>
              <th className="p-4 border-b border-slate-300 bg-slate-50">
                <p className="block text-sm font-normal leading-none text-slate-500">
                  Price ($)
                </p>
              </th>
              <th className="p-4 border-b border-slate-300 bg-slate-50">
                <p className="block text-sm font-normal leading-none text-slate-500">
                  Weight (g)
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            {sampleItems.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="p-4 border-b border-slate-200">
                  <input
                    type="checkbox"
                    checked={selectedItems.some((i) => i.id === item.id)}
                    onChange={() => handleCheckboxChange(item)}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                </td>
                <td className="p-4 border-b border-slate-200">
                  <p className="block text-sm text-slate-800">{item.name}</p>
                </td>
                <td className="p-4 border-b border-slate-200">
                  <p className="block text-sm text-slate-800">${item.price}</p>
                </td>
                <td className="p-4 border-b border-slate-200">
                  <p className="block text-sm text-slate-800">{item.weight}g</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className={`mt-6 px-6 py-2 rounded-lg text-white font-medium transition ${
          selectedItems.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        onClick={handlePlaceOrder}
        disabled={selectedItems.length === 0}
      >
        Place Order
      </button>
    </div>
  );
};

export default ProductListPage;
