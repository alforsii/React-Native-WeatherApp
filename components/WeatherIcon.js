import React from "react";
import { Image } from "react-native";

export const WeatherIcon = ({ icon, size }) => {
  const src = `https://api.openweathermap.org/img/wn/${icon}@${size}x.png`;
  return src ? (
    <Image style={{ width: 100, height: 100 }} source={{ uri: src }} />
  ) : null;
};
