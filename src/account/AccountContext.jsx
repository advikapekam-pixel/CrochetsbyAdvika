import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { loadCustomerProfile } from '../services/customerAccount';

const AccountContext = createContext(null);

/**
 * Who is logged in: { user, profile, isAdmin, ready, setProfile }.
 * `ready` is false until Firebase reports the first auth state.
 *
 * >>> <AccountProvider><ShopProvider><App /></ShopProvider></AccountProvider>
 */
export function AccountProvider({ children }) {
  const [state, setState] = useState({ user: null, profile: null, ready: false });

  useEffect(() => onAuthStateChanged(auth, async user => {
    let profile = null;
    if (user) {
      try { profile = await loadCustomerProfile(user.uid); }
      catch (err) { console.error('Profile fetch failed:', err); }
    }
    setState({ user, profile, ready: true });
  }), []);

  const setProfile = profile => setState(s => ({ ...s, profile }));
  const isAdmin = state.profile?.role === 'admin';

  return (
    <AccountContext.Provider value={{ ...state, isAdmin, setProfile }}>
      {children}
    </AccountContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAccount = () => useContext(AccountContext);
