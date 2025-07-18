// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../firebase';

interface AuthState {
    user: User | null;
    isAdmin: boolean;
    isLoading: boolean;
}

export const useAuth = (): AuthState => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAdmin: false,
        isLoading: true,
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const tokenResult = await user.getIdTokenResult();
                    const isAdmin = tokenResult.claims.admin === true;
                    setAuthState({ user, isAdmin, isLoading: false });
                } catch (error) {
                    console.error("Error getting user token:", error);
                    setAuthState({ user, isAdmin: false, isLoading: false });
                }
            } else {
                setAuthState({ user: null, isAdmin: false, isLoading: false });
            }
        });

        return () => unsubscribe();
    }, []);

    return authState;
};