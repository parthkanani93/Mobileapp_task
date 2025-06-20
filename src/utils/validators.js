import strings from '../i18n/strings';

const passwordRegex =
  /^(?!.*#)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

//Password validation
const validatePassword = (pass, isConfrimPass, password) => {
  if (!pass) {
    return {
      status: false,
      msg: strings.plsEnterPassword,
    };
  } else if (pass.length < 8) {
    return {
      status: false,
      msg: strings.validatePassword,
    };
  } else {
    if (passwordRegex.test(pass)) {
      if (isConfrimPass && password != pass) {
        return {
          status: false,
          msg: strings.confirmPassValidString,
        };
      }
      return {status: true, msg: ''};
    } else {
      return {
        status: false,
        msg: strings.validatePassword,
      };
    }
  }
};

// Phone number validation
const validatePhoneNumber = (phone, countryCode = '+61') => {
  if (!phone) {
    return {
      status: false,
      msg: strings.thisFieldIsMandatory,
    };
  }

  let cleanPhone = phone.trim().replace(/\s+/g, '');

  if (countryCode === '+61') {
    if (cleanPhone.startsWith('0')) {
      cleanPhone = cleanPhone.substring(1);
    }

    if (!/^4\d{8}$/.test(cleanPhone)) {
      return {
        status: false,
        msg: 'Enter valid Australian mobile number (e.g. 4XXXXXXXX)',
      };
    }

    return {status: true, msg: ''};
  }

  return /^[0-9]{10,14}$/.test(cleanPhone)
    ? {status: true, msg: ''}
    : {
        status: false,
        msg: strings.validPhoneNumber,
      };
};

export {validatePassword, validatePhoneNumber};
