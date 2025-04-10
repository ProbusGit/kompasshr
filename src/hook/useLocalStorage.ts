import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../redux/slices/authSlice';

export const useUserData = () => {
  const saveUserData = async (userData: User) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const getUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  };

  const deleteUserData = async ( ) => {
    try {
      await AsyncStorage.removeItem('userData');
      

    } catch (error) {
      console.error('Error deleting user data:', error);
    }
  };


  return { saveUserData, getUserData, deleteUserData };
};
