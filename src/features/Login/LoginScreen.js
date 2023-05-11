import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Alert, Platform } from 'react-native';
import { connect } from 'react-redux';
import appleAuth from '@invertase/react-native-apple-authentication';
import { Input, Button, HelpLinks, CustomScrollview, ImageButton } from '../../shared/components';
import { colors, global } from '../../shared/styles/theme';
import SignInApple from '../../assets/signup/sign-in-apple.png';
import SignInFB from '../../assets/signup/sign-in-fb.png';
import SignInGoogle from '../../assets/signup/sign-in-with-google.png';
import Logo from '../../assets/logo.png';
import { Validation } from '../../shared/functions';
import User from '../../state/actions/User';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 30
  },
  logo: {
    flex: 1,
    alignSelf: 'center'
  },
  inputContainer: {
    marginTop: 20
  },
  middleView: {
    paddingHorizontal: 30
  },
  signUpBtn: {
    marginTop: 30,
    marginBottom: 5,
    alignSelf: 'center',
    minWidth: '100%'
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
    alignSelf: 'center'
  },
  primaryText: {
    ...global.textStyles.subText
  },
  linkText: {
    ...global.textStyles.subText,
    color: colors.blue
  },
  socialLoginsContainer: {
    marginTop: 15
  },
  socialBtn: {
    height: 42,
    marginBottom: 15
  },
  bottomContainer: {
    flex: 1,
    paddingBottom: 10
  },
  errorText: {
    ...global.textStyles.text,
    marginTop: 5,
    color: colors.errorRed,
    alignSelf: 'center'
  }
});

const LoginScreen = ({ navigation, auth = {} }) => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [fbLoading, setFbLoading] = useState(false);

  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const onChangeTextCallback = useCallback(
    (name, value) => {
      const newErrors = errors;
      if (newErrors[name]) {
        delete newErrors[name];
      }
      setErrors(newErrors);
      setForm({
        ...form,
        [name]: value
      });
    },
    [form, errors]
  );

  const onPressSignUpCallback = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  const onPressLoginCallback = useCallback(async () => {
    setLoading(true);
    const newErrors = Validation.validateForm(form);
    if (newErrors) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }
    const data = {
      email,
      password
    };

    try {
      await User.loginWithEmail(data);
      if (mounted.current) setLoading(false);
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        // handle showing forgot password link here.
        setErrors({ login: ' Invalid password entered.' });
        setLoading(false);
      } else {
        setErrors({ login: error.message });
        setLoading(false);
      }
    }
  }, [form]);

  const onPressResetPasswordCallback = useCallback(() => {
    navigation.navigate('PasswordReset');
  }, [navigation]);

  const onPressAppleSignIn = useCallback(async () => {
    setAppleLoading(true);
    try {
      const res = await User.loginWithApple();
      if (!res) {
        if (mounted.current) setAppleLoading(false);
      }
    } catch (error) {
      setAppleLoading(false);
      console.log(error);
      Alert.alert(error.message);
    }
  }, [setAppleLoading]);

  const onPressFbSignIn = useCallback(async () => {
    setFbLoading(true);
    try {
      const res = await User.loginWithFacebook();
      if (!res) {
        if (mounted.current) setFbLoading(false);
      }
    } catch (error) {
      setFbLoading(false);
      console.log(error);
      Alert.alert(error.message);
    }
  }, [setFbLoading]);

  const onPressGoogleSignIn = useCallback(async () => {
    setGoogleLoading(true);
    try {
      const res = await User.loginWithGoogle();
      if (!res) {
        if (mounted.current) setGoogleLoading(false);
      }
    } catch (error) {
      setGoogleLoading(false);
      console.log(error);
      Alert.alert(error.message);
    }
  }, [setGoogleLoading]);

  const { email, password } = form;
  const { error: authError } = auth;
  return (
    <View style={styles.container}>
      <CustomScrollview>
        <View style={styles.contentContainer}>
          <Image source={Logo} resizeMode="contain" style={styles.logo} />

          <Input
            label="Email"
            value={email}
            name="email"
            placeholder="Email Address"
            onChangeText={onChangeTextCallback}
            containerStyle={styles.inputContainer}
            error={errors.email}
          />

          <Input
            label="Password"
            value={password}
            name="password"
            placeholder="8 characters min, number and capital letter"
            onChangeText={onChangeTextCallback}
            secureTextEntry
            containerStyle={styles.inputContainer}
            error={errors.password}
          />

          <View style={styles.middleView}>
            {errors.login && <Text style={styles.errorText}>{errors.login}</Text>}
            {authError && <Text style={styles.errorText}>{authError}</Text>}

            <View style={styles.textContainer}>
              <Text style={styles.primaryText}>Forgot your password? </Text>
              <Text onPress={onPressResetPasswordCallback} style={styles.linkText}>
                Reset Password
              </Text>
            </View>

            <Button
              title="Login"
              onPress={onPressLoginCallback}
              textStyle={styles.signUpBtnText}
              buttonStyle={styles.signUpBtn}
              loading={loading}
            />

            <View style={styles.textContainer}>
              <Text style={styles.primaryText}>{"Don't have an account? "}</Text>
              <Text onPress={onPressSignUpCallback} style={styles.linkText}>
                Sign Up
              </Text>
            </View>
          </View>

          <View style={styles.socialLoginsContainer}>
            {Platform.OS === 'ios' && appleAuth.isSupported && (
              <ImageButton
                imageSource={SignInApple}
                onPress={onPressAppleSignIn}
                buttonStyle={styles.socialBtn}
                loading={appleLoading}
              />
            )}
            <ImageButton
              imageSource={SignInFB}
              onPress={onPressFbSignIn}
              buttonStyle={styles.socialBtn}
              loading={fbLoading}
            />
            <ImageButton
              imageSource={SignInGoogle}
              onPress={onPressGoogleSignIn}
              buttonStyle={styles.socialBtn}
              loading={googleLoading}
            />
          </View>

          <View style={styles.bottomContainer}>
            <HelpLinks />
          </View>
        </View>
      </CustomScrollview>
    </View>
  );
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(LoginScreen);
