import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Pressable, ActivityIndicator, ScrollView, ImageSourcePropType } from 'react-native';
import { WEATHER_API_KEY } from '@client/constants/api-key';
import axios from 'axios';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { Colors } from '@client/constants/Colors';

interface WeatherImages {
  sunny: ImageSourcePropType;
  cloudy: ImageSourcePropType;
  rainy: ImageSourcePropType;
}

interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface ForecastDay {
  day: string;
  temp: number;
  description: string;
}

interface CurrentWeather {
  name: string;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: WeatherCondition[];
}

const weatherImages: WeatherImages = {
  sunny: require('@client/assets/icons/weather/sun-weather.png'),
  cloudy: require('@client/assets/icons/weather/cloudy-weather.png'),
  rainy: require('@client/assets/icons/weather/rain-weather.png'),
};

const getWeatherIcon = (condition: string): ImageSourcePropType => {
  if (condition.includes('rain')) return weatherImages.rainy;
  if (condition.includes('cloud')) return weatherImages.cloudy;
  return weatherImages.sunny;
};

const generateFakeForecast = (currentTemp: number): ForecastDay[] => {
  const days = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const variations = [-2, 1, -1, 2, -1.5, 1.5];
  
  return days.map((day, index) => ({
    day,
    temp: index === 0 ? currentTemp : currentTemp + variations[index - 1],
    description: 'Partly cloudy'
  }));
};

const Weather: React.FC = () => {
  const [location, setLocation] = useState<string>('');
  const [weatherData, setWeatherData] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const fetchWeatherData = async (): Promise<void> => {
    if (!location) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.get<CurrentWeather>(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${WEATHER_API_KEY}`
      );
      setWeatherData(response.data);
      // Generate fake forecast based on current temperature
      setForecast(generateFakeForecast(response.data.main.temp));
    } catch (err) {
      setError('Error fetching weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={{flex: 1}}>
      <View style={{backgroundColor: '#fff'}}>
        <View style={styles.header}>
            <Pressable onPress={handleBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={Colors.light.tint} />
            </Pressable>
            <Text style={styles.headerTitle}>Home</Text>
        </View>
        <View style={{padding: 8}}>
          <View style={styles.header2}>
              <Image
                source={require('@client/assets/icons/features/weather-logo.png')}
                style={styles.logo}
              />
              <Text style={styles.title}>Weather Forecast</Text>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchBox}>
              <Ionicons name="location-outline" size={24} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="Enter city name"
                value={location}
                onChangeText={setLocation}
              />
            </View>
            <Pressable style={styles.searchButton} onPress={fetchWeatherData}>
              <Text style={styles.searchButtonText}>Search</Text>
            </Pressable>
          </View>
        </View>

      </View>
          <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066ff" />
          </View>
        )}

        {error && <Text style={styles.error}>{error}</Text>}

        {weatherData && !loading && (
          <>
            <View style={styles.currentWeather}>
              <Text style={styles.locationName}>{weatherData.name}</Text>
              <Image
                source={getWeatherIcon(weatherData.weather[0].description)}
                style={styles.currentWeatherIcon}
              />
              <Text style={styles.temperature}>
                {Math.round(weatherData.main.temp)}°C
              </Text>
              <Text style={styles.description}>
                {weatherData.weather[0].description}
              </Text>
              <View style={styles.details}>
                <View style={styles.detailItem}>
                  <Ionicons name="water-outline" size={24} color="#666" />
                  <Text style={styles.detailText}>
                    {weatherData.main.humidity}%
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="speedometer-outline" size={24} color="#666" />
                  <Text style={styles.detailText}>
                    {weatherData.main.pressure} hPa
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.forecastContainer}>
              <Text style={styles.forecastTitle}>7-Day Forecast</Text>
              {forecast.map((day, index) => (
                <View key={day.day} style={styles.forecastDay}>
                  <Text style={styles.forecastDayText}>{day.day}</Text>
                  <Text style={styles.forecastTemp}>{Math.round(day.temp)}°C</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
    </View>

  );
};

const styles = StyleSheet.create({
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
  headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  forecastContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  forecastDay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  forecastDayText: {
    fontSize: 16,
    color: '#666',
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#0066ff',
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 20,
  },
  error: {
    color: '#dc3545',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  currentWeather: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  currentWeatherIcon: {
    width: 120,
    height: 120,
    marginVertical: 20,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 18,
    color: '#666',
    marginVertical: 10,
    textTransform: 'capitalize',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
});

export default Weather;