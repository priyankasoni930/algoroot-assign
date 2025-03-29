
import React from "react";
import { useTable } from "../../context/TableContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataItem } from "../../utils/mockData";

const DataTable = () => {
  const {
    displayedItems,
    currentPage,
    itemsPerPage,
    totalPages,
    searchTerm,
    sortField,
    sortDirection,
    setCurrentPage,
    setItemsPerPage,
    setSearchTerm,
    sortData,
  } = useTable();

  const renderSortIcon = (field: keyof DataItem) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    if (sortDirection === "asc") return <ArrowUp className="ml-2 h-4 w-4" />;
    return <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const handleSort = (field: keyof DataItem) => {
    sortData(field);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Show</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(parseInt(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={itemsPerPage.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">entries</span>
        </div>
      </div>

      <div className="rounded-lg border glass-effect card-shadow overflow-hidden">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("id")} className="cursor-pointer">
                  <div className="flex items-center">
                    ID {renderSortIcon("id")}
                  </div>
                </th>
                <th onClick={() => handleSort("name")} className="cursor-pointer">
                  <div className="flex items-center">
                    Name {renderSortIcon("name")}
                  </div>
                </th>
                <th onClick={() => handleSort("category")} className="cursor-pointer">
                  <div className="flex items-center">
                    Category {renderSortIcon("category")}
                  </div>
                </th>
                <th onClick={() => handleSort("value")} className="cursor-pointer">
                  <div className="flex items-center">
                    Value {renderSortIcon("value")}
                  </div>
                </th>
                <th onClick={() => handleSort("status")} className="cursor-pointer">
                  <div className="flex items-center">
                    Status {renderSortIcon("status")}
                  </div>
                </th>
                <th onClick={() => handleSort("createdAt")} className="cursor-pointer">
                  <div className="flex items-center">
                    Created {renderSortIcon("createdAt")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedItems.length > 0 ? (
                displayedItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>${item.value.toFixed(2)}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : item.status === "Inactive"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>{item.createdAt}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {displayedItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
          {Math.min(currentPage * itemsPerPage, displayedItems.length > 0 ? displayedItems.length + ((currentPage - 1) * itemsPerPage) : 0)} of{" "}
          {displayedItems.length} entries
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              
              if (totalPages <= 5) {
                // If we have 5 or fewer pages, show all
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                // If we're near the start
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                // If we're near the end
                pageNum = totalPages - 4 + i;
              } else {
                // We're in the middle
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
