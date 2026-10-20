import {
  createUserWithEmailAndPassword, linkWithPhoneNumber, RecaptchaVerifier,
  sendEmailVerification, signInWithEmailAndPassword, signOut,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { emailAdvikaNewSignup } from './notifyAdvika';

/**
 * Create an email/password account and its customer profile (phone not yet verified).
 *
 * >>> await signUpCustomer({ name: 'Riya Shah', email: 'riya@example.com', password: 'secret12', phone: '+919812345678' })
 * User { uid: 'kX9a…', email: 'riya@example.com' }
 */
export async function signUpCustomer({ name, email, password, phone }) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, 'users', user.uid), {
    name, email, role: 'customer', phone, phoneVerified: false, createdAt: serverTimestamp(),
  });
  sendEmailVerification(user).catch(err => console.warn('Verification email failed:', err));
  emailAdvikaNewSignup(name, email);
  return user;
}

/** Log in with email + password. */
export function logInCustomer(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

/** Log out the current customer. */
export function logOutCustomer() {
  return signOut(auth);
}

/**
 * Text a 6-digit code to the phone, to be linked to the logged-in account.
 * Linking (not signing in) keeps one account per customer — the old site's
 * signInWithPhoneNumber created a second, phone-only account.
 * `containerId` is an empty div the invisible reCAPTCHA renders into.
 *
 * >>> const pending = await sendPhoneCode('+919812345678', 'recaptcha-container')
 */
export async function sendPhoneCode(phone, containerId) {
  const verifier = new RecaptchaVerifier(auth, containerId, { size: 'invisible' });
  try { return await linkWithPhoneNumber(auth.currentUser, phone, verifier); }
  finally { verifier.clear(); }
}

/**
 * Check the SMS code; on success the phone is linked and marked verified on the profile.
 *
 * >>> await confirmPhoneCode(pending, '123456')
 */
export async function confirmPhoneCode(pending, code) {
  const { user } = await pending.confirm(code);
  await user.getIdToken(true); // refresh so Firestore rules see the newly linked phone
  await updateDoc(doc(db, 'users', user.uid), { phone: user.phoneNumber, phoneVerified: true });
}

/**
 * The customer's profile document, or null if none.
 *
 * >>> await loadCustomerProfile('kX9a…')
 * { name: 'Riya Shah', email: 'riya@example.com', role: 'customer', phone: '+919812345678', phoneVerified: true, createdAt: Timestamp }
 */
export async function loadCustomerProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

/**
 * Update name and phone. A changed phone loses its verified mark.
 *
 * >>> await updateCustomerProfile('kX9a…', { name: 'Riya S', phone: '+919812345678' }, profile)
 */
export async function updateCustomerProfile(uid, { name, phone }, current) {
  const phoneVerified = Boolean(current?.phoneVerified && current.phone === phone);
  await updateDoc(doc(db, 'users', uid), { name, phone, phoneVerified });
  return { ...current, name, phone, phoneVerified };
}
