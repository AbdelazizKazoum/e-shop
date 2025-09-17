"use client";

import React, { useState, FormEvent } from "react";
import { Tag, Building, Percent, DollarSign } from "lucide-react";
import CategoriesManager from "@/components/dashboard/categories/CategoriesManager";
import SuppliersManager from "@/components/dashboard/suppliers/SuppliersManager";
import OffersManager from "@/components/dashboard/offers/OffersManager";
import CurrencyManager from "@/components/dashboard/CurrencyManager";
import PageTitle from "@/components/dashboard/PageTitle";

// --- UI COMPONENTS ---

// --- TABS & MAIN PAGE ---
const tabs = [
  { name: "Categories", icon: Tag, component: CategoriesManager },
  {
    name: "Brands",
    icon: Building,
    component: require("@/components/dashboard/brands/BrandsManager").default,
  },
  { name: "Suppliers", icon: Building, component: SuppliersManager },
  { name: "Offers", icon: Percent, component: OffersManager },
  { name: "Currency", icon: DollarSign, component: CurrencyManager },
];

export default function ParametersPage() {
  const [activeTab, setActiveTab] = useState(tabs[0].name);
  const ActiveComponent =
    tabs.find((tab) => tab.name === activeTab)?.component || (() => null);
  return (
    <>
      <PageTitle
        title="Parameters"
        subtitle="Manage your store's core settings"
      />
      <div className="mt-8">
        <div className="mb-6 border-b border-neutral-200 dark:border-neutral-700">
          <nav
            className="-mb-px flex space-x-6 overflow-x-auto"
            aria-label="Tabs"
          >
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={` ${
                  activeTab === tab.name
                    ? "border-primary-500 text-primary-500 dark:text-primary-400"
                    : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 dark:hover:text-neutral-300 dark:hover:border-neutral-500"
                } group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap`}
              >
                <tab.icon className="-ml-0.5 mr-2 h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="border rounded-lg nc-dark-box-bg-has-hover p-4 md:p-6">
          <ActiveComponent />
        </div>
      </div>
    </>
  );
}
