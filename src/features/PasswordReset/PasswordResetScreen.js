import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CustomScrollview, Input, Button } from '../../shared/components';
import User from '../../state/actions/User';
import { Validation } from '../../shared/functions';
import { colors, global } from '../../shared/styles/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    paddingHorizontal: 30
  },
  inputContainer: {
    marginTop: 20
  },
  primaryText: {
    ...global.textStyles.title,
    marginTop: 30,
    paddingHorizontal: 30,
    alignSelf: 'center',
    textAlign: 'center'
  },
  resetBtn: {
    marginTop: 30,
    marginBottom: 5,
    marginHorizontal: 20
  },
  resetBtnText: {},
  errorText: {
    ...global.textStyles.text,
    marginTop: 10,
    color: colors.errorRed,
    alignSelf: 'center'
  }
});

const PasswordResetScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const onChangeTextCallback = useCallback(
    (name, value) => {
      const newErrors = errors;
      if (newErrors[name]) {
        delete newErrors[name];
      }
      setErrors(newErrors);
      setEmail(value);
    },
    [errors]
  );

  const onPressResetPasswordCallback = useCallback(async () => {
    setLoading(true);

    const emailError = Validation.validEmail(email);
    if (emailError.length > 0) {
      setErrors({ email: emailError });
      setLoading(false);
      return;
    }
    try {
      await User.resetPassword(email);
      setShowSuccess(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrors({ reset: error.message });
    }
  }, [email]);

  const onPressGoBackCallback = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <CustomScrollview>
        <View style={styles.contentContainer}>
          {showSuccess && (
            <View style={styles.textContainer}>
              <Text style={styles.primaryText}>
                Please check your email for a link to reset your password.
              </Text>

              <Button
                title="Go Back"
                onPress={onPressGoBackCallback}
                textStyle={styles.resetBtnText}
                buttonStyle={styles.resetBtn}
              />
            </View>
          )}
          {!showSuccess && (
            <>
              <Input
                label="Email"
                value={email}
                name="email"
                placeholder="Email Address"
                onChangeText={onChangeTextCallback}
                containerStyle={styles.inputContainer}
                error={errors.email}
              />

              {errors.reset && <Text style={styles.errorText}>{errors.reset}</Text>}

              <Button
                title="Reset Password"
                onPress={onPressResetPasswordCallback}
                textStyle={styles.resetBtnText}
                buttonStyle={styles.resetBtn}
                loading={loading}
              />
            </>
          )}
        </View>
      </CustomScrollview>
    </View>
  );
};

// PasswordResetScreen.navigationOptions = {
//   title: 'Forgot Password'
// };

export default PasswordResetScreen;
