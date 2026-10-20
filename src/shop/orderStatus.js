/**
 * Progress step (1–3) for an order status; old statuses map onto the 3 steps.
 *
 * >>> trackingStep('packed')
 * 3
 */
export function trackingStep(status) {
  if (['shipped', 'delivered', 'packed'].includes(status)) return 3;
  if (['in progress', 'yarn'].includes(status)) return 2;
  return 1;
}
