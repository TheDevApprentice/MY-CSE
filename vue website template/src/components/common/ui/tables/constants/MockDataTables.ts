import { TableHeader, TableItem } from "../types/types";

export const mockHeaders: TableHeader[] = [
  { text: "ID", value: "id", sortable: true, width: 100 },
  {
    text: "Utilisateur",
    value: "name",
    type: "image",
    imageField: "avatar",
  },
  { text: "Email", value: "email", sortable: true },
  {
    text: "Status",
    value: "status",
    sortable: false,
    align: "left",
    color: true,
  },
  {
    text: "Date",
    value: "date",
    sortable: true,
    align: "left",
  },
  {
    text: "Value",
    value: "value",
    sortable: true,
    align: "left",
    format: "currency",
  },
];

// Generate mock data rows
export const generateMockData = (count = 50): TableItem[] => {
  const statuses = ["Active", "In Validation", "Suspended", "Verified"];
  const mockData: TableItem[] = [];

  for (let i = 1; i <= count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    mockData.push({
      id: i,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      date: date.toLocaleDateString("fr-FR"),
      value: Math.floor(Math.random() * 10000) / 100,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    });
  }

  return mockData;
};

// Pre-generated mock data for immediate use
export const mockData = generateMockData();

// Export as mockTableData for backward compatibility
export const mockTableData = {
  headers: mockHeaders,
  items: mockData,
};

// Helper function to get paginated data
export const getPaginatedData = (
  data: TableItem[],
  page: number,
  itemsPerPage: number
) => {
  const start = (page - 1) * itemsPerPage;
  return data.slice(start, start + itemsPerPage);
};
