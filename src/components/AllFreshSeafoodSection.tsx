import { useState, useMemo } from "react";
import { ArrowUpDown, Fish, ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { PRODUCTS } from "../mock/data";
import { ProductCard } from "./product/ProductCard";

interface Props {
  currentProductId: string;
}

const ITEMS_PER_PAGE = 8;

export function AllFreshSeafoodSection({ currentProductId }: Props) {
  const [sortOrder, setSortOrder] = useState<"low" | "high" | "name" | "rating">("low");
  const [showAll, setShowAll] = useState(false);

  const allProducts = useMemo(() => {
    const items = PRODUCTS.filter((p) => p.id !== currentProductId);

    return items.sort((a, b) => {
      if (sortOrder === "low") {
        return Math.min(...a.sizes.map((s) => s.price)) - Math.min(...b.sizes.map((s) => s.price));
      }
      if (sortOrder === "high") {
        return Math.min(...b.sizes.map((s) => s.price)) - Math.min(...a.sizes.map((s) => s.price));
      }
      if (sortOrder === "name") {
        return a.title.localeCompare(b.title);
      }
      return b.rating - a.rating;
    });
  }, [sortOrder, currentProductId]);

  const displayedProducts = showAll ? allProducts : allProducts.slice(0, ITEMS_PER_PAGE);

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Fish size={20} className="text-[#0369a1]" />
          </div>
          <div>
            <h2 className="text-[#0c4a6e]" style={{ fontSize: "1.4rem" }}>
              All Fresh Seafood
            </h2>
            <p className="text-gray-400" style={{ fontSize: "0.8rem" }}>
              Explore our complete collection of premium seafood
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown size={14} className="text-gray-400" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
              className="bg-gray-100 text-gray-600 rounded-lg px-3 py-1.5 border-none outline-none cursor-pointer appearance-none pr-7"
              style={{
                fontSize: "0.78rem",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 8px center",
              }}
            >
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="name">Name: A–Z</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          <Link
            to="/all-seafood"
            className="hidden sm:inline-flex text-[#0369a1] hover:text-[#0c4a6e] transition-colors items-center gap-1"
            style={{ fontSize: "0.82rem" }}
          >
            View All
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedProducts.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {!showAll && allProducts.length > ITEMS_PER_PAGE && (
        <div className="text-center mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-[#0369a1] text-[#0369a1] rounded-full hover:bg-[#0369a1] hover:text-white transition-colors"
            style={{ fontSize: "0.85rem" }}
          >
            <ChevronDown size={16} />
            Show All Seafood ({allProducts.length} items)
          </motion.button>
        </div>
      )}
    </section>
  );
}
