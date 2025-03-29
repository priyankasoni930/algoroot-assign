
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface DataItem {
  id: string;
  name: string;
  category: string;
  value: number;
  status: "Active" | "Inactive" | "Pending";
  createdAt: string;
}

// Generate mock data
export const generateMockData = (count: number = 100): DataItem[] => {
  const categories = ["Technology", "Finance", "Healthcare", "Education", "Entertainment"];
  const statuses: ("Active" | "Inactive" | "Pending")[] = ["Active", "Inactive", "Pending"];
  
  return Array.from({ length: count }, (_, i) => {
    const id = (i + 1).toString().padStart(4, '0');
    const randomDayOffset = Math.floor(Math.random() * 365);
    const date = new Date();
    date.setDate(date.getDate() - randomDayOffset);
    
    return {
      id: `ITEM-${id}`,
      name: `Item ${id}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      value: Math.floor(Math.random() * 10000) / 100,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: date.toISOString().split('T')[0],
    };
  });
};

// Create mock data
export const mockItems = generateMockData();
