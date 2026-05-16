"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';

interface CreditsContextType {
    credits: number | null;   // null = still loading
    loading: boolean;
    refreshCredits: () => Promise<void>;
    deductCredit: (description?: string) => Promise<boolean>;
}

const CreditsContext = createContext<CreditsContextType>({
    credits: null,
    loading: true,
    refreshCredits: async () => {},
    deductCredit: async () => false,
});

export function useCredits() {
    return useContext(CreditsContext);
}

export default function CreditsProvider({ children }: { children: ReactNode }) {
    const { isSignedIn } = useUser();
    const [credits, setCredits] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshCredits = useCallback(async () => {
        if (!isSignedIn) {
            setCredits(null);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const res = await fetch('/api/credits');
            if (res.ok) {
                const data = await res.json();
                setCredits(data.credits);
            }
        } catch (err) {
            console.error('Failed to fetch credits:', err);
        } finally {
            setLoading(false);
        }
    }, [isSignedIn]);

    // Deduct 1 credit — returns true if successful, false if insufficient
    const deductCredit = useCallback(async (description?: string): Promise<boolean> => {
        try {
            const res = await fetch('/api/credits/deduct', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setCredits(data.credits);
                return true;
            }
            return false;
        } catch (err) {
            console.error('Failed to deduct credit:', err);
            return false;
        }
    }, []);

    useEffect(() => {
        refreshCredits();
    }, [refreshCredits]);

    return (
        <CreditsContext.Provider value={{ credits, loading, refreshCredits, deductCredit }}>
            {children}
        </CreditsContext.Provider>
    );
}
