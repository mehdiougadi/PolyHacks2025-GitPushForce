import { useLocalSearchParams } from 'expo-router';
import { DataScreen } from '@client/components/screens/data-screen';
import { parsePriceData, parseQuantityData } from '@client/utils/data-parser';

export default function ItemDataScreen() {
  const { item } = useLocalSearchParams();
  
  const prices = parsePriceData(item as string);
  const quantities = parseQuantityData(item as string);

  return (
    <DataScreen 
      itemName={item as string}
      prices={prices}
      quantities={quantities}
    />
  );
}