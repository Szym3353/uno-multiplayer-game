module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Nazwa użytkownika nie może być pusta";
  }
  if (email.trim() === "") {
    errors.username = "Adres e-mail nie może być pusty";
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Adres e-mail musi być prawidłowy";
    }
  }
  if (password === "") {
    errors.password = "Hasło nie może być puste";
  }
  if (password !== confirmPassword) {
    console.log(password, confirmPassword);
    errors.confirmPassword = "Podane hasła się nie zgadzają";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (email, password) => {
  const errors = {};
  if (email.trim() === "") {
    errors.username = "Adres e-mail nie może być pusty";
  }
  if (password === "") {
    errors.password = "Hasło nie może być puste";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
