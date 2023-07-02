import * as Notifications from 'expo-notifications';

export async function sendNotification() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus === 'granted') {
    const notificationContent = {
      title: 'All Matches found!',
      body: 'I hope you had fun exploring Munich!',
      ios: {
        sound: true,
      },
      android: {
        sound: true,
        priority: 'high',
        vibrate: true,
      },
    };

    await Notifications.scheduleNotificationAsync({
      content: notificationContent,
      trigger: null,
    });
  }
}
