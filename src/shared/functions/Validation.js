const validEmail = email => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const valid = re.test(String(email).toLowerCase());
  if (!valid) {
    return 'Please enter a valid email address.';
  }
  return '';
};

const validPassword = password => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/;
  const valid = re.test(password);
  if (!valid) {
    return 'Please enter a valid password.';
  }
  return '';
};

const validUsername = username => {
  const re = /^[a-zA-Z0-9-_]+$/;
  const valid = re.test(username);
  if (!valid) {
    return `Username can only contain letters, numbers, "-', and "_"`;
  }
  return '';
};
const validateForm = data => {
  const newErrors = {};

  Object.keys(data).forEach(key => {
    const { [key]: value } = data;
    if (!value || value.length < 1) {
      newErrors[key] = 'Field is required.';
    } else {
      if (key === 'email') {
        const emailCheck = validEmail(value);
        if (emailCheck.length > 0) {
          newErrors[key] = emailCheck;
        }
      }
      if (key === 'password') {
        const passwordCheck = validPassword(value);
        if (passwordCheck.length > 0) {
          newErrors[key] = passwordCheck;
        }
      }
      if (key === 'username') {
        const usernameCheck = validUsername(value);
        if (usernameCheck.length > 0) {
          newErrors[key] = usernameCheck;
        }
      }
    }
  });

  if (Object.entries(newErrors).length > 0) {
    return newErrors;
  }

  return false;
};

export default {
  validEmail,
  validPassword,
  validateForm
};
