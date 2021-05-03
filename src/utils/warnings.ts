import { LogBox } from 'react-native';


export const stopWarnings = () => {
  LogBox.ignoreLogs(['Setting a timer']);
}
