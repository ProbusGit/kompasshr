import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeTabParamList, RootStackParamList } from "../types/navigationType";
import { useState } from "react";
import { isIos } from "../components/helper/utility";
import { IconButton } from "react-native-paper";
import Colors from "../colors/Color";
import { useAppDispatch } from "../redux/hook";
import { checkAuthStatus } from "../redux/slices/authSlice";
import { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import CheckInOut from "../screens/CheckInOutScreen";
import NotificationScreen from "../screens/NotificationScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HomeScreen from "../screens/HomeScreen";
import Offline from "../screens/OfflineScreen";
import SplashScreen from "../screens/SplashScreen";
import SlideToEnterScreen from "../screens/SlideToEnterScreen";
import LoginScreen from "../screens/LoginScreen/LoginScreen";
import Header from "../components/Header";
import ESSLayout from "../screens/ESS";
import LocationDisplay from "../components/LocationDisplay";



const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<HomeTabParamList>();

// Tab Navigator
function HomeTabNavigator() {
  const [homeKey, setHomeKey] = useState(0); // Key to refresh the WebView

  return (
    <>
    <Header />
    <Tab.Navigator

      initialRouteName='Home'
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          textAlign: 'center',
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          height: isIos ? 90 : 70,
          paddingTop: isIos ? 10 : 5,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: string = '';
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'ESS') {
            iconName = 'hand-pointing-up';
          } else if (route.name === 'Notifications') {
            iconName = 'bell';
          } else if (route.name === 'Profile') {
            iconName = 'account';
          }
          return (
            <IconButton
              icon={iconName}
              size={size}
              iconColor={color}
            />
          );
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: 'gray',
      })}

      
    >
      <Tab.Screen name="Home" component={HomeScreen} />

      <Tab.Screen
        name="ESS"
        children={() => <ESSLayout key={homeKey} />} // Pass the key to refresh the WebView
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault(); // Prevent default tab behavior
            setHomeKey((prevKey) => prevKey + 1); // Update the key to refresh the WebView
            navigation.navigate('ESS'); // Ensure navigation to "Home"
          },
          focus: () => {
            setHomeKey((prevKey) => prevKey + 1); // Refresh the WebView on focus
          },
        })}
      />
      
      <Tab.Screen name="Notifications" component={NotificationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
    </>
  );
}




// Main Navigator
function RootNavigation() {
  const dispatch = useAppDispatch();
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Check auth status on mount
    dispatch(checkAuthStatus());

    // Subscribe to network status
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (!isConnected) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Offline" component={Offline} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right', // Default animation
        gestureEnabled: true,
      }}
    >

      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="SlideToEnter" component={SlideToEnterScreen} />
      <Stack.Screen name="MainTab" options={{
        animation: 'fade', // Custom animation for Login screen
      }} component={HomeTabNavigator} />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          animation: 'fade', // Custom animation for Login screen
        }}
      />

      <Stack.Screen
        name="CheckInOut"
        component={CheckInOut}
        options={{
          animation: 'fade', // Custom animation for CheckInOut screen
        }}
      />

    </Stack.Navigator>
  );
}

export default RootNavigation;