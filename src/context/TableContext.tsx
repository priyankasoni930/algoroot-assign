
import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import { DataItem, mockItems } from "../utils/mockData";

interface TableContextType {
  items: DataItem[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  searchTerm: string;
  sortField: keyof DataItem | null;
  sortDirection: "asc" | "desc" | null;
  filteredItems: DataItem[];
  displayedItems: DataItem[];
  
  setSearchTerm: (term: string) => void;
  setItemsPerPage: (count: number) => void;
  setCurrentPage: (page: number) => void;
  setSortField: (field: keyof DataItem | null) => void;
  setSortDirection: (direction: "asc" | "desc" | null) => void;
  sortData: (field: keyof DataItem) => void;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export function TableProvider({ children }: { children: React.ReactNode }) {
  const [items] = useState<DataItem[]>(mockItems);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof DataItem | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);

  // Filter items based on search term
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    
    const lowerCaseSearch = searchTerm.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(lowerCaseSearch) ||
      item.category.toLowerCase().includes(lowerCaseSearch) ||
      item.status.toLowerCase().includes(lowerCaseSearch) ||
      item.id.toLowerCase().includes(lowerCaseSearch) ||
      item.value.toString().includes(lowerCaseSearch) ||
      item.createdAt.includes(lowerCaseSearch)
    );
  }, [items, searchTerm]);

  // Sort filtered items
  const sortedItems = useMemo(() => {
    if (!sortField || !sortDirection) return filteredItems;
    
    return [...filteredItems].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  }, [filteredItems, sortField, sortDirection]);

  // Calculate total pages
  const totalPages = useMemo(() => 
    Math.ceil(sortedItems.length / itemsPerPage),
    [sortedItems.length, itemsPerPage]
  );

  // Get current items for pagination
  const displayedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedItems.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedItems, currentPage, itemsPerPage]);

  // Handle sort toggle
  const sortData = useCallback((field: keyof DataItem) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }, [sortField, sortDirection]);

  return (
    <TableContext.Provider
      value={{
        items,
        currentPage,
        itemsPerPage,
        totalPages,
        searchTerm,
        sortField,
        sortDirection,
        filteredItems: sortedItems,
        displayedItems,
        
        setSearchTerm,
        setItemsPerPage,
        setCurrentPage,
        setSortField,
        setSortDirection,
        sortData,
      }}
    >
      {children}
    </TableContext.Provider>
  );
}

export function useTable() {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error("useTable must be used within a TableProvider");
  }
  return context;
}
