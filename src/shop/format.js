/**
 * Format a rupee amount the Indian way.
 *
 * >>> formatPrice(1250)
 * '₹1,250'
 */
export function formatPrice(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

/**
 * CSS class for a product tag pill.
 *
 * >>> tagClassName('NEW')
 * 'tag-new'
 */
export function tagClassName(tag) {
  if (tag === 'BESTSELLER') return 'tag-best';
  if (tag === 'NEW') return 'tag-new';
  if (tag === 'SOLD OUT') return 'tag-sold';
  return '';
}

/**
 * Percent saved versus the original price (0 when not on sale).
 *
 * >>> discountPercent({ price: 350, originalPrice: 450 })
 * 22
 */
export function discountPercent(product) {
  return product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
}
