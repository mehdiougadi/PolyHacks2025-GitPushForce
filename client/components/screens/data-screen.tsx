import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import {
  VictoryChart,
  VictoryArea,
  VictoryAxis,
  VictoryTheme,
  VictoryTooltip,
  createContainer,
} from 'victory-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { Colors } from '../../constants/Colors';
import { Defs, LinearGradient,Stop } from 'react-native-svg';

// Create combined container for zoom and tooltips
const VictoryZoomVoronoiContainer = createContainer('voronoi', 'zoom');

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
  const [chartHeight, setChartHeight] = useState(300);
  const router = useRouter();

  // Dropdown state
  const [open, setOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [items] = useState([
    { label: 'Monthly', value: 'monthly' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Yearly', value: 'yearly' },
  ]);

  const handleBack = () => {
    router.navigate({
      pathname: '/(app)/inventory/items' as any,
      params: { category: category.toLowerCase() },
    });
  };

  const getData = () => (displayType === 'price' ? prices : quantities);

  // Aggregate data by month
  const aggregateData = (data: { date: Date; value: number }[]) => {
    const monthlyData = data.reduce((acc, item) => {
      const date = new Date(item.date);
      const monthKey = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
      
      if (!acc[monthKey]) {
        acc[monthKey] = { total: 0, count: 0, date: new Date(monthKey) };
      }
      acc[monthKey].total += item.value;
      acc[monthKey].count++;
      return acc;
    }, {} as Record<number, { total: number; count: number; date: Date }>);

    return Object.values(monthlyData).map(({ total, count, date }) => ({
      date,
      value: total / count,
    }));
  };

  // Filter aggregated data based on time range
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

    return data.filter((d) => new Date(d.date) >= cutoffDate);
  };

  const processedData = filterData(aggregateData(getData()));
  const maxValue = Math.max(...processedData.map(d => d.value), 0);
  const yDomain = [0, maxValue * 1.2];

  const DisplayTypeButton = ({ title, value }: { title: string; value: typeof displayType }) => (
    <Pressable
      style={[
        styles.displayTypeButton,
        displayType === value && styles.displayTypeButtonActive,
      ]}
      onPress={() => setDisplayType(value)}
    >
      <Text
        style={[
          styles.displayTypeButtonText,
          displayType === value && styles.displayTypeButtonTextActive,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.container, isWeb && StyleSheet.absoluteFill]}>
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

      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={open}
          value={timeRange}
          items={items}
          setOpen={setOpen}
          setValue={setTimeRange}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownList}
          labelStyle={styles.dropdownLabel}
          zIndex={3000}
          zIndexInverse={1000}
        />
      </View>

      <View
        style={styles.chartContainer}
        onLayout={(event) => setChartHeight(event.nativeEvent.layout.height)}
      >
        <VictoryChart
          width={adjustedChartWidth}
          height={chartHeight}
          theme={VictoryTheme.material}
          padding={{ top: 20, bottom: 50, left: 60, right: 20 }}
          domain={{ y: yDomain }}
          containerComponent={
            <VictoryZoomVoronoiContainer
              voronoiDimension="x"
              labels={({ datum }) =>
                `${new Date(datum.date).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}\n${displayType === 'price' ? '$' : ''}${datum.value.toFixed(2)}${
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
              zoomDimension="x"
              allowZoom={false}
            />
          }
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={Colors.light.tint} stopOpacity={0.4} />
              <stop offset="100%" stopColor={Colors.light.tint} stopOpacity={0} />
            </linearGradient>
          </defs>

          <VictoryAxis
            tickFormat={(x) =>
              new Date(x).toLocaleDateString('en-US', { month: 'short' })
            }
            style={{
              tickLabels: { angle: -45, fontSize: 10, padding: 15 },
              grid: { stroke: '#e0e0e0', strokeWidth: 0.5 },
            }}
          />

          <VictoryAxis
            dependentAxis
            label={displayType === 'price' ? 'Price ($)' : 'Quantity'}
            style={{
              axisLabel: { padding: 35 },
              grid: { stroke: '#e0e0e0', strokeWidth: 0.5 },
            }}
          />

          <VictoryArea
            data={processedData}
            x="date"
            y="value"
            interpolation="natural"
            style={{
              data: {
                fill: 'url(#areaGradient)',
                stroke: Colors.light.tint,
                strokeWidth: 2,
              },
            }}
            animate={{
              duration: 300,
              onLoad: { duration: 300 },
            }}
          />
        </VictoryChart>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Average</Text>
          <Text style={styles.statValue}>
            {displayType === 'price' ? '$' : ''}
            {processedData.length > 0
              ? (processedData.reduce((sum, item) => sum + item.value, 0) / processedData.length).toFixed(2)
              : 'N/A'}
            {displayType === 'quantity' ? ' units' : ''}
          </Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>
            {displayType === 'price' ? 'Lowest' : 'Min'}
          </Text>
          <Text style={styles.statValue}>
            {displayType === 'price' ? '$' : ''}
            {processedData.length > 0
              ? Math.min(...processedData.map(item => item.value)).toFixed(2)
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>
            {displayType === 'price' ? 'Highest' : 'Max'}
          </Text>
          <Text style={styles.statValue}>
            {displayType === 'price' ? '$' : ''}
            {processedData.length > 0
              ? Math.max(...processedData.map(item => item.value)).toFixed(2)
              : 'N/A'}
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
  dropdownContainer: {
    paddingHorizontal: 16,
    zIndex: 1000,
  },
  dropdown: {
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  dropdownList: {
    borderColor: '#e0e0e0',
    marginTop: 4,
  },
  dropdownLabel: {
    color: '#333',
    fontSize: 14,
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