import React, { useEffect, useState } from "react";
import { Text, View, Button, ActivityIndicator } from "react-native";
import {
  requestPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import { WeatherIcon } from "./WeatherIcon";

const weatherApiKey = process.env.weatherApiKey;
const baseWeatherUrl = "https://api.openweathermap.org/data/2.5/weather";

// For temperature in Fahrenheit use units=imperial
// For temperature in Celsius use units=metric
// Temperature in Kelvin is used by default, no need to use units parameter in API call

export const MyWeather = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState("metric");
  const [err, setErr] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);
  useEffect(() => {
    getLocationWeather();
  }, [units]);

  const getLocationWeather = async () => {
    try {
      if (!location) return;
      setLoading(true);
      const res = await fetch(
        `${baseWeatherUrl}?lat=${location?.latitude}&lon=${location?.longitude}&units=${units}&appid=${weatherApiKey}`
      );
      const data = await res.json();
      if (data) {
        const formattedWeather = {};
        formattedWeather.temp = data.main.temp;
        formattedWeather.city = data.name;
        formattedWeather.country = data.sys.country;
        formattedWeather.desc = data.weather[0].description;
        formattedWeather.icon = data.weather[0].icon;
        formattedWeather.wind = data.wind.speed;
        setWeather(formattedWeather);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setErr(err.message);
    }
  };

  const getLocation = async () => {
    try {
      setLoading(true);
      const { granted } = await requestPermissionsAsync();
      // console.log({ status, granted, expires, canAskAgain, android, ios });
      if (granted) {
        const {
          coords: { latitude, longitude },
        } = await getCurrentPositionAsync();
        setLocation({ latitude, longitude });
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setErr(err.message);
    }
  };

  return (
    <>
      <View>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : weather ? (
          <>
            <WeatherIcon size={4} icon={weather?.icon} />
            <Text>City: {weather?.city} </Text>
            <Text>Country: {weather?.country} </Text>
            <Text>Temp: {weather?.temp} </Text>
            <Text>Description: {weather?.desc} </Text>
            <Text>Wind: {weather?.wind} </Text>
          </>
        ) : err ? (
          <Text>{err}</Text>
        ) : null}
      </View>
      <Button onPress={getLocationWeather} title="Get weather" />
      <Button
        onPress={() =>
          units === "metric" ? setUnits("imperial") : setUnits("metric")
        }
        title={`Temp in ${units === "metric" ? "C" : "F"}`}
      />
    </>
  );
};
