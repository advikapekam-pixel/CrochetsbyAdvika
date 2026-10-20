import { useState } from 'react';
import { useShop } from '../shop/ShopContext';
import { useAccount } from '../account/AccountContext';
import { cleanIndianPhone, isValidIndianPhone } from '../shop/indianPhone';
import { whatsappAdvikaLink } from '../shop/whatsapp';
import { placeOrder, shortOrderId } from '../services/orders';

const PALETTES = [
  { label: '🌸 Pastel Dreams', value: 'Pastel Dreams (Lilac, Mint, Peach)' },
  { label: '🌻 Sunflower Bloom', value: 'Sunflower Bloom (Yellow, Green, Terracotta)' },
  { label: '🌿 Earthy Sage', value: 'Earthy Sage & Cream' },
  { label: '🌊 Ocean Breeze', value: 'Ocean Turquoise & White' },
  { label: '🖤 Monochrome', value: 'Classic Monochrome' },
];

const BUDGETS = [
  '₹350 – ₹600 (Charms, Small Headbands)',
  '₹600 – ₹1000 (Plushies, Sunglasses Holders, Beanies)',
  '₹1000 – ₹2000 (Large Bouquets, Detailed Amigurumi)',
  '₹2000+ (Special Sets & Custom Bundles)',
];

/**
 * Custom order request: name, phone, palette, budget, idea. Saves the request
 * and opens WhatsApp with the details pre-filled.
 *
 * >>> <Route path="/custom-order" element={<CustomOrderPage />} />
 */
export default function CustomOrderPage() {
  const { showToast } = useShop();
  const { user, profile } = useAccount();
  const [palette, setPalette] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async e => {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.target));
    if (!isValidIndianPhone(form.phone)) { showToast('Please enter a valid 10-digit mobile number'); return; }

    const order = {
      type: 'custom',
      name: form.name,
      phone: '+91' + cleanIndianPhone(form.phone),
      phoneVerified: Boolean(profile?.phoneVerified && profile.phone === '+91' + cleanIndianPhone(form.phone)),
      email: form.email,
      budget: form.budget,
      idea: form.idea,
      palette,
      paymentStatus: 'pending_discussion',
    };

    // Open the tab now: browsers block window.open after an await
    const waTab = window.open('', '_blank');
    setSending(true);
    try {
      const orderNumber = shortOrderId(await placeOrder(order, user?.uid));
      setSent(true);
      showToast('Custom idea sent! Let\'s chat on WhatsApp ✦');
      const text = `Hi Advika! 🧶 I've submitted a Custom Crochet Request (#${orderNumber}):\n• Name: ${order.name}\n• Budget: ${order.budget}\n• Palette: ${palette || 'Custom choice'}\n• Idea: ${order.idea}\n\nI'd like to discuss the design, timeline, and share reference photos! ✨`;
      if (waTab) waTab.location.href = whatsappAdvikaLink(text);
    } catch (err) {
      console.error(err);
      waTab?.close();
      showToast('Could not send idea — please check details and retry.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="page active">
      <div className="wrap form-shell">
        <div className="form-card">
          <div className="eyebrow"><span className="dot"></span> Bespoke Creations</div>
          <h2 style={{ marginTop: 8 }}>Start a custom order</h2>
          <p className="sub">Have a dream plushie, character, or colour combo in mind? Tell me your idea, and let's finalize the design &amp; price together!</p>
          <div className={`success-banner${sent ? ' show' : ''}`}>Thanks! Your custom idea is received — let's connect on WhatsApp! ✦</div>

          <form onSubmit={submit} key={user?.uid || 'guest'}>
            <div className="row-2">
              <div className="field"><label htmlFor="ocName">Your Name *</label><input id="ocName" name="name" type="text" defaultValue={profile?.name} placeholder="Full name" required /></div>
              <div className="field"><label htmlFor="ocPhone">Phone / WhatsApp *</label><input id="ocPhone" name="phone" type="tel" defaultValue={cleanIndianPhone(profile?.phone)} placeholder="10-digit mobile number" required maxLength={10} inputMode="numeric" /></div>
            </div>
            <div className="field"><label htmlFor="ocEmail">Email Address</label><input id="ocEmail" name="email" type="email" defaultValue={user?.email} placeholder="you@email.com" /></div>

            <div className="field">
              <label>Pick a Suggested Colour Palette (optional)</label>
              <div className="chip-grid">
                {PALETTES.map(p => (
                  <span key={p.value} className={`chip-item${palette === p.value ? ' active' : ''}`} onClick={() => setPalette(p.value)}>{p.label}</span>
                ))}
              </div>
            </div>

            <div className="field">
              <label htmlFor="ocBudget">Budget Range (estimated)</label>
              <select id="ocBudget" name="budget">{BUDGETS.map(b => <option key={b}>{b}</option>)}</select>
            </div>
            <div className="field">
              <label htmlFor="ocIdea">Describe Your Idea *</label>
              <textarea id="ocIdea" name="idea" placeholder="What would you like me to make? Character, colors, sizing, or occasion..." required />
            </div>

            <p style={{ fontSize: 12.5, color: 'var(--charcoal-soft)', marginBottom: 18 }}>
              ✦ After submitting, you can send sketches, Pinterest pins, or reference photos directly to Advika in WhatsApp chat!
            </p>
            <button type="submit" className="btn btn-rose btn-block" disabled={sending}>{sending ? 'Sending...' : 'Send My Idea & Connect on WhatsApp →'}</button>
          </form>
        </div>
      </div>
    </section>
  );
}
