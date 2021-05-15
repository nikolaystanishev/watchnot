import { useEffect } from 'react';
import { Keyboard } from 'react-native';

import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';


export const useNotifications = () => {
  useEffect(() => {
    askNotification();

    const listener = Notifications.addNotificationReceivedListener(handleNotification);
    return () => listener.remove();
  }, []);
}

const askNotification = async () => {
  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  if (Constants.isDevice && status === 'granted') {
    console.log('Notification permissions granted.');
  }
};

const handleNotification = () => {
  console.log('You got notification');
};

export const pushNotification = (content: any) => {
  Keyboard.dismiss();
  const schedulingOptions = {
    content: content,
    trigger: {
      seconds: 1,
    },
  };
  // Notifications show only when app is not active.
  // (ie. another app being used or device's screen is locked)
  Notifications.scheduleNotificationAsync(
    schedulingOptions,
  );
};
