export interface ProductSize {
  label: string;
  weight: string;
  price: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  image: string;
  sizes: ProductSize[];
  inStock: boolean;
  isBestSeller: boolean;
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  productId: string;
  title: string;
  image: string;
  category: string;
  size: ProductSize;
  quantity: number;
}

export const CATEGORIES = [
  { name: "Fish", slug: "fish", image: "https://images.unsplash.com/photo-1772285253181-b1257afb3698?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbG1vbiUyMGZpbGxldCUyMHJhd3xlbnwxfHx8fDE3NzI2MjYzODF8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { name: "Shrimp & Prawns", slug: "shrimp-prawns", image: "https://images.unsplash.com/photo-1756364084889-9a8d9ece6112?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNocmltcCUyMHByYXducyUyMHNlYWZvb2R8ZW58MXx8fHwxNzcyNTcxMjAzfDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { name: "Lobster", slug: "lobster", image: "https://images.unsplash.com/photo-1769611446060-e97e80d23063?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGxvYnN0ZXIlMjBzZWFmb29kJTIwcGxhdHRlcnxlbnwxfHx8fDE3NzI2MjYzODJ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { name: "Crab", slug: "crab", image: "https://images.unsplash.com/photo-1609834272245-8ca8337f81f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGNyYWIlMjBzZWFmb29kfGVufDF8fHx8MTc3MjYyNjM4M3ww&ixlib=rb-4.1.0&q=80&w=1080" },
  { name: "Shellfish", slug: "shellfish", image: "https://images.unsplash.com/photo-1767415743109-bbd0eeac76bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG95c3RlciUyMHNoZWxsZmlzaHxlbnwxfHx8fDE3NzI2MjYzODN8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { name: "Squid & Calamari", slug: "squid-calamari", image: "https://images.unsplash.com/photo-1762305195844-94479ea6aca4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNxdWlkJTIwY2FsYW1hcmklMjBzZWFmb29kfGVufDF8fHx8MTc3MjYyNjM4NHww&ixlib=rb-4.1.0&q=80&w=1080" },
];

export const SEAFOOD_SUBCATEGORIES = {
  fish: ["Salmon", "Tuna", "Cod", "Mackerel", "Sea Bass", "Halibut"],
  "shrimp-prawns": ["Tiger Prawns", "King Prawns", "White Shrimp", "Jumbo Shrimp"],
  lobster: ["Maine Lobster", "Rock Lobster", "Lobster Tails"],
  crab: ["King Crab", "Snow Crab", "Blue Crab", "Dungeness Crab"],
  shellfish: ["Oysters", "Mussels", "Clams", "Scallops"],
  "squid-calamari": ["Baby Squid", "Calamari Rings", "Whole Squid"],
};

export const PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Atlantic Salmon Fillet",
    description: "Premium Atlantic salmon fillet, wild-caught from the cold, pristine waters of the North Atlantic. Rich in Omega-3 fatty acids and packed with flavor, our salmon is hand-selected for its vibrant color and buttery texture. Perfect for grilling, baking, or pan-searing. Flash-frozen at sea to lock in freshness and delivered straight to your door.",
    category: "Fish",
    subCategory: "Salmon",
    image: "https://images.unsplash.com/photo-1772285253181-b1257afb3698?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbG1vbiUyMGZpbGxldCUyMHJhd3xlbnwxfHx8fDE3NzI2MjYzODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: [
      { label: "Small", weight: "500g", price: 220 },
      { label: "Medium", weight: "1kg", price: 350 },
      { label: "Large", weight: "2kg", price: 400 },
    ],
    inStock: true,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: "2",
    title: "Tiger Prawns Premium",
    description: "Jumbo tiger prawns sourced from sustainable farms in Southeast Asia. These beautifully striped prawns are prized for their firm texture, sweet flavor, and impressive size. Ideal for stir-fries, curries, grilling on skewers, or a classic garlic butter shrimp dish. Cleaned, deveined, and ready to cook for your convenience.",
    category: "Shrimp & Prawns",
    subCategory: "Tiger Prawns",
    image: "https://images.unsplash.com/photo-1756364084889-9a8d9ece6112?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNocmltcCUyMHByYXducyUyMHNlYWZvb2R8ZW58MXx8fHwxNzcyNTcxMjAzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: [
      { label: "Small", weight: "500g", price: 200 },
      { label: "Medium", weight: "1kg", price: 320 },
      { label: "Large", weight: "2kg", price: 380 },
    ],
    inStock: true,
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 98,
  },
  {
    id: "3",
    title: "Maine Lobster Whole",
    description: "Whole Maine lobster, sustainably harvested from the cold Atlantic waters off the coast of Maine. Known for their tender, sweet meat and iconic flavor, these lobsters are perfect for a luxurious dinner. Steam, boil, or grill for an unforgettable seafood experience. Each lobster is carefully packed alive for maximum freshness.",
    category: "Lobster",
    subCategory: "Maine Lobster",
    image: "https://images.unsplash.com/photo-1769611446060-e97e80d23063?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGxvYnN0ZXIlMjBzZWFmb29kJTIwcGxhdHRlcnxlbnwxfHx8fDE3NzI2MjYzODJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: [
      { label: "Small", weight: "600g", price: 300 },
      { label: "Medium", weight: "1kg", price: 380 },
      { label: "Large", weight: "1.5kg", price: 400 },
    ],
    inStock: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 76,
  },
  {
    id: "4",
    title: "King Crab Legs",
    description: "Alaskan king crab legs, prized for their sweet, succulent meat and impressive size. Harvested from the icy waters of the Bering Sea, these crab legs are pre-cooked and flash-frozen to preserve their incredible flavor. Simply steam or bake and serve with melted butter for a restaurant-quality seafood feast at home.",
    category: "Crab",
    subCategory: "King Crab",
    image: "https://images.unsplash.com/photo-1609834272245-8ca8337f81f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGNyYWIlMjBzZWFmb29kfGVufDF8fHx8MTc3MjYyNjM4M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: [
      { label: "Small", weight: "500g", price: 280 },
      { label: "Medium", weight: "1kg", price: 360 },
      { label: "Large", weight: "2kg", price: 400 },
    ],
    inStock: true,
    isBestSeller: true,
    rating: 4.6,
    reviewCount: 89,
  },
  {
    id: "5",
    title: "Yellowfin Tuna Steak",
    description: "Sashimi-grade yellowfin tuna steaks, hand-cut from line-caught fish in the deep Pacific waters. With its firm texture, vibrant ruby-red color, and clean, meaty flavor, this tuna is perfect for searing, grilling, or enjoying raw in sushi and poke bowls. Rich in protein and Omega-3s for a healthy, delicious meal.",
    category: "Fish",
    subCategory: "Tuna",
    image: "https://images.unsplash.com/photo-1770839112008-f6a165687cca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHR1bmElMjBzdGVhayUyMHJhd3xlbnwxfHx8fDE3NzI2MjYzODN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: [
      { label: "Small", weight: "400g", price: 250 },
      { label: "Medium", weight: "800g", price: 350 },
      { label: "Large", weight: "1.5kg", price: 400 },
    ],
    inStock: true,
    isBestSeller: false,
    rating: 4.5,
    reviewCount: 62,
  },
  {
    id: "6",
    title: "Fresh Oysters Pack",
    description: "Hand-harvested fresh oysters from pristine coastal waters. These briny, delicate oysters are shucked-to-order quality, offering a clean ocean taste with a smooth, creamy finish. Perfect served raw on the half shell with a squeeze of lemon, or baked with your favorite toppings. Each pack is carefully inspected for quality.",
    category: "Shellfish",
    subCategory: "Oysters",
    image: "https://images.unsplash.com/photo-1767415743109-bbd0eeac76bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG95c3RlciUyMHNoZWxsZmlzaHxlbnwxfHx8fDE3NzI2MjYzODN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: [
      { label: "Half Dozen", weight: "6pcs", price: 200 },
      { label: "Dozen", weight: "12pcs", price: 320 },
      { label: "Two Dozen", weight: "24pcs", price: 400 },
    ],
    inStock: true,
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 55,
  },
  {
    id: "7",
    title: "Baby Squid Fresh",
    description: "Tender baby squid, freshly caught and cleaned for easy preparation. Their small size makes them perfect for quick stir-fries, deep-frying into crispy calamari, or tossing into pasta and salads. With a mild, slightly sweet flavor and delicate texture, baby squid cook in minutes and pair beautifully with garlic, chili, and lemon.",
    category: "Squid & Calamari",
    subCategory: "Baby Squid",
    image: "https://images.unsplash.com/photo-1762305195844-94479ea6aca4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNxdWlkJTIwY2FsYW1hcmklMjBzZWFmb29kfGVufDF8fHx8MTc3MjYyNjM4NHww&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: [
      { label: "Small", weight: "500g", price: 200 },
      { label: "Medium", weight: "1kg", price: 280 },
      { label: "Large", weight: "2kg", price: 350 },
    ],
    inStock: true,
    isBestSeller: false,
    rating: 4.4,
    reviewCount: 41,
  },
  {
    id: "8",
    title: "Sea Scallops Premium",
    description: "Dry-packed premium sea scallops, hand-harvested by divers from the cold North Atlantic. These large, sweet scallops have a buttery, melt-in-your-mouth texture that makes them a favorite of chefs worldwide. Perfect for pan-searing to a golden crust, grilling, or adding to pasta and risotto dishes.",
    category: "Shellfish",
    subCategory: "Scallops",
    image: "https://images.unsplash.com/photo-1758872044232-449046a48b26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNjYWxsb3BzJTIwc2VhZm9vZHxlbnwxfHx8fDE3NzI2MjYzODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: [
      { label: "Small", weight: "300g", price: 240 },
      { label: "Medium", weight: "600g", price: 340 },
      { label: "Large", weight: "1kg", price: 400 },
    ],
    inStock: false,
    isBestSeller: false,
    rating: 4.8,
    reviewCount: 73,
  },
  {
    id: "9",
    title: "Blue Mussels Fresh",
    description: "Fresh blue mussels harvested from clean, cold coastal waters. These plump, tender mussels have a sweet, briny flavor that pairs perfectly with white wine, garlic, and fresh herbs. Steam them in a pot for a classic moules mariniere, or add to soups, pastas, and paella for a rich seafood depth.",
    category: "Shellfish",
    subCategory: "Mussels",
    image: "https://images.unsplash.com/photo-1767324672563-3957845e2fae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG11c3NlbHMlMjBzZWFmb29kfGVufDF8fHx8MTc3MjYxMTMzMXww&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: [
      { label: "Small", weight: "500g", price: 200 },
      { label: "Medium", weight: "1kg", price: 260 },
      { label: "Large", weight: "2kg", price: 340 },
    ],
    inStock: true,
    isBestSeller: false,
    rating: 4.3,
    reviewCount: 38,
  },
  {
    id: "10",
    title: "Atlantic Cod Fillet",
    description: "Wild-caught Atlantic cod fillets with firm, flaky white flesh and a mild, clean flavor. Cod is one of the most versatile fish available -- perfect for baking, frying, grilling, or making traditional fish and chips. Low in fat and high in protein, it's a wholesome choice for the whole family.",
    category: "Fish",
    subCategory: "Cod",
    image: "https://images.unsplash.com/photo-1664288377740-1bec924cd622?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGNvZCUyMGZpc2glMjBmaWxsZXR8ZW58MXx8fHwxNzcyNjExMzMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: [
      { label: "Small", weight: "500g", price: 210 },
      { label: "Medium", weight: "1kg", price: 300 },
      { label: "Large", weight: "2kg", price: 380 },
    ],
    inStock: true,
    isBestSeller: true,
    rating: 4.6,
    reviewCount: 67,
  },
  {
    id: "11",
    title: "Whole Mackerel Fresh",
    description: "Fresh whole mackerel, known for its rich, bold flavor and high Omega-3 content. This oily fish is incredibly versatile -- grill it whole with herbs and lemon, smoke it for a classic preparation, or fillet and pan-fry for a quick weeknight dinner. Sourced from sustainable fisheries for responsible enjoyment.",
    category: "Fish",
    subCategory: "Mackerel",
    image: "https://images.unsplash.com/photo-1764345960391-9b66a2541deb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG1hY2tlcmVsJTIwZmlzaCUyMHdob2xlfGVufDF8fHx8MTc3MjYyNjM4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: [
      { label: "Small", weight: "400g", price: 200 },
      { label: "Medium", weight: "800g", price: 270 },
      { label: "Large", weight: "1.5kg", price: 350 },
    ],
    inStock: true,
    isBestSeller: false,
    rating: 4.2,
    reviewCount: 29,
  },
  {
    id: "12",
    title: "Fresh Clams Pack",
    description: "Fresh littleneck clams harvested from pristine sandy shorelines. These tender, sweet clams are perfect for steaming with white wine and garlic, adding to chowders and pasta dishes, or enjoying on the half shell. Each pack is purged of sand and carefully sorted to ensure only the finest quality reaches your kitchen.",
    category: "Shellfish",
    subCategory: "Clams",
    image: "https://images.unsplash.com/photo-1763575392558-7a83929678fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGNsYW0lMjBzaGVsbGZpc2glMjBzZWFmb29kfGVufDF8fHx8MTc3MjYyNjM4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: [
      { label: "Small", weight: "500g", price: 200 },
      { label: "Medium", weight: "1kg", price: 280 },
      { label: "Large", weight: "2kg", price: 360 },
    ],
    inStock: true,
    isBestSeller: false,
    rating: 4.5,
    reviewCount: 44,
  },
  {
    id: "13",
    title: "Snow Crab Cluster",
    description: "Premium snow crab clusters with sweet, delicate meat that's easy to extract from the shell. Harvested from the cold waters of the North Pacific, these clusters are pre-cooked and flash-frozen for convenience. Simply steam, boil, or bake and enjoy with melted butter and lemon for an elegant seafood dinner.",
    category: "Crab",
    subCategory: "Snow Crab",
    image: "https://images.unsplash.com/photo-1609834272245-8ca8337f81f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGNyYWIlMjBzZWFmb29kfGVufDF8fHx8MTc3MjYyNjM4M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: [
      { label: "Small", weight: "500g", price: 250 },
      { label: "Medium", weight: "1kg", price: 340 },
      { label: "Large", weight: "1.5kg", price: 400 },
    ],
    inStock: false,
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 51,
  },
  {
    id: "14",
    title: "Rock Lobster Tail",
    description: "Succulent rock lobster tails from the warm waters of the Caribbean and South Atlantic. Known for their firm, sweet meat and beautiful presentation, these tails are perfect for special occasions. Broil, grill, or butter-poach for a decadent dining experience. Each tail is flash-frozen immediately after harvest for peak freshness.",
    category: "Lobster",
    subCategory: "Rock Lobster",
    image: "https://images.unsplash.com/photo-1769611446060-e97e80d23063?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGxvYnN0ZXIlMjBzZWFmb29kJTIwcGxhdHRlcnxlbnwxfHx8fDE3NzI2MjYzODJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: [
      { label: "Small", weight: "400g", price: 280 },
      { label: "Medium", weight: "800g", price: 360 },
      { label: "Large", weight: "1.2kg", price: 400 },
    ],
    inStock: true,
    isBestSeller: false,
    rating: 4.8,
    reviewCount: 63,
  },
  {
    id: "15",
    title: "King Prawns Jumbo",
    description: "Extra-large jumbo king prawns, prized for their firm texture, sweet flavor, and dramatic size. These impressive prawns make a stunning centerpiece for any seafood dish. Perfect for grilling, barbecuing, or serving in a classic cocktail presentation. Sourced from sustainable farms and cleaned for your convenience.",
    category: "Shrimp & Prawns",
    subCategory: "King Prawns",
    image: "https://images.unsplash.com/photo-1756364084889-9a8d9ece6112?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNocmltcCUyMHByYXducyUyMHNlYWZvb2R8ZW58MXx8fHwxNzcyNTcxMjAzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: [
      { label: "Small", weight: "500g", price: 220 },
      { label: "Medium", weight: "1kg", price: 330 },
      { label: "Large", weight: "2kg", price: 400 },
    ],
    inStock: true,
    isBestSeller: true,
    rating: 4.6,
    reviewCount: 87,
  },
];

export const SLIDER_IMAGES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1761634731495-f8ff62712b97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNlYWZvb2QlMjBtYXJrZXQlMjBkaXNwbGF5JTIwZmlzaHxlbnwxfHx8fDE3NzI2MjYzODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Fresh From Ocean to Your Table",
    subtitle: "Premium quality seafood delivered fresh to your doorstep",
    cta: "Shop Now",
    link: "/all-seafood",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1720393515377-6eb4118c9856?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFmb29kJTIwZXhwbyUyMGV2ZW50JTIwZXhoaWJpdGlvbnxlbnwxfHx8fDE3NzI2MjYzODZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Seafood Expo 2026",
    subtitle: "Join us at the International Seafood & Processing Expo - March 15-17, 2026",
    cta: "Learn More",
    link: "/events/evt-1",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1657563495700-47841fae20cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHdhdmVzJTIwYmx1ZSUyMHdhdGVyfGVufDF8fHx8MTc3MjUxOTU4NXww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Sustainable Seafood Promise",
    subtitle: "Responsibly sourced from certified fisheries worldwide",
    cta: "Our Promise",
    link: "/events",
  },
];