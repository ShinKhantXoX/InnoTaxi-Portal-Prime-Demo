import { Link, useNavigate } from "react-router";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Truck, Shield, Package } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "./Layout";

export function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  const shippingThreshold = 200;
  const freeShipping = cartTotal >= shippingThreshold;
  const shippingCost = freeShipping ? 0 : 15;
  const amountToFreeShipping = shippingThreshold - cartTotal;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
            <ShoppingCart size={40} className="text-[#0369a1]/40" />
          </div>
          <h2 className="text-[#0c4a6e] mb-2" style={{ fontSize: "1.5rem" }}>
            Your Cart is Empty
          </h2>
          <p className="text-gray-500 mb-8 max-w-md" style={{ fontSize: "0.9rem" }}>
            Looks like you haven't added any fresh seafood yet. Browse our collection and find something delicious!
          </p>
          <Link
            to="/all-seafood"
            className="inline-flex items-center gap-2 bg-[#0369a1] text-white px-6 py-3 rounded-full hover:bg-[#0c4a6e] transition-colors"
            style={{ fontSize: "0.9rem" }}
          >
            <Package size={18} />
            Browse Seafood
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6" style={{ fontSize: "0.85rem" }}>
        <Link to="/" className="text-[#0369a1] hover:underline flex items-center gap-1">
          <ArrowLeft size={14} /> Home
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-700">Shopping Cart</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[#0c4a6e]" style={{ fontSize: "1.75rem" }}>
          Shopping Cart
          <span className="text-gray-400 ml-2" style={{ fontSize: "1rem" }}>
            ({cartCount} {cartCount === 1 ? "item" : "items"})
          </span>
        </h1>
        <button
          onClick={clearCart}
          className="text-red-400 hover:text-red-600 transition-colors flex items-center gap-1.5 cursor-pointer"
          style={{ fontSize: "0.8rem" }}
        >
          <Trash2 size={14} />
          Clear Cart
        </button>
      </div>

      {/* Free shipping progress */}
      {!freeShipping && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Truck size={16} className="text-[#0369a1]" />
            <span className="text-[#0c4a6e]" style={{ fontSize: "0.85rem" }}>
              Add <span className="text-[#0369a1]">${amountToFreeShipping.toFixed(2)}</span> more for{" "}
              <span className="text-[#0369a1]">FREE shipping!</span>
            </span>
          </div>
          <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((cartTotal / shippingThreshold) * 100, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#0369a1] to-[#0ea5e9] rounded-full"
            />
          </div>
        </motion.div>
      )}

      {freeShipping && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 mb-8 flex items-center gap-2"
        >
          <Truck size={16} className="text-green-600" />
          <span className="text-green-700" style={{ fontSize: "0.85rem" }}>
            You've qualified for <strong>FREE shipping!</strong>
          </span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {cartItems.map((item) => (
              <motion.div
                key={`${item.productId}-${item.size.label}`}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-blue-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover border border-blue-100 hover:scale-105 transition-transform"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[#0369a1] block" style={{ fontSize: "0.7rem" }}>
                          {item.category}
                        </span>
                        <Link to={`/product/${item.productId}`}>
                          <h3 className="text-[#0c4a6e] hover:text-[#0369a1] transition-colors truncate" style={{ fontSize: "1rem" }}>
                            {item.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className="bg-blue-50 text-[#0369a1] px-2 py-0.5 rounded-full border border-blue-100"
                            style={{ fontSize: "0.72rem" }}
                          >
                            {item.size.label} · {item.size.weight}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId, item.size.label)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size.label, item.quantity - 1)}
                          className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors text-gray-500 hover:text-[#0369a1] cursor-pointer"
                        >
                          <Minus size={14} />
                        </button>
                        <span
                          className="px-3 py-1.5 border-x border-gray-200 text-[#0c4a6e] min-w-[40px] text-center"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size.label, item.quantity + 1)}
                          className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors text-gray-500 hover:text-[#0369a1] cursor-pointer"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-[#0369a1]" style={{ fontSize: "1.1rem" }}>
                          ${(item.size.price * item.quantity).toFixed(2)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-gray-400" style={{ fontSize: "0.72rem" }}>
                            ${item.size.price.toFixed(2)} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Continue Shopping */}
          <Link
            to="/all-seafood"
            className="inline-flex items-center gap-2 text-[#0369a1] hover:text-[#0c4a6e] transition-colors mt-4"
            style={{ fontSize: "0.85rem" }}
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm sticky top-28"
          >
            <h3 className="text-[#0c4a6e] mb-5" style={{ fontSize: "1.1rem" }}>
              Order Summary
            </h3>

            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between">
                <span className="text-gray-500" style={{ fontSize: "0.85rem" }}>
                  Subtotal ({cartCount} items)
                </span>
                <span className="text-[#0c4a6e]" style={{ fontSize: "0.9rem" }}>
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500" style={{ fontSize: "0.85rem" }}>
                  Shipping
                </span>
                <span className={freeShipping ? "text-green-600" : "text-[#0c4a6e]"} style={{ fontSize: "0.9rem" }}>
                  {freeShipping ? "FREE" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                <span className="text-[#0c4a6e]" style={{ fontSize: "1rem" }}>
                  Total
                </span>
                <span className="text-[#0369a1]" style={{ fontSize: "1.25rem" }}>
                  ${(cartTotal + shippingCost).toFixed(2)}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/checkout")}
              className="w-full bg-[#0369a1] text-white py-3.5 rounded-xl hover:bg-[#0c4a6e] transition-colors cursor-pointer flex items-center justify-center gap-2"
              style={{ fontSize: "0.95rem" }}
            >
              <Shield size={18} />
              Proceed to Checkout
            </motion.button>

            <p className="text-gray-400 text-center mt-3" style={{ fontSize: "0.72rem" }}>
              Secure checkout with SSL encryption
            </p>

            {/* Trust Badges */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { icon: <Truck size={16} />, label: "Free Ship $200+" },
                  { icon: <Shield size={16} />, label: "Quality Guaranteed" },
                  { icon: <Package size={16} />, label: "Fresh Delivery" },
                ].map((badge) => (
                  <div key={badge.label} className="flex flex-col items-center gap-1">
                    <span className="text-[#0369a1]">{badge.icon}</span>
                    <span className="text-gray-500" style={{ fontSize: "0.65rem" }}>
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}