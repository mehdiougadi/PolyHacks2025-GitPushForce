import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from 'victory-native';
import { Colors } from '../../constants/Colors';

interface DataScreenProps {
  itemName: string;
  prices: { date: Date; value: number }[];
  quantities: { date: Date; value: number }[];
}

export const DataScreen = ({ itemName, prices, quantities }: DataScreenProps) => {
  const [displayType, setDisplayType] = useState<'price' | 'quantity'>('price');
  const [timeRange, setTimeRange] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  const getData = () => {
    return displayType === 'price' ? prices : quantities;
  };

  const filterData = (data: { date: Date; value: number }[]) => {
    const now = new Date();
    switch (timeRange) {
      case 'monthly':
        return data.filter(d => d.date > new Date(now.setMonth(now.getMonth() - 1)));
      case 'quarterly':
        return data.filter(d => d.date > new Date(now.setMonth(now.getMonth() - 3)));
      case 'yearly':
        return data.filter(d => d.date > new Date(now.setFullYear(now.getFullYear() - 1)));
    }
  };

  const filteredData = filterData(getData());

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{itemName} Data</Text>
      
      <View style={styles.toggleContainer}>
        <Button
          title="Price"
          onPress={() => setDisplayType('price')}
          color={displayType === 'price' ? Colors.light.tint : '#ccc'}
        />
        <Button
          title="Quantity"
          onPress={() => setDisplayType('quantity')}
          color={displayType === 'quantity' ? Colors.light.tint : '#ccc'}
        />
      </View>

      <View style={styles.toggleContainer}>
        <Button
          title="Monthly"
          onPress={() => setTimeRange('monthly')}
          color={timeRange === 'monthly' ? Colors.light.tint : '#ccc'}
        />
        <Button
          title="Quarterly"
          onPress={() => setTimeRange('quarterly')}
          color={timeRange === 'quarterly' ? Colors.light.tint : '#ccc'}
        />
        <Button
          title="Yearly"
          onPress={() => setTimeRange('yearly')}
          color={timeRange === 'yearly' ? Colors.light.tint : '#ccc'}
        />
      </View>

      <VictoryChart theme={VictoryTheme.material}>
        <VictoryAxis
          label="Date"
          tickFormat={(x: number) => new Date(x).toLocaleDateString('en-US', { month: 'short' })}
        />
        <VictoryAxis
          dependentAxis
          label={displayType === 'price' ? 'Price ($)' : 'Quantity'}
        />
        <VictoryLine
          data={filteredData}
          x="date"
          y="value"
          style={{
            data: { stroke: Colors.light.tint },
          }}
        />
      </VictoryChart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
});