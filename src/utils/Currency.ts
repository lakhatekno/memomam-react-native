// As of June 2025, the approximate rate is 16,400 IDR to 1 USD.
// For a production app, fetch this from a live currency API.
const IDR_TO_USD_RATE = 16400;

/**
 * Converts an amount from Indonesian Rupiah (IDR) to US Dollars (USD).
 * @param amountInIDR The amount in IDR.
 * @returns The amount in USD, rounded to 2 decimal places.
 */
export const convertIDRtoUSD = (amountInIDR: number): number => {
  if (!amountInIDR) return 0;
  return parseFloat((amountInIDR / IDR_TO_USD_RATE).toFixed(2));
};