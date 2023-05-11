import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import { Input, CustomScrollview, Button } from '../../shared/components';
import { colors, global } from '../../shared/styles/theme';
import { Validation } from '../../shared/functions';
import Logo from '../../assets/logo.png';
import User from '../../state/actions/User';
import UserAPI from '../../api/User';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 20,
    paddingHorizontal: 30
  },
  logo: {
    marginTop: 30,
    alignSelf: 'center'
  },
  inputContainer: {
    marginTop: 20
  },
  signUpBtn: {
    marginTop: 30,
    marginBottom: 5,
    alignSelf: 'center',
    minWidth: '100%'
  },
  errorText: {
    ...global.textStyles.text,
    marginTop: 5,
    color: colors.errorRed,
    alignSelf: 'center'
  }
});

const RequiredInfoScreen = ({ auth = {}, updateUser = () => {} }) => {
  const [form, setForm] = useState({
    username: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const onPressContinueCallback = useCallback(async () => {
    setLoading(true);
    const newErrors = Validation.validateForm(form);
    if (newErrors) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    const data = {
      display_name: form.username.trim()
    };

    try {
      const usernameCheck = await UserAPI.checkUsername(data.display_name);
      if (usernameCheck.isUnique) {
        // Update User's Username
        updateUser(data);
        setLoading(false);
        // Navigates on own from User Handling and navigation
      } else {
        setLoading(false);
        setErrors({ username: 'That username is already taken.' });
      }
    } catch (error) {
      console.log(error.message);
      setErrors({ signUp: error.message });
      setLoading(false);
    }
  }, [auth, setErrors, setLoading, form, updateUser]);

  const { username } = form;

  return (
    <View style={styles.container}>
      <CustomScrollview>
        <Image source={Logo} resizeMode="contain" style={styles.logo} />
        <View style={styles.contentContainer}>
          <Input
            label="Username"
            value={username}
            name="username"
            placeholder="Set a username"
            onChangeText={onChangeTextCallback}
            containerStyle={styles.inputContainer}
            error={errors.username}
          />
          {errors.signUp && <Text style={styles.errorText}>{errors.signUp}</Text>}
          <Button
            title="Continue"
            onPress={onPressContinueCallback}
            textStyle={styles.signUpBtnText}
            buttonStyle={styles.signUpBtn}
            loading={loading}
          />
        </View>
      </CustomScrollview>
    </View>
  );
};

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => {
  return {
    updateUser: data => dispatch(User.updateUser(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RequiredInfoScreen);
