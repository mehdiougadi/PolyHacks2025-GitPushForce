export interface InventoryItem {
    id: number;
    name: string;
    unit: string;
    quantity?: number;
    minStock?: number;
  }
  
export interface InventoryCategory {
    name: string;
    items: InventoryItem[];
  }
  
export const INVENTORY_CATEGORIES: InventoryCategory[] = [
    {
        "name": "Seeds",
        "items": [
          { "id": 1, "name": "Corn Seeds", "unit": "kg" },
          { "id": 2, "name": "Wheat Seeds", "unit": "kg" },
          { "id": 3, "name": "Soybean Seeds", "unit": "kg" },
          { "id": 4, "name": "Tomato Seeds", "unit": "packets" },
          { "id": 5, "name": "Carrot Seeds", "unit": "packets" }
        ]
      },
      {
        "name": "Fertilizers",
        "items": [
          { "id": 6, "name": "Nitrogen Fertilizer", "unit": "kg" },
          { "id": 7, "name": "Phosphorus Fertilizer", "unit": "kg" },
          { "id": 8, "name": "Potassium Fertilizer", "unit": "kg" },
          { "id": 9, "name": "Organic Compost", "unit": "bags" }
        ]
      },
      {
        "name": "Pesticides",
        "items": [
          { "id": 10, "name": "Herbicide", "unit": "liters" },
          { "id": 11, "name": "Fungicide", "unit": "liters" },
          { "id": 12, "name": "Insecticide", "unit": "liters" }
        ]
      },
      {
        "name": "Tools & Equipment",
        "items": [
          { "id": 13, "name": "Shovel", "unit": "pieces" },
          { "id": 14, "name": "Hoe", "unit": "pieces" },
          { "id": 15, "name": "Tractor", "unit": "pieces" },
          { "id": 16, "name": "Irrigation Pump", "unit": "pieces" },
          { "id": 17, "name": "Sprayer", "unit": "pieces" }
        ]
      },
      {
        "name": "Animal Feed",
        "items": [
          { "id": 18, "name": "Cattle Feed", "unit": "kg" },
          { "id": 19, "name": "Poultry Feed", "unit": "kg" },
          { "id": 20, "name": "Goat Feed", "unit": "kg" },
          { "id": 21, "name": "Fish Feed", "unit": "kg" }
        ]
      },
      {
        "name": "Livestock & Poultry",
        "items": [
          { "id": 22, "name": "Dairy Cows", "unit": "heads" },
          { "id": 23, "name": "Goats", "unit": "heads" },
          { "id": 24, "name": "Chickens", "unit": "birds" },
          { "id": 25, "name": "Sheep", "unit": "heads" }
        ]
      },
      {
        "name": "Fuel & Maintenance",
        "items": [
          { "id": 26, "name": "Diesel Fuel", "unit": "liters" },
          { "id": 27, "name": "Gasoline", "unit": "liters" },
          { "id": 28, "name": "Engine Oil", "unit": "liters" },
          { "id": 29, "name": "Tractor Spare Parts", "unit": "varies" }
        ]
      },
      {
        "name": "Storage & Packaging",
        "items": [
          { "id": 30, "name": "Grain Sacks", "unit": "pieces" },
          { "id": 31, "name": "Wooden Crates", "unit": "pieces" },
          { "id": 32, "name": "Plastic Bins", "unit": "pieces" }
        ]
      },
      {
        "name": "Irrigation Supplies",
        "items": [
          { "id": 33, "name": "Drip Irrigation Pipes", "unit": "meters" },
          { "id": 34, "name": "Sprinklers", "unit": "pieces" },
          { "id": 35, "name": "Water Tanks", "unit": "liters" }
        ]
      }
  ];