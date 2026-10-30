"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { MAX_QTY, safePriceLines, subtotalOf, type CartLineInput, type PricedLine } from "@/lib/order";

const STORAGE_KEY = "lpc-cart-v1";

type CartContextValue = {
  lines: PricedLine[];
  rawLines: CartLineInput[];
  count: number;
  subtotalCents: number;
  isOpen: boolean;
  hydrated: boolean;
  open: () => void;
  close: () => void;
  add: (slug: string, sizeId: string, quantity?: number) => void;
  setQuantity: (slug: string, sizeId: string, quantity: number) => void;
  remove: (slug: string, sizeId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [rawLines, setRawLines] = useState<CartLineInput[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(saved)) setRawLines(saved);
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(rawLines));
  }, [rawLines, hydrated]);

  const add = useCallback((slug: string, sizeId: string, quantity = 1) => {
    setRawLines((prev) => {
      const existing = prev.find((l) => l.slug === slug && l.sizeId === sizeId);
      if (existing) {
        return prev.map((l) =>
          l === existing ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + quantity) } : l,
        );
      }
      return [...prev, { slug, sizeId, quantity: Math.min(MAX_QTY, quantity) }];
    });
    setIsOpen(true);
  }, []);

  const setQuantity = useCallback((slug: string, sizeId: string, quantity: number) => {
    setRawLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => !(l.slug === slug && l.sizeId === sizeId))
        : prev.map((l) =>
            l.slug === slug && l.sizeId === sizeId ? { ...l, quantity: Math.min(MAX_QTY, quantity) } : l,
          ),
    );
  }, []);

  const remove = useCallback((slug: string, sizeId: string) => {
    setRawLines((prev) => prev.filter((l) => !(l.slug === slug && l.sizeId === sizeId)));
  }, []);

  const clear = useCallback(() => setRawLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const lines = safePriceLines(rawLines);
    return {
      lines,
      rawLines: lines.map(({ slug, sizeId, quantity }) => ({ slug, sizeId, quantity })),
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotalCents: subtotalOf(lines),
      isOpen,
      hydrated,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      setQuantity,
      remove,
      clear,
    };
  }, [rawLines, isOpen, hydrated, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
