/**
 * Strip spaces, dashes and a +91 / 91 / 0 prefix from an Indian phone number.
 *
 * >>> cleanIndianPhone('+91 98123-45678')
 * '9812345678'
 */
export function cleanIndianPhone(input) {
  return String(input || '').replace(/[\s-]/g, '').replace(/^(\+91|91|0)/, '');
}

/**
 * True for a real-looking 10-digit Indian mobile (starts 6–9, not all one digit).
 *
 * >>> isValidIndianPhone('9812345678')
 * true
 * >>> isValidIndianPhone('9999999999')
 * false
 */
export function isValidIndianPhone(input) {
  const clean = cleanIndianPhone(input);
  return /^[6-9]\d{9}$/.test(clean) && !/^(\d)\1{9}$/.test(clean) && clean !== '1234567890';
}
