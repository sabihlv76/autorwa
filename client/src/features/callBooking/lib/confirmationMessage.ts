export function buildCallBookingConfirmationMessage({
  bookingReference,
  customerName,
  preferredDate,
  preferredTime,
  productTitle,
}: {
  bookingReference: string;
  customerName: string;
  preferredDate: string;
  preferredTime: string;
  productTitle?: string;
}): string {
  const lines = [
    "AUTORWA CALL BOOKING CONFIRMED",
    `Booking Reference: ${bookingReference}`,
    `Hi ${customerName}, your call booking has been confirmed.`,
    `Date: ${preferredDate}`,
    `Time: ${preferredTime}`,
  ];

  if (productTitle) lines.push(`About: ${productTitle}`);

  lines.push("We'll call you at the scheduled time. Thank you for choosing Autorwa!");

  return lines.join("\n");
}
