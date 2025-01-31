'use client';
import { createContext, useContext, useEffect, useState } from 'react';
// import { createClient } from '@supabase/supabase-js';
import { createClient } from '@/app/utils/supabase/client';

type AuthContextType = {
  userName: string;
  userRole: string;
  userStoreId: number;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // const [userName, setUserName] = useState('');
  // const [usersRole, setUsersRole ] = useState('')
  const [userDetails, setUserDetails] = useState({
    userName: '',
    userRole: '',
    userStoreId: 0,
  });

  useEffect(() => {
    const supabase = createClient();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // const userName = '';
      if (session?.user?.email) {
        const name = session.user.email;
        if (name.includes('@')) {
          const formattedName = name.split('@')[0];
          // setUserName(formattedName[0].toUpperCase() + formattedName.slice(1));
          setUserDetails(prevState => ({
            ...prevState,
            userName: formattedName[0].toUpperCase() + formattedName.slice(1),
          }));
        }
      } else {
        // setUserName('Account');
        setUserDetails(prevState => ({
          ...prevState,
          userName: 'Account',
        }));
      }

      if (session?.user?.user_metadata){
        const role = session.user.user_metadata.role ?? '';
        const store_id = session.user.user_metadata.store_id ?? 0;
        setUserDetails(prevState => ({
          ...prevState,
          userRole: role,
          userStoreId: store_id,
        }));
      }


      // if (session?.user?.user_metadata?.role){
        // setUsersRole(session.user.user_metadata.role)
        // const roleName = session.user.user_metadata.role;
      // }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={ userDetails }>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy context usage
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}