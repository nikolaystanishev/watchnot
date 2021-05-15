import React from 'react';
import { Text, useColorScheme, StyleSheet } from 'react-native';


export function TextColorTheme(props: { text: String | undefined }) {
  const colorScheme = useColorScheme();

  const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;

  return (
    <Text style={[themeTextStyle]}>{props.text}</Text>
  );
}

const styles = StyleSheet.create({
  lightThemeText: {
    color: '#242C40',
  },
  darkThemeText: {
    color: '#D0D0C0',
  },
});
