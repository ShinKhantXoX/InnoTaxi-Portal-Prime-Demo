import { useState, useMemo } from "react";
import { ArrowUpDown, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { PRODUCTS } from "../mock/data";
import { ProductCard } from "./product/ProductCard";

interface Props {
  currentProductId: string;
}

export function BestSellerItemsSection({ currentProductId }: Props) {
  const [sortOrder, setSortOrder] = useState<"low" | "high">("low");

  const bestSellers = useMemo(() => {
    const items = PRODUCTS.filter(
      (p) => p.isBestSeller && p.id !== currentProductId
    );

    return items.sort((a, b) => {
      const aMin = Math.min(...a.sizes.map((s) => s.price));
      const bMin = Math.min(...b.sizes.map((s) => s.price));
      return sortOrder === "low" ? aMin - bMin : bMin - aMin;
    });
  }, [sortOrder, currentProductId]);

  if (bestSellers.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <TrendingUp size={20} className="text-orange-500" />
          </div>
          <div>
            <h2 className="text-[#0c4a6e]" style={{ fontSize: "1.4rem" }}>
              Best Seller Items
            </h2>
            <p className="text-gray-400" style={{ fontSize: "0.8rem" }}>
              Our most popular picks loved by customers
            </p>
          </div>
        </div>

        {/* Sort toggle */}
        <div className="flex items-center gap-2">
          <ArrowUpDown size={14} className="text-gray-400" />
          <span className="text-gray-500 hidden sm:inline" style={{ fontSize: "0.8rem" }}>
            Price:
          </span>
          <div className="flex bg-gray-100 rounded-lg overflow-hidden">
            <button
              onClick={() => setSortOrder("low")}
              className={`px-3 py-1.5 transition-all ${
                sortOrder === "low"
                  ? "bg-[#0369a1] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              style={{ fontSize: "0.75rem" }}
            >
              Low to High
            </button>
            <button
              onClick={() => setSortOrder("high")}
              className={`px-3 py-1.5 transition-all ${
                sortOrder === "high"
                  ? "bg-[#0369a1] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              style={{ fontSize: "0.75rem" }}
            >
              High to Low
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {bestSellers.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
