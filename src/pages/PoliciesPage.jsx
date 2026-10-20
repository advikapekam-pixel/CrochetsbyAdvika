import { useNavigate, useParams } from 'react-router-dom';

// ── Policy tabs; the URL picks one (/policies/care) ──
const POLICIES = [
  {
    key: 'shipping', label: 'Shipping', title: 'Shipping Policy',
    body: <>
      <p>Every piece is made to order with patience. Please allow 3–7 days for crocheting before your order is dispatched. Once shipped, delivery takes 3–6 business days pan-India.</p>
      <p>You will receive live tracking updates directly as soon as your package is dispatched.</p>
    </>,
  },
  {
    key: 'payment', label: 'Payment & UPI', title: 'Payment & UPI Process',
    body: <>
      <p>Because each order is customized, payment is completed after confirming your details with Advika. Once we confirm colours, timeline, and delivery pin, Advika sends her personal UPI QR code directly on WhatsApp.</p>
      <p>Accepted payment methods: GPay, PhonePe, Paytm, or any UPI app.</p>
    </>,
  },
  {
    key: 'returns', label: 'Returns', title: 'Refund & Return Policy',
    body: <p>Since every piece is handmade to order, returns are accepted only if an item arrives damaged in transit or doesn't match the agreed design. Reach out within 48 hours of delivery with photos.</p>,
  },
  {
    key: 'care', label: 'Care Guide', title: 'Handmade Crochet Care Guide',
    body: <p>
      • <b>Washing:</b> Hand wash gently in cold water with mild detergent.<br />
      • <b>Drying:</b> Do not wring or twist. Lay flat on a dry towel in the shade to retain shape.<br />
      • <b>Storage:</b> Store plushies and accessories away from direct harsh sunlight.
    </p>,
  },
];

/**
 * Shipping, payment, returns and care policies as tabs.
 *
 * >>> <Route path="/policies/:tab?" element={<PoliciesPage />} />
 */
export default function PoliciesPage() {
  const navigate = useNavigate();
  const { tab } = useParams();
  const active = POLICIES.find(p => p.key === tab) || POLICIES[0];

  return (
    <section className="page active">
      <div className="wrap form-shell wide">
        <div className="page-header" style={{ paddingTop: 20 }}>
          <h1 style={{ fontSize: 'clamp(28px,4vw,40px)' }}>Policies &amp; Care Guides</h1>
        </div>
        <div className="filter-row" style={{ marginTop: 24 }}>
          {POLICIES.map(p => (
            <button key={p.key} className={`filter-pill${p === active ? ' active' : ''}`} onClick={() => navigate(`/policies/${p.key}`, { replace: true })}>{p.label}</button>
          ))}
        </div>
        <div className="form-card" style={{ marginTop: 16 }}>
          <div className="policy-panel" style={{ display: 'block' }}>
            <h3>{active.title}</h3>
            {active.body}
          </div>
        </div>
      </div>
    </section>
  );
}
