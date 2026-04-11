/**
 * Format a number as Pakistani Rupees (Rs.)
 */
export const formatCurrency = (n: number) => "Rs. " + n.toLocaleString("en-PK");

/**
 * Short alias used across admin pages
 */
export const fmt = formatCurrency;
