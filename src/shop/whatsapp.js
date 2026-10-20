const ADVIKA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

/**
 * wa.me link that opens a chat with Advika, message pre-filled.
 *
 * >>> whatsappAdvikaLink('Hi Advika!')
 * 'https://wa.me/919876543210?text=Hi%20Advika!'
 */
export function whatsappAdvikaLink(text) {
  return `https://wa.me/${ADVIKA_NUMBER}?text=${encodeURIComponent(text)}`;
}
