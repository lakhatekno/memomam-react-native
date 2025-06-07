// ProfileStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotificationSettingScreen from '../screens/NotificationSettingScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="NotificationSetting" component={NotificationSettingScreen} />
    </Stack.Navigator>
  );
}
