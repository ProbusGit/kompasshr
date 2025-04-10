import { useLazyLoginQuery } from '../../redux/services/Login/LoginApiSlice';
import { useAppDispatch } from '../../redux/hook';
import { showSnackbar } from '../../redux/slices/snackbarSlice';
import { useNavigation } from '@react-navigation/native';
import { screenNames } from '../../types/navigationType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserData } from '../../hook/useLocalStorage';
import { useLazyGetUserProfileQuery } from '../../redux/services/Profile/ProfileApiSlice';
import { resetUser, updateUserData } from '../../redux/slices/authSlice';

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const { saveUserData, deleteUserData } = useUserData();

  const [triggerLogin, { isLoading, error }] = useLazyLoginQuery();
  const [triggerGetUserProfile] = useLazyGetUserProfileQuery();

  const login = async (formData: { customerCode: string; loginId: string; password: string }) => {
    try {
      const result = await triggerLogin(formData).unwrap();
      console.log('Login Result:', result);
      if (result) {
    
        // Fetch user profile
        try {
          const profileResponse = await triggerGetUserProfile({
            employeeId: result?.data?.employeeId,
            CustomerCode: formData.customerCode, // Ensure CustomerCode is passed
          }).unwrap();
          console.log('User Profile Response:', profileResponse );

          // Save user profile to AsyncStorage
          saveUserData({ ...formData,  ...profileResponse });
          dispatch(updateUserData({ ...formData , ...profileResponse})); // Update user data in Redux store

          
        } catch (profileError) {
          console.error('Error fetching user profile:', profileError);
          dispatch(
            showSnackbar({
              message: 'Failed to fetch user profile. Please try again later.',
              severity: 'error',
            }),
          );
        }

        // await AsyncStorage.setItem('SetMobileLayout', 'Mobile');
        navigation.replace(screenNames.MainTab); // Navigate to the home screen
      }
    } catch (err: any) {
      console.log('Error:', err);
      dispatch(
        showSnackbar({
          message: err?.data?.message || 'Login failed. Please try again.',
          severity: 'error',
        }),
      );
    }
  };

  const logout = async () => {
    try {
      deleteUserData(); // Clear user data from AsyncStorage
      dispatch(resetUser()); // Reset user data in Redux store
      navigation.replace(screenNames.Login); // Navigate to the login screen
    } catch (err) {
      console.error('Logout Error:', err);
      dispatch(
        showSnackbar({
          message: 'Failed to log out. Please try again.',
          severity: 'error',
        }),
      );
    }
  };

  return { login, isLoading, error, logout };
};
