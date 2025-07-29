export const generateCompanyCode = (companyName) => {
  // Remove special characters and convert to uppercase
  const cleanName = companyName
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .toUpperCase()
    .split(' ')
    .slice(0, 3)  // Take first 3 words
    .map(word => word.charAt(0))  // Get first letter of each word
    .join('');

  // Add random alphanumeric characters to ensure uniqueness
  const randomChars = Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase();

  // Combine and ensure the length is between 6 and 10 characters
  let companyCode = (cleanName + randomChars).substring(0, 10).toUpperCase();

  // If the companyCode is shorter than 6 characters, pad it with random characters
  while (companyCode.length < 6) {
    const additionalChar = Math.random().toString(36).substring(2, 3).toUpperCase();
    companyCode += additionalChar;
  }

  return companyCode;
};
