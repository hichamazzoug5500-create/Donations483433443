/**
 * Algerian Phone Number Utilities
 * Supports Mobilis (06), Djezzy (07), Ooredoo (05), Landlines (02x, 03x, 04x), and international (+213)
 */

export const sanitizePhoneInput = (val) => {
  if (!val) return '';
  // Allow only digits, plus sign at start, and spaces/dashes
  return val.replace(/[^\d+ -]/g, '');
};

export const formatAlgerianPhone = (val) => {
  if (!val) return '';
  const digits = val.replace(/\D/g, '');
  
  // Format international +213 xx xx xx xx
  if (val.startsWith('+213') || digits.startsWith('213')) {
    const localDigits = digits.startsWith('213') ? digits.slice(3) : digits;
    if (localDigits.length === 0) return '+213 ';
    if (localDigits.length <= 2) return `+213 ${localDigits}`;
    if (localDigits.length <= 4) return `+213 ${localDigits.slice(0, 2)} ${localDigits.slice(2)}`;
    if (localDigits.length <= 6) return `+213 ${localDigits.slice(0, 2)} ${localDigits.slice(2, 4)} ${localDigits.slice(4)}`;
    return `+213 ${localDigits.slice(0, 2)} ${localDigits.slice(2, 4)} ${localDigits.slice(4, 6)} ${localDigits.slice(6, 9)}`;
  }

  // Format local 05/06/07 xx xx xx xx
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6)}`;
  return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
};

export const isValidAlgerianPhone = (phone) => {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  
  // International format: 213 + 9 digits = 12 digits (e.g. 213550123456)
  if (digits.startsWith('213') && digits.length === 11 || digits.length === 12) {
    return true;
  }
  
  // Local format: 10 digits starting with 05, 06, 07, 02, 03, 04 (e.g. 0550123456)
  if (digits.length === 10 && (
    digits.startsWith('05') || 
    digits.startsWith('06') || 
    digits.startsWith('07') || 
    digits.startsWith('02') || 
    digits.startsWith('03') || 
    digits.startsWith('04')
  )) {
    return true;
  }

  // Minimum 9 digits fallback for landlines
  return digits.length >= 9 && digits.length <= 12;
};
