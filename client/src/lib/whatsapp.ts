export function buildWhatsAppUrl(phoneDigitsOnly: string, message: string): string {
  return `https://wa.me/${phoneDigitsOnly}?text=${encodeURIComponent(message)}`;
}
