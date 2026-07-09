/**
 * Check whether permit is expired
 */
export const isPermitExpired = (validTill: Date): boolean => {
  const today = new Date();

  // remove time portion for accurate date comparison
  today.setHours(0, 0, 0, 0);

  const permitExpiryDate = new Date(validTill);
  permitExpiryDate.setHours(0, 0, 0, 0);

  return today > permitExpiryDate;
};

/**
 * Check permit validity status
 */
export const getPermitStatus = (validTill: Date): string => {
  return isPermitExpired(validTill)
    ? "EXPIRED"
    : "ACTIVE";
};

/**
 * Calculate remaining permit days
 */
export const getRemainingPermitDays = (
  validTill: Date
): number => {
  const today = new Date();

  const expiryDate = new Date(validTill);

  const diffTime =
    expiryDate.getTime() - today.getTime();

  return Math.ceil(
    diffTime / (1000 * 60 * 60 * 24)
  );
};

/**
 * Check if permit will expire soon
 * Default alert before 30 days
 */
export const isPermitExpiringSoon = (
  validTill: Date,
  alertDays: number = 30
): boolean => {
  const remainingDays =
    getRemainingPermitDays(validTill);

  return (
    remainingDays >= 0 &&
    remainingDays <= alertDays
  );
};