import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { PRODUCTS, CATEGORIES } from "../mock/data";
import { ProductCard } from "./product/ProductCard";

type SortOption = "best-seller" | "price-low-high" | "price-high-low";

const ITEMS_PER_PAGE = 10;

interface AllSeafoodSectionProps {
  fullPage?: boolean;
  initialCategory?: string | null;
  initialSearch?: string | null;
}

export function AllSeafoodSection({ fullPage = false, initialCategory = null, initialSearch = null }: AllSeafoodSectionProps) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortOption>("best-seller");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch || "");

  const sorted = useMemo(() => {
    let items = [...PRODUCTS];

    // Filter by search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (selectedCategory) {
      items = items.filter(
        (p) =>
          p.category.toLowerCase().replace(/\s+/g, "-") === selectedCategory.toLowerCase() ||
          p.category.toLowerCase() === selectedCategory.toLowerCase() ||
          p.subCategory.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    switch (sortBy) {
      case "best-seller":
        return items.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
      case "price-low-high":
        return items.sort((a, b) => a.sizes[0].price - b.sizes[0].price);
      case "price-high-low":
        return items.sort((a, b) => b.sizes[b.sizes.length - 1].price - a.sizes[a.sizes.length - 1].price);
      default:
        return items;
    }
  }, [sortBy, selectedCategory, searchTerm]);

  const itemsPerPage = fullPage ? 20 : ITEMS_PER_PAGE;
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section id="all-seafood" className="py-16 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2 className="text-[#0c4a6e] mb-2" style={{ fontSize: "1.75rem" }}>
          {selectedCategory
            ? CATEGORIES.find(
                (c) => c.slug === selectedCategory || c.name.toLowerCase() === selectedCategory.toLowerCase()
              )?.name || selectedCategory.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
            : "All Fresh Seafood"}
        </h2>
        <p className="text-gray-500" style={{ fontSize: "0.9rem" }}>
          {selectedCategory ? `Browse our ${selectedCategory.replace(/-/g, " ")} collection` : "Browse our complete collection"}
        </p>
        <div className="w-16 h-1 bg-[#0369a1] mx-auto mt-3 rounded-full" />
      </motion.div>

      {/* Search banner */}
      {searchTerm && fullPage && (
        <div className="flex items-center justify-center gap-3 mb-6 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
          <Search size={16} className="text-[#0369a1]" />
          <span className="text-gray-600" style={{ fontSize: "0.85rem" }}>
            Search results for "<span className="text-[#0369a1]">{searchTerm}</span>" — {sorted.length} product{sorted.length !== 1 ? "s" : ""} found
          </span>
          <button
            onClick={() => { setSearchTerm(""); setCurrentPage(1); }}
            className="ml-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            title="Clear search"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Category filter tabs */}
      {fullPage && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}
            className={`px-4 py-1.5 rounded-full border transition-colors ${
              !selectedCategory
                ? "bg-[#0369a1] text-white border-[#0369a1]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#0369a1] hover:text-[#0369a1]"
            }`}
            style={{ fontSize: "0.8rem" }}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => { setSelectedCategory(cat.slug); setCurrentPage(1); }}
              className={`px-4 py-1.5 rounded-full border transition-colors ${
                selectedCategory === cat.slug
                  ? "bg-[#0369a1] text-white border-[#0369a1]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#0369a1] hover:text-[#0369a1]"
              }`}
              style={{ fontSize: "0.8rem" }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Sort controls */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
        <span className="text-gray-500" style={{ fontSize: "0.85rem" }}>
          Showing {paginated.length} of {sorted.length} products
        </span>
        <div className="flex items-center gap-2">
          <span className="text-gray-600" style={{ fontSize: "0.85rem" }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as SortOption);
              setCurrentPage(1);
            }}
            className="border border-blue-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-[#0369a1]"
            style={{ fontSize: "0.85rem" }}
          >
            <option value="best-seller">Best Seller</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {paginated.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-blue-200 text-[#0369a1] hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-lg transition-colors ${
                page === currentPage
                  ? "bg-[#0369a1] text-white"
                  : "border border-blue-200 text-gray-600 hover:bg-blue-50"
              }`}
              style={{ fontSize: "0.85rem" }}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-blue-200 text-[#0369a1] hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* View All button – only on homepage */}
      {!fullPage && (
        <div className="flex justify-center mt-10">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/all-seafood")}
            className="px-8 py-3 rounded-full bg-[#0369a1] text-white hover:bg-[#0c4a6e] transition-colors cursor-pointer"
            style={{ fontSize: "0.95rem" }}
          >
            View All Seafood
          </motion.button>
        </div>
      )}
    </section>
  );
}