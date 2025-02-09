import { 
    Farm_Item_Prices, 
    priceColumns,
  } from '../data/Farm_Item_Prices';

import { 
    Farm_Item_Quantities,
    quantityColumns 
  } from '../data/Farm_Item_Quantities';
  
interface DataPoint {
    date: Date;
    value: number;
  }
  
export const parsePriceData = (itemName: string): DataPoint[] => {
    const columnIndex = priceColumns.indexOf(itemName);
    if (columnIndex === -1) return [];
    
    return Farm_Item_Prices.map(row => ({
      date: new Date(row[0]),
      value: row[columnIndex + 1] as number
    }));
  };
  
export const parseQuantityData = (itemName: string): DataPoint[] => {
    const columnIndex = quantityColumns.indexOf(itemName);
    if (columnIndex === -1) return [];
    
    return Farm_Item_Quantities.map(row => ({
      date: new Date(row[0]),
      value: row[columnIndex + 1] as number
    }));
  };