export function validatePhone(number: string): boolean {
  return /^[6-9]\d{9}$/.test(number);
}

export function validateAadhaar(aadhaar: string): boolean {
  return /^\d{12}$/.test(aadhaar);
}

export function validateCoupon(code: string): boolean {
  return /^[A-Z0-9]{6,10}$/.test(code);
}
