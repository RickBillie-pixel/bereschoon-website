import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user profile and admin status (non-blocking)
  const fetchUserData = async (userId) => {
    if (!userId) {
      setProfile(null);
      setIsAdmin(false);
      return;
    }

    // Fetch in background without blocking - fire and forget
    Promise.all([
      supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
        .then(({ data }) => data)
        .catch(() => null),
      supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', userId)
        .single()
        .then(({ data }) => data)
        .catch(() => null)
    ]).then(([profileData, adminData]) => {
      setProfile(profileData);
      setIsAdmin(!!adminData);
    }).catch(() => {
      setProfile(null);
      setIsAdmin(false);
    });
  };

  useEffect(() => {
    // Get initial session - FAST, no blocking
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false); // ✅ Set loading false IMMEDIATELY
      
      // Fetch profile data in background (non-blocking)
      if (session?.user) {
        fetchUserData(session.user.id); // Don't await!
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false); // ✅ Set loading false IMMEDIATELY
        
        // Fetch profile data in background (non-blocking)
        if (session?.user) {
          fetchUserData(session.user.id); // Don't await!
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  // Sign up with email and password
  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) throw error;
    return data;
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  };

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  // Reset password
  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/winkel/account/wachtwoord-reset`
    });

    if (error) throw error;
  };

  // Update password
  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
  };

  // Update profile
  const updateProfile = async (updates) => {
    if (!user) throw new Error('No user logged in');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    setProfile(data);
    return data;
  };

  const value = {
    user,
    profile,
    isAdmin,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshProfile: () => fetchUserData(user?.id)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

