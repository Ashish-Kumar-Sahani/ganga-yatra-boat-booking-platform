import dns from "dns";

// Set of common disposable email domains
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "yopmail.com",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "dispostable.com",
  "guerrillamail.com",
  "sharklasers.com",
  "fakeinbox.com",
  "getairmail.com",
  "tempail.com",
  "throwawaymail.com",
  "temp-mail.io",
  "tempmailo.com",
  "maildrop.cc",
  "mailnesia.com",
]);

// Set of common weak passwords to reject
const WEAK_PASSWORDS = new Set([
  "12345678",
  "123456789",
  "password",
  "password123",
  "admin123",
  "admin12345",
  "qwerty",
  "qwerty123",
  "welcome123",
  "gangayatra",
  "gangayatra123",
]);

/**
 * Validate email format using regex.
 */
export const validateEmailFormat = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Check if the email belongs to a known disposable email provider.
 */
export const isDisposableEmail = (email: string): boolean => {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain ? DISPOSABLE_DOMAINS.has(domain) : false;
};

/**
 * Perform MX and A record DNS lookups to verify the email domain exists and can receive mail.
 */
export interface DomainValidationResult {
  isValid: boolean;
  serviceUnavailable?: boolean;
}

export const validateEmailDomain = (email: string): Promise<DomainValidationResult> => {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return Promise.resolve({ isValid: false });

  return new Promise((resolve) => {
    // Check MX records first
    dns.resolveMx(domain, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        // Fallback: Check A record if MX lookup fails
        dns.resolve4(domain, (err4, addresses4) => {
          if (err4) {
            // DNS lookup failed for the domain.
            // Let's verify if DNS resolution is working generally by querying google.com
            dns.resolve4("google.com", (errGoogle) => {
              if (errGoogle) {
                // general DNS query failed, indicating DNS service/network issue
                resolve({ isValid: false, serviceUnavailable: true });
              } else {
                // general DNS works, so the domain itself is invalid
                resolve({ isValid: false, serviceUnavailable: false });
              }
            });
          } else {
            resolve({ isValid: !!(addresses4 && addresses4.length > 0) });
          }
        });
      } else {
        resolve({ isValid: true });
      }
    });
  });
};

/**
 * Validate and normalize Indian 10-digit mobile number.
 * Accept optional +91 or 91 prefix. Normalize to 10 digits.
 */
export const validateAndNormalizePhone = (phone: string): { isValid: boolean; normalized?: string } => {
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
  if (!phoneRegex.test(cleaned)) {
    return { isValid: false };
  }
  return { isValid: true, normalized: cleaned.slice(-10) };
};

/**
 * Validate password strength.
 * Enforce >= 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char, and reject weak common patterns.
 */
export const validatePasswordStrength = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters long." };
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
    return { isValid: false, message: "Password must contain uppercase, lowercase, number and special character" };
  }

  // Check common weak passwords
  if (WEAK_PASSWORDS.has(password.toLowerCase())) {
    return { isValid: false, message: "Password is too common or easily guessable." };
  }

  return { isValid: true };
};
