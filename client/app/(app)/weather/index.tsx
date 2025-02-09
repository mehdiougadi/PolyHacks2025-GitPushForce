import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button, ActivityIndicator } from 'react-native';
import { WEATHER_API_KEY } from '@client/constants/api-key'; 
import axios from 'axios';

const Weather = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  // Function to fetch weather data from OpenWeatherMap
  const fetchWeatherData = async () => {
    if (!location) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${WEATHER_API_KEY}`
      );
      setWeatherData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching weather data');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/icons/features/weather-logo.png')}  // Ensure you have the correct image path
        style={styles.icon}
      />
      <Text style={styles.title}>Current Weather</Text>

      {/* User Input for Location */}
      <TextInput
        style={styles.input}
        placeholder="Enter city name"
        value={location}
        onChangeText={(text) => setLocation(text)}
      />
      <Button title="Get Weather" onPress={fetchWeatherData} />

      {/* Loading Spinner */}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {/* Error Message */}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Display Weather Data */}
      {weatherData && !loading && !error && (
        <View>
          <Text style={styles.weatherInfo}>Temperature: {weatherData.main.temp}°C</Text>
          <Text style={styles.weatherInfo}>Condition: {weatherData.weather[0].description}</Text>
          <Text style={styles.weatherInfo}>Humidity: {weatherData.main.humidity}%</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    borderRadius: 5,
  },
  weatherInfo: {
    fontSize: 18,
    marginBottom: 10,
  },
  error: {
    fontSize: 18,
    color: 'red',
    marginTop: 10,
  },
});

export default Weather;
