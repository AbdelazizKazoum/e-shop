"use client";

import React, { useState, useEffect, FormEvent, useMemo, useRef } from "react";
import {
  ChevronDown,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit,
  RefreshCw,
  PlusCircle,
  ArrowUp,
  ArrowDown,
  X,
  User,
  Tag as TagIcon,
  FileText,
  Building,
} from "lucide-react";
import VariantSelect from "@/components/dashboard/movement/VariantSelect";
import {
  StockMovement,
  StockMovementReason,
  StockMovementType,
  Supplier,
  SupplyOrder,
} from "@/types/stockMovement";
import { StockVariant } from "@/types/stock";
import PageTitle from "@/components/dashboard/PageTitle";
import Select from "@/components/ui/form/Select";
import Input from "@/components/ui/form/Input";
import Pagination from "@/components/dashboard/Pagination";
import AddMovementModal from "@/components/dashboard/movement/modals/AddMovementModal";
import { useMovementStore } from "@/stores/movementStore";
import Image from "next/image";
import StockMovementList from "@/components/dashboard/movement/List";
import StockMovementListSkeleton from "@/components/dashboard/movement/tListSkeleton";
import StockMovementDetailsModal from "@/components/dashboard/movement/modals/DetailsModal";
import FilterHeader from "@/components/dashboard/movement/FilterHeader";

// --- MAIN PAGE COMPONENT ---
export default function StockMovementsPage() {
  const {
    movements,
    loading,
    error,
    currentPage,
    totalMovements,
    totalPages,
    fetchAllMovements,
    setPage,
  } = useMovementStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingMovement, setViewingMovement] = useState<any>(null);

  // Initial data fetch
  useEffect(() => {
    fetchAllMovements();
  }, [fetchAllMovements]);

  // Handle search and filter changes
  useEffect(() => {
    const searchFilters = { ...filters };
    if (searchTerm) {
      searchFilters.variantId = searchTerm;
    }
    fetchAllMovements({ ...searchFilters, page: 1 });
  }, [searchTerm, filters, fetchAllMovements]);

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleRefresh = () => {
    fetchAllMovements({
      ...filters,
      ...(searchTerm && { variantId: searchTerm }),
    });
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleMovementCreated = () => {
    // Refresh the list after creating a new movement
    handleRefresh();
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          Error loading movements: {error}
        </div>
        <button
          onClick={handleRefresh}
          className="rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <PageTitle
          title="Stock Movements"
          subtitle={`History of all inventory changes (${totalMovements} records)`}
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600"
        >
          <PlusCircle size={18} /> Add Movement
        </button>
      </div>
      <div className="mt-8">
        <FilterHeader
          onFilter={handleFilter}
          onSearch={handleSearch}
          onRefresh={handleRefresh}
        />
        <div className="border rounded-lg nc-dark-box-bg-has-hover p-0 md:p-6">
          {loading ? (
            <StockMovementListSkeleton />
          ) : (
            <StockMovementList
              movements={movements}
              onViewMovement={setViewingMovement}
            />
          )}
          {!loading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
      {isModalOpen && (
        <AddMovementModal
          onClose={() => {
            setIsModalOpen(false);
            handleMovementCreated();
          }}
        />
      )}
      {viewingMovement && (
        <StockMovementDetailsModal
          movement={viewingMovement}
          onClose={() => setViewingMovement(null)}
        />
      )}
    </>
  );
}
