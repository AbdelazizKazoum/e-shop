import { useState } from "react";
import Select from "../ui/form/Select";

// 4. Currency Manager
const CurrencyManager = () => {
  const [currency, setCurrency] = useState("USD");
  const handleSave = () => {
    console.log("Saving currency:", currency);
    alert("Currency saved!");
  };
  return (
    <div className="max-w-md mx-auto">
      <h3 className="text-lg font-medium mb-4">Store Currency</h3>
      <p className="text-sm text-neutral-500 mb-4">
        This is the main currency for your store. Prices will be displayed in
        this currency.
      </p>
      <Select
        label="Select Currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      >
        <option value="USD">USD - United States Dollar</option>
        <option value="EUR">EUR - Euro</option>
        <option value="GBP">GBP - British Pound</option>
        <option value="JPY">JPY - Japanese Yen</option>
        <option value="MAD">MAD - Moroccan Dirham</option>
      </Select>
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="rounded-md bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
        >
          Save Currency
        </button>
      </div>
    </div>
  );
};

export default CurrencyManager;
