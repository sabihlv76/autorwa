"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { currencies } from "@/lib/currency";
import type { Currency } from "@/types/product";

const STORAGE_KEY = "autorwa-currency";
const DEFAULT_CURRENCY: Currency = "RWF";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && currencies.includes(stored as Currency)) {
      // One-time hydration of a persisted preference after mount; SSR/first
      // render already match the default, so this can't cascade.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrencyState(stored as Currency);
    }
  }, []);

  const setCurrency = useCallback((next: Currency) => {
    setCurrencyState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo<CurrencyContextValue>(
    () => ({ currency, setCurrency }),
    [currency, setCurrency],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return ctx;
}
