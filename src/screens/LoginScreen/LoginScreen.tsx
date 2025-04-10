import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {Divider} from 'react-native-paper';
import {useLogin} from './useLogin'; // Import useLogin hook
import LinearGradient from 'react-native-linear-gradient';
import appImages from '../../assets/images';
import Colors from '../../colors/Color';
import Icon from 'react-native-vector-icons/Ionicons';
import {isIos} from '../../components/helper/utility';

const {width, height} = Dimensions.get('window');
type FormField = 'customerCode' | 'loginId' | 'password';

const LoginScreen = () => {
  const [formData, setFormData] = useState({
    customerCode: 'K1005',
    loginId: '200038',
    password: 'SM@2024',
  });
  const [errors, setErrors] = useState({
    customerCode: '',
    loginId: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const {login, isLoading} = useLogin(); // Use the custom hook

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [rotateAnim]);

  const rotateStyle = {
    transform: [
      {
        rotate: rotateAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      customerCode: '',
      loginId: '',
      password: '',
    };

    if (!formData.customerCode.trim()) {
      newErrors.customerCode = 'Customer code is required';
      isValid = false;
    }

    if (!formData.loginId.trim()) {
      newErrors.loginId = 'Login ID is required';
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = () => {
    if (validateForm()) {
      login(formData); // Call the login function from the hook
    }
  };

  const handleInputChange = (field: FormField, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? height * 0.1 : 0}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled">
          <ImageBackground
            source={appImages.background}
            style={styles.container}
            resizeMode="cover">
            <View style={styles.logo}>
              <Animated.Image
                source={appImages.logo}
                style={[styles.image1, rotateStyle]}
              />
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.title}>Sign In</Text>

              <TextInput
                style={[
                  styles.input,
                  errors.customerCode ? styles.inputError : null,
                ]}
                placeholder="Enter CustomerCode"
                placeholderTextColor={Colors.text.placeholderText}
                keyboardType="email-address"
                value={formData.customerCode}
                autoCapitalize="characters"
                onChangeText={value => handleInputChange('customerCode', value)}
              />

              <TextInput
                style={[styles.input, errors.loginId ? styles.inputError : null]}
                placeholder="Enter Login Id"
                placeholderTextColor={Colors.text.placeholderText}
                keyboardType="email-address"
                value={formData.loginId}
                onChangeText={value => handleInputChange('loginId', value)}
              />

              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    errors.password ? styles.inputError : null,
                  ]}
                  placeholder="Enter Password"
                  placeholderTextColor={Colors.text.placeholderText}
                  secureTextEntry={!showPassword}
                  value={formData.password}
                  onChangeText={value => handleInputChange('password', value)}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}>
                  <Icon
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={Colors.darkGrey}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity>
                <Text style={styles.forgotPassword}>Forget password ?</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <LinearGradient
                  colors={[
                    Colors.gradient.gradientEnd,
                    Colors.gradient.gradientStart,
                  ]}
                  style={styles.gradient}>
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator
                        size="small"
                        color={Colors.white}
                        style={{marginRight: 10}}
                      />
                      <Text style={styles.buttonText}>Signing In...</Text>
                    </View>
                  ) : (
                    <Text style={styles.buttonText}>Sign In</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.kompass}>
              <Divider style={styles.divider} />
              <Text style={styles.kompassText}>KompassHR</Text>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Developed by : Probus Software Pvt. Ltd.
              </Text>
            </View>
          </ImageBackground>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
   
    justifyContent: 'center',
  },
  formContainer: {
    paddingHorizontal: width * 0.08,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: height * 0.02,
  },
  input: {
    height: height * 0.06,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'grey',
    fontSize: width * 0.04,
    paddingHorizontal: width * 0.03,
    borderRadius: width * 0.02,
    color: Colors.text.primary,
    marginTop: height * 0.02,
  },
  inputError: {
    borderColor: Colors.error,
    borderWidth: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
    paddingRight: width * 0.1,
  },
  eyeIcon: {
    position: 'absolute',
    right: width * 0.03,
    top: height * 0.038,
  },
  forgotPassword: {
    color: Colors.primary,
    fontSize: width * 0.035,
    alignSelf: 'flex-end',
    marginVertical: height * 0.02,
  },
  button: {
    marginTop: height * 0.02,
    width: width * 0.5,
    height: isIos ? height * 0.085 : height * 0.06,
    borderRadius: isIos ? width * 0.05 : width * 0.06,
    alignSelf: 'flex-end',
    overflow: 'hidden',
  },
  gradient: {
    width: '100%',
    height: '100%',
    paddingVertical: height * 0.015,
    borderRadius: width * 0.4,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  image1: {
    width: width * 0.2,
    height: width * 0.2,
    alignSelf: 'center',
  },
  logo: {
    paddingHorizontal: width * 0.1,
    marginBottom: height * 0.05,
    alignSelf: 'flex-start',
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    width: width * 0.6,
    backgroundColor: Colors.grey,
    marginTop: height * 0.01,
    alignSelf: 'flex-end',
  },
  kompass: {
    marginTop: 15,
    rowGap: 10,
    paddingHorizontal: 20,
  },
  kompassText: {
    fontSize: width * 0.06,
    color: 'black',
    fontWeight: 'bold',
    alignSelf: 'flex-end',
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    paddingHorizontal: 10,
  },

  footerText: {
    fontSize: width * 0.035,
    color: Colors.lightGrey,
  },
});

export default LoginScreen;
