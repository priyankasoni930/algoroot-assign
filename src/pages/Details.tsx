
import React from "react";
import { TableProvider } from "../context/TableContext";
import DataTable from "../components/ui/DataTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

const Details = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Details</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your data with advanced table features.
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleTheme}
          className="rounded-full hover:bg-secondary"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
        </Button>
      </div>
      
      <Card className="shadow-md border-opacity-50 hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">Data Table</CardTitle>
          <CardDescription>
            Manage your data with sorting, filtering, and pagination.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TableProvider>
            <DataTable />
          </TableProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default Details;
