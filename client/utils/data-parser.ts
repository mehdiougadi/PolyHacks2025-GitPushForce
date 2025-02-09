import { Farm_Item_Prices, Farm_Item_Quantities } from '../data';

interface DataPoint {
  date: Date;
  value: number;
}

export const parsePriceData = (itemName: string): DataPoint[] => {
  return Farm_Item_Prices.map(row => ({
    date: new Date(row[0]),
    value: row[itemName as keyof typeof Farm_Item_Prices[0]] as number
  }));
};

export const parseQuantityData = (itemName: string): DataPoint[] => {
  return Farm_Item_Quantities.map(row => ({
    date: new Date(row[0]),
    value: row[itemName as keyof typeof Farm_Item_Quantities[0]] as number
  }));
};
