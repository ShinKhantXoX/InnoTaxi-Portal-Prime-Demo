import { useState } from "react";
import { ShoppingCart, Star, Eye, Check } from "lucide-react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "../Layout";
import { toast } from "sonner";
import type { Product } from "../../mock/data";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const [selectedSize, setSelectedSize] = useState(0);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const currentPrice = product.sizes[selectedSize];
  const priceRange = `$${product.sizes[0].price} - $${product.sizes[product.sizes.length - 1].price}`;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-md border border-blue-50 overflow-hidden group transition-shadow hover:shadow-xl"
    >
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-[4/3]">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-3 shadow-lg"
          >
            <Eye size={20} className="text-[#0369a1]" />
          </motion.div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isBestSeller && (
            <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full" style={{ fontSize: "0.65rem" }}>
              Best Seller
            </span>
          )}
          {!product.inStock && (
            <span className="bg-gray-500 text-white px-2 py-0.5 rounded-full" style={{ fontSize: "0.65rem" }}>
              Sold Out
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-center gap-1 mb-1">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          <span style={{ fontSize: "0.75rem" }} className="text-gray-600">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        <span className="text-[#0369a1] block mb-1" style={{ fontSize: "0.7rem" }}>
          {product.category}
        </span>

        <Link to={`/product/${product.id}`}>
          <h4 className="text-[#0c4a6e] hover:text-[#0369a1] transition-colors line-clamp-1" style={{ fontSize: "0.9rem" }}>
            {product.title}
          </h4>
        </Link>

        <div className="text-[#0369a1] mt-1 mb-2" style={{ fontSize: "0.85rem" }}>
          {priceRange}
        </div>

        {/* Size selector */}
        <div className="flex gap-1 mb-3">
          {product.sizes.map((size, i) => (
            <button
              key={size.label}
              onClick={() => setSelectedSize(i)}
              className={`flex-1 py-1 px-1 rounded border text-center transition-colors ${
                i === selectedSize
                  ? "bg-[#0369a1] text-white border-[#0369a1]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#0369a1]"
              }`}
              style={{ fontSize: "0.65rem" }}
            >
              {size.label}
              <br />
              <span style={{ fontSize: "0.6rem" }}>{size.weight}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#0c4a6e]" style={{ fontSize: "1.1rem" }}>
            ${currentPrice.price}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!product.inStock || added}
            onClick={(e) => {
              e.preventDefault();
              addToCart({
                productId: product.id,
                title: product.title,
                image: product.image,
                category: product.category,
                size: product.sizes[selectedSize],
                quantity: 1,
              });
              setAdded(true);
              toast.success(`${product.title} added to cart`, {
                description: `${product.sizes[selectedSize].label} · ${product.sizes[selectedSize].weight} — $${product.sizes[selectedSize].price}`,
                duration: 2500,
              });
              setTimeout(() => setAdded(false), 1500);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
              added
                ? "bg-green-500 text-white"
                : product.inStock
                  ? "bg-[#0369a1] text-white hover:bg-[#0c4a6e]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            style={{ fontSize: "0.75rem" }}
          >
            <AnimatePresence mode="wait">
              {added ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <Check size={14} />
                  Added!
                </motion.span>
              ) : (
                <motion.span
                  key="cart"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <ShoppingCart size={14} />
                  {product.inStock ? "Add to Cart" : "Sold Out"}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}