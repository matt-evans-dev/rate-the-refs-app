import React, {useState, useCallback, useRef, useEffect} from 'react';
import {View, Text, StyleSheet, Alert, Platform, Modal} from 'react-native';
import {connect} from 'react-redux';
import appleAuth from '@invertase/react-native-apple-authentication';
import {
  Input,
  Button,
  HelpLinks,
  CustomScrollview,
  ImageButton,
} from '../../shared/components';
import {colors, global} from '../../shared/styles/theme';
import SignInApple from '../../assets/signup/sign-in-apple.png';
import SignInFB from '../../assets/signup/sign-in-fb.png';
import SignInGoogle from '../../assets/signup/sign-in-with-google.png';
import User from '../../state/actions/User';
import UserAPI from '../../api/User';
import {Validation} from '../../shared/functions';
import PolicyScreen from '../Policy/PolicyScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  inputContainer: {
    marginTop: 20,
  },
  middleView: {
    paddingHorizontal: 30,
  },
  signUpBtn: {
    marginTop: 30,
    marginBottom: 5,
    alignSelf: 'center',
    minWidth: '100%',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
    alignSelf: 'center',
  },
  primaryText: {
    ...global.textStyles.subText,
  },
  linkText: {
    ...global.textStyles.subText,
    color: colors.blue,
  },
  socialLoginsContainer: {
    marginTop: 15,
  },
  socialBtn: {
    height: 42,
    marginBottom: 15,
  },
  bottomContainer: {
    flex: 1,
    paddingBottom: 10,
  },
  errorText: {
    ...global.textStyles.text,
    marginTop: 5,
    color: colors.errorRed,
    alignSelf: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '85%',
    width: '90%',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  agreeBtn: {
    minWidth: '100%',
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '100%',
    zIndex: 99,
  },
  header: {
    width: '100%',
    height: '10%',
    backgroundColor: '#44B9ED',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  modalTitle: {
    height: '100%',
    ...global.textStyles.header,
    fontSize: 25,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'rgba(0, 0, 0, 0.5)',
  },
});

const SignUpScreen = ({navigation, auth = {}}) => {
  const [modalVisible, setModalVisible] = useState(true);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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
        [name]: value,
      });
    },
    [form, errors],
  );

  const onPressSignUpCallback = useCallback(async () => {
    setLoading(true);
    const newErrors = Validation.validateForm(form);
    if (newErrors) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    const passwordMatch = form.password === form.confirmPassword;
    if (!passwordMatch) {
      setErrors({signUp: 'Passwords do not match'});
      setLoading(false);
      return;
    }

    const data = {
      displayName: form.username.trim(),
      email: form.email,
      password: form.password,
    };

    try {
      const usernameCheck = await UserAPI.checkUsername(data.displayName);
      if (usernameCheck.isUnique) {
        // Create User API call and handling
        await User.createFirebaseUserWithEmail(data);

        if (mounted.current) {
          setLoading(false);
        }

        // Firebase Auth Listener handles redirects to Bottom Nav
      } else {
        setLoading(false);
        setErrors({username: 'That username is already taken.'});
      }
    } catch (error) {
      console.log(error.message);
      setErrors({signUp: error.message});
      setLoading(false);
    }
  }, [form]);

  const onPressLoginCallback = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  const onPressAppleSignIn = useCallback(async () => {
    setAppleLoading(true);
    try {
      const res = await User.loginWithApple();
      if (!res) {
        if (mounted.current) {
          setAppleLoading(false);
        }
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
        if (mounted.current) {
          setFbLoading(false);
        }
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
        if (mounted.current) {
          setGoogleLoading(false);
        }
      }
    } catch (error) {
      setGoogleLoading(false);
      console.log(error);
      Alert.alert(error.message);
    }
  }, [setGoogleLoading]);

  const renderOverlay = () => {
    if (modalVisible) {
      return <View style={styles.overlay} />;
    }
    return null;
  };

  const [atTop, setAtTop] = useState(true);

  const setButton = () => {
    setAtTop(false);
  };

  const {username, email, password, confirmPassword} = form;
  const {error: authError} = auth;
  return (
    <View style={styles.container}>
      {renderOverlay()}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          navigation.navigate('Welcome');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.header}>
              <Text style={styles.modalTitle}>Privacy Policy</Text>
            </View>
            <PolicyScreen setButton={setButton} />
            <Button
              disabled={atTop}
              title="I Agree"
              buttonStyle={styles.agreeBtn}
              textStyle={styles.agreeText}
              onPress={() => setModalVisible(!modalVisible)}
            />
          </View>
        </View>
      </Modal>
      <CustomScrollview>
        <View style={styles.contentContainer}>
          <Input
            label="Username"
            value={username}
            name="username"
            placeholder="Username"
            onChangeText={onChangeTextCallback}
            containerStyle={styles.inputContainer}
            error={errors.username}
          />

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

          <Input
            label="Confirm Password"
            value={confirmPassword}
            name="confirmPassword"
            placeholder="Confirm password"
            onChangeText={onChangeTextCallback}
            secureTextEntry
            containerStyle={styles.inputContainer}
            error={errors.confirmPassword}
          />

          <View style={styles.middleView}>
            {errors.signUp && (
              <Text style={styles.errorText}>{errors.signUp}</Text>
            )}
            {authError && <Text style={styles.errorText}>{authError}</Text>}
            <Button
              title="Sign Up"
              onPress={onPressSignUpCallback}
              textStyle={styles.signUpBtnText}
              buttonStyle={styles.signUpBtn}
              loading={loading}
            />

            <View style={styles.textContainer}>
              <Text style={styles.primaryText}>Already have an account? </Text>
              <Text onPress={onPressLoginCallback} style={styles.linkText}>
                Login
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
  auth: state.auth,
});

export default connect(mapStateToProps)(SignUpScreen);