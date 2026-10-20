import { useState } from 'react';
import { useAccount } from '../account/AccountContext';
import { useShop } from '../shop/ShopContext';
import { confirmPhoneCode, loadCustomerProfile, sendPhoneCode } from '../services/customerAccount';

// ── Friendly text for Firebase phone errors ──
const PHONE_ERRORS = {
  'auth/credential-already-in-use': 'This number is already linked to another account.',
  'auth/account-exists-with-different-credential': 'This number is already linked to another account.',
  'auth/provider-already-linked': 'A phone number is already linked to this account.',
  'auth/invalid-verification-code': 'Incorrect code. Please check and retry.',
  'auth/code-expired': 'That code expired — please send a new one.',
  'auth/too-many-requests': 'Too many attempts. Please try again after a few minutes.',
  'auth/quota-exceeded': 'Daily SMS limit reached. Please try again tomorrow.',
  'auth/operation-not-allowed': 'Phone sign-in is not enabled in Firebase Console (Authentication → Sign-in method → Phone).',
  'auth/unauthorized-domain': 'This domain is not authorized in Firebase Console (Authentication → Settings → Authorized domains).',
};
const phoneErrorText = err => PHONE_ERRORS[err.code] || (err.code ? `Could not verify phone (${err.code}).` : err.message);

/**
 * SMS check for the logged-in customer's phone: send code → enter code → linked & verified.
 *
 * >>> <PhoneVerifyStep phone="+919812345678" onDone={() => navigate('/')} onSkip={() => navigate('/')} />
 */
export default function PhoneVerifyStep({ phone, onDone, onSkip }) {
  const { user, setProfile } = useAccount();
  const { showToast } = useShop();
  const [pending, setPending] = useState(null); // Firebase confirmation once the SMS is sent
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const run = async action => {
    setBusy(true); setError('');
    try { await action(); }
    catch (err) { console.error(err); setError(phoneErrorText(err)); }
    finally { setBusy(false); }
  };

  const sendCode = () => run(async () => {
    setPending(await sendPhoneCode(phone, 'recaptcha-container'));
    showToast('SMS code sent! 📲');
  });

  const confirm = () => run(async () => {
    if (code.length < 6) throw { message: 'Please enter the full 6-digit code' };
    await confirmPhoneCode(pending, code);
    setProfile(await loadCustomerProfile(user.uid));
    showToast(`Phone ${phone} verified ✓`);
    onDone();
  });

  return (
    <div className="phone-otp-box">
      <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>
        {pending ? `💬 Enter the 6-digit code sent to ${phone}:` : `Verify your mobile ${phone} with a one-time SMS code.`}
      </div>
      {pending && (
        <input type="text" value={code} onChange={e => setCode(e.target.value.trim())} placeholder="6-digit code" maxLength={6} inputMode="numeric"
          style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', textAlign: 'center', fontWeight: 700, letterSpacing: '0.18em', marginBottom: 8 }} />
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        {pending
          ? <button type="button" className="btn btn-sage btn-sm" disabled={busy} onClick={confirm}>Confirm Code</button>
          : <button type="button" className="btn btn-sage btn-sm" disabled={busy} onClick={sendCode}>{busy ? 'Sending…' : 'Send Code'}</button>}
        {pending && <button type="button" className="btn btn-outline btn-sm" disabled={busy} onClick={sendCode}>Resend</button>}
        {onSkip && <button type="button" className="btn-link" onClick={onSkip}>Skip for now</button>}
      </div>
      {error && <div className="coupon-status error" style={{ marginTop: 8 }}>⚠️ {error}</div>}
      <div id="recaptcha-container"></div>
    </div>
  );
}
