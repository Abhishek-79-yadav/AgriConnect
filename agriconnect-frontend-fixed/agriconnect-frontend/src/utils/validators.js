export const isEmail =
  (email) => {
    const regex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(
      email
    );
  };

export const isPhone =
  (phone) => {
    const regex =
      /^[6-9]\d{9}$/;

    return regex.test(
      phone
    );
  };

export const isStrongPassword =
  (password) => {
    return (
      password &&
      password.length >=
        8
    );
  };

export const isRequired =
  (value) => {
    return (
      value !== null &&
      value !==
        undefined &&
      value !== ""
    );
  };

export const validateRegister =
  (data) => {
    const errors = {};

    if (
      !isRequired(
        data.name
      )
    ) {
      errors.name =
        "Name is required";
    }

    if (
      !isEmail(
        data.email
      )
    ) {
      errors.email =
        "Invalid email";
    }

    if (
      !isStrongPassword(
        data.password
      )
    ) {
      errors.password =
        "Password must be at least 8 characters";
    }

    return errors;
  };

export const validateLogin =
  (data) => {
    const errors = {};

    if (
      !isEmail(
        data.email
      )
    ) {
      errors.email =
        "Invalid email";
    }

    if (
      !data.password
    ) {
      errors.password =
        "Password is required";
    }

    return errors;
  };