import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  useWindowDimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import SansitaText from '../texts/sansita-text';

interface DataScreenProps {
  itemName: string;
  prices: { date: Date; value: number }[];
  quantities: { date: Date; value: number }[];
  category: string;
}

export const DataScreen = ({ itemName, prices, quantities, category }: DataScreenProps) => {
  const { width } = useWindowDimensions();
  const chartWidth = width - 32;
  const isWeb = Platform.OS === 'web';
  const adjustedChartWidth = isWeb ? chartWidth * 0.95 : chartWidth;

  const [displayType, setDisplayType] = useState<'price' | 'quantity'>('price');
  const [timeRange, setTimeRange] = useState<'month' | 'threeMonths' | 'sixMonths'>('month');
  const router = useRouter();

  const handleBack = () => {
    router.navigate({
      pathname: '/(app)/inventory/items' as any,
      params: { category: category.toLowerCase() },
    });
  };

  const getData = () => (displayType === 'price' ? prices : quantities);

  const filterData = (data: { date: Date; value: number }[]) => {
    const now = new Date();
    const cutoffDate = new Date(now);

    switch (timeRange) {
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'threeMonths':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case 'sixMonths':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
    }
    return data.filter((d) => new Date(d.date) > cutoffDate);
  };

  const filteredData = filterData(getData());
  const averagePrice = (filteredData.reduce((sum, item) => sum + item.value, 0) / filteredData.length).toFixed(2);
  const highestPrice = Math.max(...filteredData.map((item) => item.value)).toFixed(2);

  const TimeRangeButton = ({ title, value }: { title: string; value: typeof timeRange }) => (
    <Pressable
      style={({ pressed }) => [
        styles.timeRangeButton,
        timeRange === value && styles.timeRangeButtonActive,
        pressed && { opacity: 0.7 },
      ]}
      onPress={() => {
        setTimeRange(value);
      }}
    >
      <Text style={[styles.timeRangeButtonText, timeRange === value && styles.timeRangeButtonTextActive]}>
        {title}
      </Text>
    </Pressable>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.tint} />
        </Pressable>
        <Text style={styles.title}>{itemName}</Text>
      </View>
      <View style={styles.timeRangeContainer}>
        <TimeRangeButton title="1M" value="month" />
        <TimeRangeButton title="3M" value="threeMonths" />
        <TimeRangeButton title="6M" value="sixMonths" />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.chartContainer}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <SansitaText text={'Graphical value in the market'} lineHeight='auto' fontSize='16'></SansitaText>
          </View>
          <LineChart
            data={{
              labels: filteredData.map((d) =>
                new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
              ),
              datasets: [{
                data: filteredData.map((d) => d.value),
                color: () => 'green',
                strokeWidth: 2,
              }],
            }}
            width={adjustedChartWidth}
            height={300}
            chartConfig={{
              backgroundGradientFrom: '#f8f8f8',
              backgroundGradientTo: '#f8f8f8',
              color: (opacity = 1) => `rgba(34, 139, 34, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: 'green',
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Average Price</Text>
            <Text style={styles.statValue}>${averagePrice}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Highest Price</Text>
            <Text style={styles.statValue}>${highestPrice}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  statsContainer: {
    flexDirection: 'column',
    gap: 16,
    width:'100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  statBox: {
    backgroundColor: '#f8f8f8',
    maxWidth: 600,
    width: '95%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  statLabel: {
    color: '#666',
    fontSize: 18,
    marginBottom: 4,
  },
  statValue: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
  },
  timeRangeButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    minWidth: 80,
    alignItems: 'center',
  },
  timeRangeButtonActive: {
    backgroundColor: '#006400',
  },
  timeRangeButtonText: {
    color: '#333',
    fontSize: 16,
  },
  timeRangeButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  scrollContainer: { 
    paddingBottom: 20 
  },
  chartContainer: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
