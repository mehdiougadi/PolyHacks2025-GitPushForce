import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme, VictoryTooltip, VictoryVoronoiContainer } from 'victory-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

interface DataScreenProps {
  itemName: string;
  prices: { date: Date; value: number }[];
  quantities: { date: Date; value: number }[];
  category: string;
}

export const DataScreen = ({ itemName, prices, quantities, category }: DataScreenProps) => {
  const [displayType, setDisplayType] = useState<'price' | 'quantity'>('price');
  const [timeRange, setTimeRange] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const router = useRouter();

  const handleBack = () => {
    router.navigate({
      pathname: '/(app)/inventory/items' as any,
      params: { category: category.toLowerCase() },
    });
  };

  const getData = () => displayType === 'price' ? prices : quantities;

  const filterData = (data: { date: Date; value: number }[]) => {
    const now = new Date();
    const cutoffDate = new Date(now);
    
    switch (timeRange) {
      case 'monthly':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarterly':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case 'yearly':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return data.filter(d => new Date(d.date) > cutoffDate);
  };

  const TimeRangeButton = ({ title, value }: { title: string; value: typeof timeRange }) => (
    <Pressable
      style={[
        styles.timeRangeButton,
        timeRange === value && styles.timeRangeButtonActive
      ]}
      onPress={() => setTimeRange(value)}
    >
      <Text style={[
        styles.timeRangeButtonText,
        timeRange === value && styles.timeRangeButtonTextActive
      ]}>
        {title}
      </Text>
    </Pressable>
  );

  const DisplayTypeButton = ({ title, value }: { title: string; value: typeof displayType }) => (
    <Pressable
      style={[
        styles.displayTypeButton,
        displayType === value && styles.displayTypeButtonActive
      ]}
      onPress={() => setDisplayType(value)}
    >
      <Text style={[
        styles.displayTypeButtonText,
        displayType === value && styles.displayTypeButtonTextActive
      ]}>
        {title}
      </Text>
    </Pressable>
  );

  const filteredData = filterData(getData());

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.tint} />
        </Pressable>
        <Text style={styles.title}>{itemName}</Text>
      </View>

      <View style={styles.displayTypeContainer}>
        <DisplayTypeButton title="Price" value="price" />
        <DisplayTypeButton title="Quantity" value="quantity" />
      </View>

      <View style={styles.timeRangeContainer}>
        <TimeRangeButton title="1M" value="monthly" />
        <TimeRangeButton title="3M" value="quarterly" />
        <TimeRangeButton title="1Y" value="yearly" />
      </View>

      <View style={styles.chartContainer}>
        <VictoryChart
          theme={VictoryTheme.material}
          padding={{ top: 20, bottom: 50, left: 60, right: 20 }}
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension="x"
              labels={({ datum }) => 
                `${new Date(datum.date).toLocaleDateString()}\n${
                  displayType === 'price' ? '$' : ''
                }${datum.value.toFixed(2)}${
                  displayType === 'quantity' ? ' units' : ''
                }`
              }
              labelComponent={
                <VictoryTooltip
                  cornerRadius={5}
                  flyoutStyle={{
                    fill: 'white',
                    stroke: Colors.light.tint,
                    strokeWidth: 1,
                  }}
                />
              }
            />
          }
        >
          <VictoryAxis
            tickFormat={(x: number) => 
              new Date(x).toLocaleDateString('en-US', { 
                month: 'short',
                day: timeRange === 'yearly' ? undefined : 'numeric'
              })
            }
            style={{
              tickLabels: { angle: -45, fontSize: 10, padding: 15 }
            }}
          />
          <VictoryAxis
            dependentAxis
            label={displayType === 'price' ? 'Price ($)' : 'Quantity'}
            style={{
              axisLabel: { padding: 35 }
            }}
          />
          <VictoryLine
            data={filteredData}
            x="date"
            y="value"
            style={{
              data: { 
                stroke: Colors.light.tint,
                strokeWidth: 2
              }
            }}
            animate={{
              duration: 300,
              onLoad: { duration: 300 }
            }}
          />
        </VictoryChart>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Average</Text>
          <Text style={styles.statValue}>
            {displayType === 'price' ? '$' : ''}
            {(filteredData.reduce((sum, item) => sum + item.value, 0) / filteredData.length).toFixed(2)}
            {displayType === 'quantity' ? ' units' : ''}
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>
            {displayType === 'price' ? 'Highest Price' : 'Max Quantity'}
          </Text>
          <Text style={styles.statValue}>
            {displayType === 'price' ? '$' : ''}
            {Math.max(...filteredData.map(item => item.value)).toFixed(2)}
            {displayType === 'quantity' ? ' units' : ''}
          </Text>
        </View>
      </View>
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
  displayTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
  },
  displayTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    minWidth: 100,
    alignItems: 'center',
  },
  displayTypeButtonActive: {
    backgroundColor: Colors.light.tint,
  },
  displayTypeButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  displayTypeButtonTextActive: {
    color: 'white',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 16,
  },
  timeRangeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    minWidth: 60,
    alignItems: 'center',
  },
  timeRangeButtonActive: {
    backgroundColor: Colors.light.tint,
  },
  timeRangeButtonText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  timeRangeButtonTextActive: {
    color: 'white',
  },
  chartContainer: {
    flex: 1,
    marginHorizontal: -16,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});