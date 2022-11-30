import React, {useRef, useState} from 'react';
import {SafeAreaView, TextInput, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LoginScreenStyle from './LoginScreenStyle';
import {ms} from 'react-native-size-matters';
import ThemeButton from '../../../components/themeButton/themeButton';
import {useNavigation} from '@react-navigation/native';
import screenNameEnum from '../../../helper/screenNameEnum';
import {removeSpace, showToast} from '../../../helper/helper';
import {API, Auth, graphqlOperation} from 'aws-amplify';
import {Query} from '../../../network/Query';
import {useDispatch} from 'react-redux';
import {userAction} from '../../../redux/reducers/user-slice/userSlice';
import CustomText from '../../../components/text/CustomText';
import FastImage from 'react-native-fast-image';
import images from '../../../theme/images/images';
import RegisterScreenStyle from '../register/RegisterScreenStyle';
import colors from '../../../theme/colors/colors';
import Icon from '../../../components/icon/Icon';

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef();

  const signIn = async (email: string, password: string) => {
    const trimmedEmail = removeSpace(email);

    if (!trimmedEmail || !password) {
      showToast('please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      const user = await Auth.signIn(trimmedEmail, password);
      const userId = user?.attributes?.sub;
      console.log(userId, 'user');
      if (user) {
        const result = await API.graphql(
          graphqlOperation(Query.getUser, {user_id: userId}),
        );
        console.log(result, 'result -------');
        if (result) {
          dispatch(
            userAction.setUserData({
              ...result?.data?.getuser,
              user_id: userId,
            }),
          );
          showToast('login successfully');
        }
      }

      setLoading(false);
    } catch (error: any) {
      console.log(error, 'error ----------');

      setLoading(false);
      if (error.message[0] === '2') {
        showToast('Enter valid email address');
      }
      let message = error.message;
      if (message === 'User does not exist.') {
        showToast('Username doesn’t exist.');
      } else {
        showToast(error.message);
      }
    }
  };

  const GoToSignUpContainer = () => {
    return (
      <View style={LoginScreenStyle.signUpContainer}>
        <CustomText textStyle={LoginScreenStyle.signUpButtonText}>
          {" I don't have an account.\t"}
        </CustomText>
        <TouchableOpacity activeOpacity={0.8} onPress={onPressGoToSignUp}>
          <CustomText
            textStyle={{
              fontFamily: 'Poppins-Bold',
              fontSize: ms(14),
              color: colors.AppTheme.Text,
            }}>
            Sign Up
          </CustomText>
        </TouchableOpacity>
      </View>
    );
  };

  const onPressGoToSignUp = () => {
    console.log('sign up clicked -------->>>>>>>');
    navigation.navigate(screenNameEnum.RegisterScreen);
  };

  const forgotPasswordClicked = () => {
    navigation.navigate(screenNameEnum.RestorePasswordScreen);
  };

  const [showPassword, setShowPassword] = useState(true);

  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
      <SafeAreaView style={LoginScreenStyle.container}>
        <View style={{alignItems: 'flex-end'}}>
          <FastImage
            source={images.login}
            resizeMode={FastImage.resizeMode.cover}
            style={RegisterScreenStyle.imageStyle}
          />
        </View>
        <CustomText textStyle={LoginScreenStyle.loginHeaderTitle}>
          Login
        </CustomText>
        <View style={LoginScreenStyle.secondContainer}>
          <View style={LoginScreenStyle.loginTextInputContainer}>
            <Icon
              type="Fontisto"
              name="email"
              size={ms(18)}
              color={'#7D7D7D'}
            />
            <TextInput
              style={LoginScreenStyle.loginFormTextInput}
              placeholder="Email"
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              cursorColor={colors.AppTheme.Text}
              blurOnSubmit={false}
              placeholderTextColor={colors.AppTheme.PlaceholderColor}
              onChangeText={val => setEmail(val)}
            />
          </View>
          <View style={LoginScreenStyle.loginTextInputContainerPass}>
            <Icon
              type="Ionicons"
              name="key-outline"
              size={ms(18)}
              color={'#7D7D7D'}
            />
            <TextInput
              ref={passwordRef}
              style={LoginScreenStyle.loginFormTextInput}
              placeholder="Password"
              returnKeyType="done"
              onSubmitEditing={() => signIn(email, password)}
              secureTextEntry={showPassword}
              placeholderTextColor={colors.AppTheme.PlaceholderColor}
              cursorColor={colors.AppTheme.Text}
              onChangeText={val => setPassword(val)}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              hitSlop={{top: 10, bottom: 10, left: 20, right: 10}}
              style={{position: 'absolute', right: 0}}
              onPress={() => setShowPassword(!showPassword)}>
              <Icon
                type="Feather"
                name={`${showPassword ? 'eye' : 'eye-off'}`}
                size={ms(18)}
                color={'#7D7D7D'}
              />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={LoginScreenStyle.forgotPasswordContainer}
              onPress={forgotPasswordClicked}>
              <CustomText textStyle={LoginScreenStyle.forgotPasswordText}>
                Forgot password?
              </CustomText>
            </TouchableOpacity>
          </View>
          <View style={{marginTop: ms(50)}}>
            <ThemeButton
              title="Login"
              loading={loading}
              onPress={() => signIn(email, password)}
            />
          </View>
        </View>
        <GoToSignUpContainer />
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default LoginScreen;
