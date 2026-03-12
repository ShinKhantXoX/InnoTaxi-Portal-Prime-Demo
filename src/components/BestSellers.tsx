import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { PRODUCTS } from "../mock/data";
import { ProductCard } from "./product/ProductCard";

export function BestSellers() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const amount = dir === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <section id="best-sellers" className="py-16 bg-gradient-to-b from-white to-blue-50/50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-[#0c4a6e] mb-2" style={{ fontSize: "1.75rem" }}>Best Sellers</h2>
          <p className="text-gray-500" style={{ fontSize: "0.9rem" }}>Our most popular products loved by customers</p>
          <div className="w-16 h-1 bg-[#0369a1] mx-auto mt-3 rounded-full" />
        </motion.div>

        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg text-[#0369a1] p-2 rounded-full hover:bg-blue-50 transition-colors hidden md:block"
          >
            <ChevronLeft size={20} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {bestSellers.map((product) => (
              <div key={product.id} className="min-w-[260px] max-w-[280px] snap-start flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg text-[#0369a1] p-2 rounded-full hover:bg-blue-50 transition-colors hidden md:block"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
