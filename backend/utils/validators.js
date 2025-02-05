/**
 * Validates an IP address string
 * @param {string} ip - The IP address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidIP(ip) {
  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipPattern.test(ip)) return false;
  
  const octets = ip.split('.');
  return octets.every(octet => {
    const num = parseInt(octet);
    return num >= 0 && num <= 255;
  });
}

/**
 * Validates an IP range
 * @param {string} startIp - Starting IP address
 * @param {string} endIp - Ending IP address
 * @returns {string|null} - Error message if invalid, null if valid
 */
export function validateIPRange(startIp, endIp) {
  if (!isValidIP(startIp)) {
    return 'Invalid start IP address';
  }
  
  if (!isValidIP(endIp)) {
    return 'Invalid end IP address';
  }
  
  const start = startIp.split('.').map(Number);
  const end = endIp.split('.').map(Number);
  
  // Check if IPs are in the same subnet
  if (start[0] !== end[0] || start[1] !== end[1] || start[2] !== end[2]) {
    return 'IP addresses must be in the same subnet';
  }
  
  // Check if start IP is less than end IP
  const startNum = start[3];
  const endNum = end[3];
  
  if (startNum >= endNum) {
    return 'Start IP must be less than end IP';
  }
  
  // Check if range is reasonable (not too large)
  if (endNum - startNum > 255) {
    return 'IP range too large. Maximum range is 255 addresses';
  }
  
  return null;
}