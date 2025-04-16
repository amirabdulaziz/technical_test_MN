import React, { useEffect,useState } from "react";
import { widget } from "../components/Widget";

import { getListOfProducts } from "../api/api";

interface Product {
  id: number;
  name: string;
  price: number;
  weight: number;
}

interface Package {
  items: Product[];
  totalWeight: number;
  totalPrice: number;
  courierPrice: number;
}


const calculateCourierCharge = (weight: number): number => {
  if (weight <= 200) return 5;
  if (weight <= 500) return 10;
  if (weight <= 1000) return 15;
  return 20;
};

const PRICE_LIMIT = 250;

const ProductListPage: React.FC = () => {

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedItems, setSelectedItems] = useState<Product[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getListOfProducts();
        setProducts(res.data); 
        console.log("Fetched products:", res.data); 
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, []);


  const handleCheckboxChange = (item: Product) => {
    const exists = selectedItems.find((i) => i.id === item.id);
    if (exists) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handlePlaceOrder = async () => {
    const result = await widget.confirm(
      "Confirm Order",
      "Are you sure you want to place this order?",
      "Yes, place it!"
    );

    if (result.isConfirmed) {
      await widget.alertSuccess(
        "Order Placed",
        "Your order has been placed successfully!"
      );

      const totalPrice = selectedItems.reduce(
        (sum, item) => sum + item.price,
        0
      );
      const totalWeight = selectedItems.reduce(
        (sum, item) => sum + item.weight,
        0
      );

      let resultPackages: Package[] = [];

      // rule 1st
      if (totalPrice <= PRICE_LIMIT) {
        resultPackages.push({
          items: selectedItems,
          totalPrice,
          totalWeight,
          courierPrice: calculateCourierCharge(totalWeight),
        });

      } else {
        const itemsSorted = [...selectedItems].sort(
          (a, b) => b.price - a.price
        );

        let tempPackages: Package[] = [];

        for (const item of itemsSorted) {
          let placed = false;
          for (const pkg of tempPackages) {
            // rule 3rd
            if (pkg.totalPrice + item.price < PRICE_LIMIT) {
              pkg.items.push(item);
              pkg.totalPrice += item.price;
              pkg.totalWeight += item.weight;
              placed = true;
              break;
            }
          }

          if (!placed) {
            tempPackages.push({
              items: [item],
              totalPrice: item.price,
              totalWeight: item.weight,
              courierPrice: 0,
            });
            
          }
        }
        // rule 2nd
        const averageWeight = totalWeight / tempPackages.length;
        tempPackages = tempPackages.map((pkg) => ({
          ...pkg,
          courierPrice: calculateCourierCharge(averageWeight),
          totalWeight: averageWeight,
        }));
        

        resultPackages = tempPackages;
      }

      setPackages(resultPackages);
    }
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

      <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 border border-slate-300 bg-white rounded-lg bg-clip-border">
        <table className="w-full text-center table-auto min-w-max">
          <thead>
            <tr>
              <th className="p-4 border-b border-slate-300 bg-slate-50 font-bold ">
                Select
              </th>
              <th className="p-4 border-b border-slate-300 bg-slate-50 font-bold ">
                Name
              </th>
              <th className="p-4 border-b border-slate-300 bg-slate-50 font-bold ">
                Price ($)
              </th>
              <th className="p-4 border-b border-slate-300 bg-slate-50  ">
                Weight (g)
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="p-4 border-b border-slate-200">
                  <input
                    checked={selectedItems.some((i) => i.id === item.id)}
                    onChange={() => handleCheckboxChange(item)}
                    id="default-checkbox"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-md focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </td>
                <td className="p-4 border-b border-slate-200">{item.name}</td>
                <td className="p-4 border-b border-slate-200">${item.price}</td>
                <td className="p-4 border-b border-slate-200">
                  {item.weight}g
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end">
        <button
          className={`mt-4 px-6 py-2 rounded-lg text-white font-medium transition ${
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
      {packages.length > 0 && (
    <div className="pb-4 space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">
        This order has the following packages:
      </h3>
      <div className="border border-slate-300 bg-slate-40 rounded-md">
          {packages.map((pkg, idx) => (
            <div key={idx} className="w-full px-4 py-4">
              <h4 className="font-bold mb-2">Package {idx + 1}</h4>

              <div className="flex justify-between gap-2">
                <p className="font-bold text-md">Items:</p>
                <p className="text-right text-md">
                  {pkg.items.map((item) => item.name).join(', ')}
                </p>
              </div>

              <div className="flex justify-between gap-2">
                <p className="font-bold text-md">Total Weight:</p>
                <p className="text-right text-ms">{pkg.totalWeight.toFixed(0)}g</p>
              </div>

              <div className="flex justify-between gap-2">
                <p className="font-bold text-md">Total Price:</p>
                <p className="text-right text-md">${pkg.totalPrice.toFixed(2)}</p>
              </div>

              <div className="flex justify-between gap-2">
                <p className="font-bold text-md">Courier Price:</p>
                <p className="text-right">${pkg.courierPrice}</p>
              </div>

              {idx !== packages.length - 1 && (
                <hr className="mt-4 border-slate-300" />
              )}
            </div>
          ))}
        </div>


    </div>
  )}

    </div>
  );
};

export default ProductListPage;
