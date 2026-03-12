import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  ShoppingCart,
  Star,
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw,
  Fish,
  Flame,
  Droplets,
  Wheat,
  Facebook,
  Twitter,
  Link2,
  Mail,
  Share2,
  X,
  MessageCircle,
  Send,
  Copy,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PRODUCTS } from "../mock/data";
import { useCart } from "./Layout";
import { ProductCard } from "./product/ProductCard";
import { ProductImageGallery } from "./product/ProductImageGallery";
import { BestSellerItemsSection } from "./BestSellerItemsSection";
import { AllFreshSeafoodSection } from "./AllFreshSeafoodSection";
import { toast } from "sonner";

export function ItemDetailPage() {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === id);
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [infoTab, setInfoTab] = useState<
    "description" | "nutrition"
  >("description");
  const [activeFeature, setActiveFeature] = useState<
    string | null
  >("shipping");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-[#0c4a6e] mb-4">
          Product not found
        </h2>
        <Link to="/" className="text-[#0369a1] hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  const relatedProducts = PRODUCTS.filter(
    (p) =>
      p.category === product.category && p.id !== product.id,
  ).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div
        className="flex items-center gap-2 mb-6"
        style={{ fontSize: "0.85rem" }}
      >
        <Link
          to="/"
          className="text-[#0369a1] hover:underline flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Home
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-500">
          {product.category}
        </span>
        <span className="text-gray-400">/</span>
        <span className="text-gray-700">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ProductImageGallery
            mainImage={product.image}
            title={product.title}
          />

          {/* Social Share */}

          <div className="relative z-10 flex items-center gap-3 py-4">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-blue-100 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all hover:scale-110 hover:shadow-md"
              title="Share on Facebook"
            >
              <Facebook size={16} />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out ${product.title} on Glory One Seafood!`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-blue-100 flex items-center justify-center text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-all hover:scale-110 hover:shadow-md"
              title="Share on Twitter"
            >
              <Twitter size={16} />
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent(`Check out ${product.title}`)}&body=${encodeURIComponent(`I found this amazing seafood on Glory One: ${window.location.href}`)}`}
              className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-blue-100 flex items-center justify-center text-gray-500 hover:bg-[#0369a1] hover:text-white hover:border-[#0369a1] transition-all hover:scale-110 hover:shadow-md"
              title="Share via Email"
            >
              <Mail size={16} />
            </a>
            <button
              onClick={() => setShowShareDialog(true)}
              className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-blue-100 flex items-center justify-center text-gray-500 hover:bg-[#0369a1] hover:text-white hover:border-[#0369a1] transition-all hover:scale-110 hover:shadow-md cursor-pointer"
              title="More Sharing Options"
            >
              <Share2 size={16} />
            </button>
          </div>

          {/* Share Dialog Modal */}
          {showShareDialog && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setShowShareDialog(false)}
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                }}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Dialog Header */}
                <div className="relative bg-gradient-to-r from-[#0369a1] to-[#0ea5e9] px-6 py-4">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <svg
                      className="absolute bottom-0 left-0 w-full h-6 opacity-20"
                      viewBox="0 0 600 20"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 12 Q75 2 150 12 T300 12 T450 12 T600 12 L600 20 L0 20Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <h3
                        className="text-white"
                        style={{ fontSize: "1.1rem" }}
                      >
                        Share This Product
                      </h3>
                      <p
                        className="text-white/70"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {product.title}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowShareDialog(false)}
                      className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Messaging Apps */}
                <div className="px-6 pt-5 pb-2">
                  <p
                    className="text-gray-400 mb-3"
                    style={{
                      fontSize: "0.7rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Messaging Apps
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      {
                        name: "WhatsApp",
                        color: "#25D366",
                        hoverBg: "#25D366",
                        icon: <MessageCircle size={20} />,
                        url: `https://wa.me/?text=${encodeURIComponent(`Check out ${product.title} on Glory One Seafood! ${window.location.href}`)}`,
                      },
                      {
                        name: "Telegram",
                        color: "#0088cc",
                        hoverBg: "#0088cc",
                        icon: <Send size={20} />,
                        url: `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out ${product.title} on Glory One Seafood!`)}`,
                      },
                      {
                        name: "Viber",
                        color: "#7360F2",
                        hoverBg: "#7360F2",
                        icon: (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12.2 1C6.7 1 2.2 5.2 2.2 10.4c0 2.7 1.2 5.2 3.2 6.9v3.7l3.4-1.9c1.1.3 2.3.5 3.5.5 5.5 0 10-4.2 10-9.3S17.7 1 12.2 1zm.8 12.5c-.4.4-1.5 1.3-1.5 1.3s-.1.1-.3.1c-.1 0-.3-.1-.4-.2l-1.7-1.7c-.2-.2-.2-.5 0-.7l.4-.4c.2-.2.5-.2.7 0l.9.9 2.5-2.5c.2-.2.5-.2.7 0l.4.4c.2.2.2.5 0 .7l-1.7 2.1z" />
                          </svg>
                        ),
                        url: `viber://forward?text=${encodeURIComponent(`Check out ${product.title} on Glory One Seafood! ${window.location.href}`)}`,
                      },
                      {
                        name: "LINE",
                        color: "#00B900",
                        hoverBg: "#00B900",
                        icon: (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 2C6.48 2 2 5.81 2 10.5c0 3.49 2.62 6.5 6.35 7.64.24.06.58.17.66.39.08.2.05.51.02.71l-.11.64c-.03.18-.15.7.61.38s4.07-2.39 5.55-4.1C17.56 13.47 22 12.13 22 10.5 22 5.81 17.52 2 12 2z" />
                          </svg>
                        ),
                        url: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.href)}`,
                      },
                    ].map((app) => (
                      <a
                        key={app.name}
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1.5 py-3 rounded-xl hover:shadow-md transition-all group"
                        style={{
                          backgroundColor: `${app.color}10`,
                        }}
                      >
                        <span
                          className="w-11 h-11 rounded-full flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-lg text-white"
                          style={{ backgroundColor: app.color }}
                        >
                          {app.icon}
                        </span>
                        <span
                          className="text-gray-600 group-hover:text-gray-900"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {app.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Social Media */}
                <div className="px-6 pt-3 pb-2">
                  <p
                    className="text-gray-400 mb-3"
                    style={{
                      fontSize: "0.7rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Social Media
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      {
                        name: "Facebook",
                        color: "#1877F2",
                        icon: <Facebook size={20} />,
                        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                      },
                      {
                        name: "Twitter",
                        color: "#1DA1F2",
                        icon: <Twitter size={20} />,
                        url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out ${product.title} on Glory One Seafood!`)}`,
                      },
                      {
                        name: "WeChat",
                        color: "#07C160",
                        icon: (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M8.5 13.5a1 1 0 110-2 1 1 0 010 2zm5 0a1 1 0 110-2 1 1 0 010 2zM9 3C4.58 3 1 6.13 1 10c0 2.17 1.16 4.1 3 5.4V19l3.14-1.73C8.04 17.75 9 18 10 18h.5c-.32-.63-.5-1.3-.5-2 0-3.31 3.13-6 7-6h.5C16.93 6.46 13.33 3 9 3z" />
                            <path d="M22 14c0-2.76-2.69-5-6-5s-6 2.24-6 5 2.69 5 6 5c.72 0 1.41-.1 2.06-.3L20 20v-2.57c1.22-.98 2-2.35 2-3.43zm-8.5.5a.75.75 0 110-1.5.75.75 0 010 1.5zm5 0a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                          </svg>
                        ),
                        url: "#",
                      },
                      {
                        name: "Email",
                        color: "#6B7280",
                        icon: <Mail size={20} />,
                        url: `mailto:?subject=${encodeURIComponent(`Check out ${product.title}`)}&body=${encodeURIComponent(`I found this amazing seafood on Glory One: ${window.location.href}`)}`,
                      },
                    ].map((app) => (
                      <a
                        key={app.name}
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1.5 py-3 rounded-xl hover:shadow-md transition-all group"
                        style={{
                          backgroundColor: `${app.color}10`,
                        }}
                      >
                        <span
                          className="w-11 h-11 rounded-full flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-lg text-white"
                          style={{ backgroundColor: app.color }}
                        >
                          {app.icon}
                        </span>
                        <span
                          className="text-gray-600 group-hover:text-gray-900"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {app.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Copy Link */}
                <div className="px-6 pt-3 pb-6">
                  <p
                    className="text-gray-400 mb-3"
                    style={{
                      fontSize: "0.7rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Or Copy Link
                  </p>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                    <Link2
                      size={16}
                      className="text-gray-400 shrink-0"
                    />
                    <input
                      type="text"
                      readOnly
                      value={window.location.href}
                      className="flex-1 bg-transparent text-gray-600 outline-none truncate"
                      style={{ fontSize: "0.8rem" }}
                    />
                    <button
                      onClick={() => {
                        const textarea =
                          document.createElement("textarea");
                        textarea.value = window.location.href;
                        textarea.style.position = "fixed";
                        textarea.style.opacity = "0";
                        document.body.appendChild(textarea);
                        textarea.select();
                        document.execCommand("copy");
                        document.body.removeChild(textarea);
                        setCopied(true);
                        setTimeout(
                          () => setCopied(false),
                          2000,
                        );
                      }}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        copied
                          ? "bg-green-500 text-white"
                          : "bg-[#0369a1] text-white hover:bg-[#0c4a6e]"
                      }`}
                      style={{ fontSize: "0.78rem" }}
                    >
                      {copied ? (
                        <>
                          <Check size={14} /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className="bg-blue-100 text-[#0369a1] px-2 py-0.5 rounded-full"
              style={{ fontSize: "0.75rem" }}
            >
              {product.category}
            </span>
            {product.isBestSeller && (
              <span
                className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full"
                style={{ fontSize: "0.75rem" }}
              >
                Best Seller
              </span>
            )}
          </div>

          <h1
            className="text-[#0c4a6e] mb-3"
            style={{ fontSize: "1.75rem" }}
          >
            {product.title}
          </h1>

          {/* Description & Nutritional Info Tabs */}
          <div className="mb-4">
            <div className="flex border-b border-gray-200 mb-3">
              <button
                onClick={() => setInfoTab("description")}
                className={`px-4 py-2 transition-colors relative ${
                  infoTab === "description"
                    ? "text-[#0369a1]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                style={{ fontSize: "0.85rem" }}
              >
                Product Description
                {infoTab === "description" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0369a1] rounded-full" />
                )}
              </button>
              <button
                onClick={() => setInfoTab("nutrition")}
                className={`px-4 py-2 transition-colors relative ${
                  infoTab === "nutrition"
                    ? "text-[#0369a1]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                style={{ fontSize: "0.85rem" }}
              >
                Nutritional Info
                {infoTab === "nutrition" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0369a1] rounded-full" />
                )}
              </button>
            </div>

            {infoTab === "description" ? (
              <p
                className="text-gray-600 leading-relaxed"
                style={{ fontSize: "0.9rem" }}
              >
                {product.description}
              </p>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      icon: (
                        <Flame
                          size={14}
                          className="text-orange-500"
                        />
                      ),
                      label: "Calories",
                      value:
                        product.category === "Shellfish"
                          ? "70–90 kcal"
                          : product.category === "Lobster" ||
                              product.category === "Crab"
                            ? "80–100 kcal"
                            : "120–180 kcal",
                    },
                    {
                      icon: (
                        <Fish
                          size={14}
                          className="text-[#0369a1]"
                        />
                      ),
                      label: "Protein",
                      value:
                        product.category === "Shellfish"
                          ? "12–16g"
                          : product.category ===
                              "Shrimp & Prawns"
                            ? "20–24g"
                            : "18–25g",
                    },
                    {
                      icon: (
                        <Droplets
                          size={14}
                          className="text-yellow-500"
                        />
                      ),
                      label: "Total Fat",
                      value:
                        product.category === "Fish"
                          ? "5–12g"
                          : "1–3g",
                    },
                    {
                      icon: (
                        <Wheat
                          size={14}
                          className="text-amber-700"
                        />
                      ),
                      label: "Carbs",
                      value: "0g",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2"
                    >
                      {item.icon}
                      <div>
                        <div
                          className="text-gray-500"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {item.label}
                        </div>
                        <div
                          className="text-gray-800"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {item.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 rounded-lg px-3 py-2 mt-2">
                  <div
                    className="text-gray-500 mb-1"
                    style={{ fontSize: "0.7rem" }}
                  >
                    Key Nutrients
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(product.category === "Fish"
                      ? [
                          "Omega-3",
                          "Vitamin D",
                          "B12",
                          "Selenium",
                          "Phosphorus",
                        ]
                      : product.category === "Shrimp & Prawns"
                        ? [
                            "Selenium",
                            "B12",
                            "Iron",
                            "Zinc",
                            "Omega-3",
                          ]
                        : product.category === "Lobster" ||
                            product.category === "Crab"
                          ? [
                              "Zinc",
                              "Copper",
                              "B12",
                              "Selenium",
                              "Phosphorus",
                            ]
                          : product.category === "Shellfish"
                            ? [
                                "Iron",
                                "Zinc",
                                "B12",
                                "Selenium",
                                "Manganese",
                              ]
                            : [
                                "Protein",
                                "Selenium",
                                "B12",
                                "Copper",
                                "Zinc",
                              ]
                    ).map((nutrient) => (
                      <span
                        key={nutrient}
                        className="bg-white text-[#0369a1] px-2 py-0.5 rounded-full border border-blue-100"
                        style={{ fontSize: "0.7rem" }}
                      >
                        {nutrient}
                      </span>
                    ))}
                  </div>
                </div>
                <p
                  className="text-gray-400 italic"
                  style={{ fontSize: "0.7rem" }}
                >
                  *Per 100g serving. Values are approximate and
                  may vary.
                </p>
              </div>
            )}
          </div>

          <div
            className="text-[#0369a1] mb-6"
            style={{ fontSize: "2rem" }}
          >
            ${product.sizes[selectedSize].price}
          </div>

          {/* Stock status */}
          <div className="mb-4">
            {product.inStock ? (
              <span
                className="text-green-600 flex items-center gap-1"
                style={{ fontSize: "0.85rem" }}
              >
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />{" "}
                In Stock
              </span>
            ) : (
              <span
                className="text-red-500 flex items-center gap-1"
                style={{ fontSize: "0.85rem" }}
              >
                <span className="w-2 h-2 bg-red-500 rounded-full inline-block" />{" "}
                Sold Out
              </span>
            )}
          </div>

          {/* Size selection */}
          <div className="mb-6">
            <label
              className="text-gray-700 block mb-2"
              style={{ fontSize: "0.9rem" }}
            >
              Select Size & Weight:
            </label>
            <div className="flex gap-3">
              {product.sizes.map((size, i) => (
                <button
                  key={size.label}
                  onClick={() => setSelectedSize(i)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    i === selectedSize
                      ? "border-[#0369a1] bg-blue-50 text-[#0369a1]"
                      : "border-gray-200 hover:border-blue-200"
                  }`}
                >
                  <div style={{ fontSize: "0.85rem" }}>
                    {size.label}
                  </div>
                  <div
                    className="text-gray-500"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {size.weight}
                  </div>
                  <div
                    className="text-[#0369a1] mt-1"
                    style={{ fontSize: "0.9rem" }}
                  >
                    ${size.price}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() =>
                  setQuantity((q) => Math.max(1, q - 1))
                }
                className="px-3 py-2 hover:bg-gray-50 transition-colors"
              >
                -
              </button>
              <span
                className="px-4 py-2 border-x border-gray-200"
                style={{ fontSize: "0.9rem" }}
              >
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-2 hover:bg-gray-50 transition-colors"
              >
                +
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!product.inStock || addedToCart}
              onClick={() => {
                const size = product.sizes[selectedSize];
                addToCart({
                  productId: product.id,
                  title: product.title,
                  image: product.image,
                  category: product.category,
                  size,
                  quantity,
                });
                setAddedToCart(true);
                toast.success(
                  `${product.title} added to cart!`,
                  {
                    description: `${size.label} · ${size.weight} × ${quantity} — $${(size.price * quantity).toFixed(2)}`,
                    duration: 2500,
                  },
                );
                setTimeout(() => {
                  navigate("/cart");
                  setAddedToCart(false);
                }, 800);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-colors ${
                addedToCart
                  ? "bg-green-500 text-white"
                  : product.inStock
                    ? "bg-[#0369a1] text-white hover:bg-[#0c4a6e]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <AnimatePresence mode="wait">
                {addedToCart ? (
                  <motion.span
                    key="added"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Check size={18} />
                    Added to Cart!
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart size={18} />
                    {product.inStock ? "Add to Cart" : "Sold Out"}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Features */}
          <div className="rounded-xl overflow-hidden">
            <div className="grid grid-cols-3 gap-0 bg-blue-50">
              {[
                {
                  key: "shipping",
                  icon: <Truck size={20} />,
                  label: "Free Shipping $200+",
                },
                {
                  key: "guarantee",
                  icon: <Shield size={20} />,
                  label: "Quality Guaranteed",
                },
                {
                  key: "returns",
                  icon: <RotateCcw size={20} />,
                  label: "Easy Returns",
                },
              ].map((feature) => (
                <button
                  key={feature.key}
                  onClick={() =>
                    setActiveFeature(
                      activeFeature === feature.key
                        ? null
                        : feature.key,
                    )
                  }
                  className={`text-center py-3 px-2 cursor-pointer transition-all duration-200 ${
                    activeFeature === feature.key
                      ? "bg-[#0369a1] text-white scale-[1.02] shadow-md"
                      : "hover:bg-blue-100 text-[#0369a1]"
                  }`}
                >
                  <span
                    className={`mx-auto mb-1 block w-fit transition-colors ${
                      activeFeature === feature.key
                        ? "text-white"
                        : "text-[#0369a1]"
                    }`}
                  >
                    {feature.icon}
                  </span>
                  <span
                    className={`transition-colors ${activeFeature === feature.key ? "text-white" : "text-gray-600"}`}
                    style={{ fontSize: "0.7rem" }}
                  >
                    {feature.label}
                  </span>
                </button>
              ))}
            </div>

            {activeFeature && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-white border border-blue-100 border-t-0 rounded-b-xl px-4 py-3"
              >
                {activeFeature === "shipping" && (
                  <div className="flex gap-3 items-start">
                    <Truck
                      size={16}
                      className="text-[#0369a1] mt-0.5 shrink-0"
                    />
                    <div>
                      <div
                        className="text-[#0c4a6e] mb-1"
                        style={{ fontSize: "0.85rem" }}
                      >
                        Free Shipping on Orders $200+
                      </div>
                      <p
                        className="text-gray-500 leading-relaxed"
                        style={{ fontSize: "0.78rem" }}
                      >
                        Enjoy complimentary standard shipping on
                        all orders over $200. Our
                        temperature-controlled packaging ensures
                        your seafood arrives fresh within 1–3
                        business days. Express overnight
                        delivery is also available at checkout
                        for an additional fee.
                      </p>
                    </div>
                  </div>
                )}
                {activeFeature === "guarantee" && (
                  <div className="flex gap-3 items-start">
                    <Shield
                      size={16}
                      className="text-[#0369a1] mt-0.5 shrink-0"
                    />
                    <div>
                      <div
                        className="text-[#0c4a6e] mb-1"
                        style={{ fontSize: "0.85rem" }}
                      >
                        100% Quality Guaranteed
                      </div>
                      <p
                        className="text-gray-500 leading-relaxed"
                        style={{ fontSize: "0.78rem" }}
                      >
                        Every product is inspected for
                        freshness, texture, and taste before
                        leaving our facility. We source
                        exclusively from certified sustainable
                        fisheries and trusted suppliers. If
                        you're not completely satisfied, we'll
                        replace your order or issue a full
                        refund — no questions asked.
                      </p>
                    </div>
                  </div>
                )}
                {activeFeature === "returns" && (
                  <div className="flex gap-3 items-start">
                    <RotateCcw
                      size={16}
                      className="text-[#0369a1] mt-0.5 shrink-0"
                    />
                    <div>
                      <div
                        className="text-[#0c4a6e] mb-1"
                        style={{ fontSize: "0.85rem" }}
                      >
                        Hassle-Free Returns
                      </div>
                      <p
                        className="text-gray-500 leading-relaxed"
                        style={{ fontSize: "0.78rem" }}
                      >
                        Not happy with your order? Contact our
                        support team within 24 hours of
                        delivery. We offer full refunds or
                        replacements for any product that
                        doesn't meet our freshness standards.
                        Our dedicated customer care team is
                        available 7 days a week to assist you.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && null}

      {/* Best Seller Items Section - only shown when current product is a best seller */}
      {product.isBestSeller && (
        <BestSellerItemsSection currentProductId={product.id} />
      )}

      {/* All Fresh Seafood Section */}
      <AllFreshSeafoodSection currentProductId={product.id} />
    </div>
  );
}