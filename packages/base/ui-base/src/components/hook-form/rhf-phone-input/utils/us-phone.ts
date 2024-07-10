export const normalize = (phone: string) => {
  const plainNumbers = phone?.replace(/\D/g, '');
  return `+${!plainNumbers?.startsWith('1') ? '1' : ''}${plainNumbers}`;
};

export const denormalize = (phone: string) => {
  if (phone.startsWith('+1')) {
    return phone.slice(2); // Remove the '+1' prefix
  } else if (phone.length === 11 && phone.startsWith('1')) {
    return phone.slice(1); // Remove the leading '1';
  }
  return phone;
};

export const formatPhoneWithHyphens = (phoneNumber?: string) => {
  if (!phoneNumber) return '';
  const cleanedNumber = denormalize(phoneNumber);

  if (cleanedNumber.length >= 10) {
    // Format the number with hyphens
    return `(${cleanedNumber.slice(
      0,
      3,
    )}-${cleanedNumber.slice(3, 6)}-${cleanedNumber.slice(6)})`;
  } else {
    // Return the original number if it doesn't meet the minimum length
    return phoneNumber;
  }
};

export const isValid = (phone: string) => {
  const plainNumbers = phone?.replace(/\D/g, '');
  return plainNumbers.length === 10 || plainNumbers.length === 11;
};
