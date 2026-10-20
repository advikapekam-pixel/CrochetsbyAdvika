import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '../account/AccountContext';
import PhoneVerifyStep from '../components/PhoneVerifyStep';
import { useShop } from '../shop/ShopContext';
import { cleanIndianPhone, isValidIndianPhone } from '../shop/indianPhone';
import { loadCustomerProfile, logInCustomer, signUpCustomer } from '../services/customerAccount';

const SIGNUP_ERRORS = {
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/invalid-email': 'Please enter a valid email address.',
};

/**
 * Log in / sign up. Signup creates the email account, then asks for the SMS
 * code that links the phone to that same account.
 *
 * >>> <Route path="/login" element={<LoginPage />} />
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { setProfile } = useAccount();
  const { showToast } = useShop();
  const [mode, setMode] = useState('login');
  const [busy, setBusy] = useState(false);
  const [phoneToVerify, setPhoneToVerify] = useState(null); // set after signup succeeds
  const isSignup = mode === 'signup';

  const submit = async e => {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.target));
    setBusy(true);
    try {
      if (!isSignup) {
        await logInCustomer(form.email, form.password);
        showToast('Welcome back! ✦');
        navigate('/');
        return;
      }
      // ── Signup ──
      if (!form.name.trim()) { showToast('Please enter your full name'); return; }
      if (!isValidIndianPhone(form.phone)) { showToast('Please enter a valid 10-digit Indian mobile number'); return; }
      const phone = '+91' + cleanIndianPhone(form.phone);
      const user = await signUpCustomer({ name: form.name.trim(), email: form.email, password: form.password, phone });
      setProfile(await loadCustomerProfile(user.uid)); // auth listener may have run before the profile existed
      showToast('Account created! Now verify your mobile ✦');
      setPhoneToVerify(phone);
    } catch (err) {
      console.error(err);
      showToast(isSignup ? SIGNUP_ERRORS[err.code] || 'Could not create account.' : 'Incorrect email or password. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="page active">
      <div className="wrap form-shell">
        <div className="form-card">
          {phoneToVerify ? (
            <>
              <h2>One last step</h2>
              <p className="sub">Verify your mobile so Advika can reach you on WhatsApp about your orders.</p>
              <PhoneVerifyStep phone={phoneToVerify} onDone={() => navigate('/')} onSkip={() => navigate('/')} />
            </>
          ) : (
            <>
              <div className="auth-toggle">
                <button className={isSignup ? '' : 'active'} onClick={() => setMode('login')}>Log In</button>
                <button className={isSignup ? 'active' : ''} onClick={() => setMode('signup')}>Sign Up</button>
              </div>
              <h2>{isSignup ? 'Create your account' : 'Welcome back'}</h2>
              <p className="sub">{isSignup ? 'Sign up to save your wishlist and track custom orders.' : 'Log in to track orders.'}</p>
              <form onSubmit={submit}>
                {isSignup && <>
                  <div className="field"><label htmlFor="authName">Full Name *</label><input id="authName" name="name" type="text" placeholder="Advika Pekam" required /></div>
                  <div className="field"><label htmlFor="authPhone">Mobile Number (WhatsApp) *</label><input id="authPhone" name="phone" type="tel" placeholder="10-digit mobile number" maxLength={10} inputMode="numeric" required /></div>
                </>}
                <div className="field"><label htmlFor="authEmail">Email Address *</label><input id="authEmail" name="email" type="email" placeholder="you@email.com" required /></div>
                <div className="field"><label htmlFor="authPass">Password *</label><input id="authPass" name="password" type="password" placeholder="••••••••" required minLength={isSignup ? 6 : undefined} /></div>
                <button type="submit" className="btn btn-charcoal btn-block" disabled={busy}>
                  {busy ? 'Please wait...' : isSignup ? 'Sign Up' : 'Log In'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
