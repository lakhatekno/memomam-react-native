import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const navigation = createNativeStackNavigator();

const checkToken = async() => {
    const token = await AsyncStorage.getItem('token');
    return (!!token)
};

export default checkToken;