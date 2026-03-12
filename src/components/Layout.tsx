import { Outlet } from "react-router";
import { useState, createContext, useContext, useCallback } from "react";
import { PromotionHeader } from "./PromotionHeader";
import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { WhyBuySection } from "./WhyBuySection";
import type { CartItem, ProductSize } from "../mock/data";
import { Toaster } from "sonner";

interface CartContextType {
  cartCount: number;
  cartItems: CartItem[];
  addToCart: (item?: { productId: string; title: string; image: string; category: string; size: ProductSize; quantity: number }) => void;
  removeFromCart: (productId: string, sizeLabel: string) => void;
  updateQuantity: (productId: string, sizeLabel: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

export const CartContext = createContext<CartContextType>({
  cartCount: 0,
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartTotal: 0,
});

export const useCart = () => useContext(CartContext);

export function Layout() {
  const [showPromo, setShowPromo] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((item?: { productId: string; title: string; image: string; category: string; size: ProductSize; quantity: number }) => {
    if (!item) return;
    setCartItems((prev) => {
      const existing = prev.find(
        (ci) => ci.productId === item.productId && ci.size.label === item.size.label
      );
      if (existing) {
        return prev.map((ci) =>
          ci.productId === item.productId && ci.size.label === item.size.label
            ? { ...ci, quantity: ci.quantity + item.quantity }
            : ci
        );
      }
      return [...prev, { ...item }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, sizeLabel: string) => {
    setCartItems((prev) =>
      prev.filter((ci) => !(ci.productId === productId && ci.size.label === sizeLabel))
    );
  }, []);

  const updateQuantity = useCallback((productId: string, sizeLabel: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, sizeLabel);
      return;
    }
    setCartItems((prev) =>
      prev.map((ci) =>
        ci.productId === productId && ci.size.label === sizeLabel
          ? { ...ci, quantity }
          : ci
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCartItems([]), []);

  const cartCount = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);
  const cartTotal = cartItems.reduce((sum, ci) => sum + ci.size.price * ci.quantity, 0);

  return (
    <CartContext.Provider value={{ cartCount, cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
      <div className="min-h-screen flex flex-col bg-white">
        {showPromo && <PromotionHeader onClose={() => setShowPromo(false)} />}
        <Header />
        <Navigation />
        <main className="flex-1">
          <Outlet />
          <WhyBuySection />
        </main>
        <Footer />
        <Toaster position="bottom-right" richColors closeButton />
      </div>
    </CartContext.Provider>
  );
}