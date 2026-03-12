import { motion } from "motion/react";
import { CATEGORIES } from "../mock/data";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function PopularCategories() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2 className="text-[#0c4a6e] mb-2" style={{ fontSize: "1.75rem" }}>Popular Categories</h2>
        <p className="text-gray-500" style={{ fontSize: "0.9rem" }}>Explore our fresh selection</p>
        <div className="w-16 h-1 bg-[#0369a1] mx-auto mt-3 rounded-full" />
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {CATEGORIES.map((cat, idx) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group cursor-pointer"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-square shadow-lg">
              <ImageWithFallback
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c4a6e]/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                <h3 className="text-white drop-shadow" style={{ fontSize: "0.9rem" }}>{cat.name}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
