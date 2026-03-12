import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ZoomIn, ZoomOut } from "lucide-react";

const EXTRA_IMAGES = [
  "https://images.unsplash.com/photo-1770195745452-b49634efa8f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXclMjBzZWFmb29kJTIwY2xvc2UlMjB1cCUyMGRldGFpbHxlbnwxfHx8fDE3NzI2Mjc3MDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1772329354988-cf4ee5e0d99f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFmb29kJTIwcGxhdHRlciUyMHByZXBhcmF0aW9uJTIwa2l0Y2hlbnxlbnwxfHx8fDE3NzI2Mjc3MDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1625938402460-5f217066f472?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZpc2glMjBmaWxsZXQlMjBjb29raW5nfGVufDF8fHx8MTc3MjYyNzcwOHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1756364084889-9a8d9ece6112?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNocmltcCUyMHByYXducyUyMHNlYWZvb2R8ZW58MXx8fHwxNzcyNTcxMjAzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1739785938093-c2b6befeca2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXclMjBzYWxtb24lMjBmaWxsZXQlMjBjdXR0aW5nJTIwYm9hcmR8ZW58MXx8fHwxNzcyNjI5NDAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1523275033438-8c0a9239935b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2JzdGVyJTIwdGFpbCUyMHBsYXR0ZXJ8ZW58MXx8fHwxNzcyNjI5NDAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1700913281386-e2cfc713f117?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG95c3RlcnMlMjBpY2UlMjBwbGF0ZXxlbnwxfHx8fDE3NzI2Mjk0MDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1676300185165-3f543c1fcb72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwZmlzaCUyMHNlYWZvb2QlMjBkaXNofGVufDF8fHx8MTc3MjYyOTQwMnww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1770839112008-f6a165687cca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dW5hJTIwc3RlYWslMjBzYXNoaW1pJTIwZnJlc2h8ZW58MXx8fHwxNzcyNjI5NDAzfDA&ixlib=rb-4.1.0&q=80&w=1080",
];

interface ProductImageGalleryProps {
  mainImage: string;
  title: string;
}

export function ProductImageGallery({ mainImage, title }: ProductImageGalleryProps) {
  const allImages = [mainImage, ...EXTRA_IMAGES];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isZoomed || !imageContainerRef.current) return;
      const rect = imageContainerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    },
    [isZoomed]
  );

  const toggleZoom = () => setIsZoomed((z) => !z);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image with zoom */}
      <div
        ref={imageContainerRef}
        className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-100 cursor-crosshair group"
        onClick={toggleZoom}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isZoomed && setIsZoomed(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full h-[400px] lg:h-[500px] overflow-hidden"
          >
            <img
              src={allImages[activeIndex]}
              alt={`${title} - view ${activeIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-300"
              style={
                isZoomed
                  ? {
                      transform: "scale(2.5)",
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }
                  : {}
              }
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom indicator */}
        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {isZoomed ? (
            <ZoomOut size={18} className="text-[#0369a1]" />
          ) : (
            <ZoomIn size={18} className="text-[#0369a1]" />
          )}
        </div>

        {/* Zoom hint */}
        {!isZoomed && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ fontSize: "0.75rem" }}>
            Click to zoom
          </div>
        )}
      </div>

      {/* Thumbnail row */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin" style={{ scrollbarWidth: "thin", scrollbarColor: "#0369a1 transparent" }}>
        {allImages.map((img, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setActiveIndex(i);
              setIsZoomed(false);
            }}
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
              i === activeIndex
                ? "border-[#0369a1] shadow-md"
                : "border-gray-200 opacity-60 hover:opacity-100"
            }`}
          >
            <img
              src={img}
              alt={`${title} thumbnail ${i + 1}`}
              className="w-full h-full object-cover"
              draggable={false}
            />
            {i === activeIndex && (
              <motion.div
                layoutId="thumb-indicator"
                className="absolute inset-0 border-2 border-[#0369a1] rounded-lg"
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}