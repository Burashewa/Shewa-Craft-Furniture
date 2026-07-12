export const products = [
  {
    id: 1,
    name: "Luxury Velvet Armchair",
    price: 899,
    description:
      "Experience ultimate comfort with our handcrafted luxury velvet armchair. Featuring premium upholstery, solid wood frame, and ergonomic design perfect for any modern living space.",
    category: "Living Room",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1765663241884-ebd171bdda1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1759196450910-c44faf7abcdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    inStock: true,
    rating: 4.8,
    reviews: 124,
    owner: {
      name: "Sarah Johnson",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      responseTime: "Within 2 hours",
    },
    specifications: [
      { label: "Dimensions", value: '32" W x 34" D x 36" H' },
      { label: "Material", value: "Velvet Upholstery, Oak Frame" },
      { label: "Assembly", value: "Minimal assembly required" },
      { label: "Warrenty", value: "2 years" },
    ],
    colors: ["Navy", "Emerald", "Burgundy"],
  },
  {
    id: 2,
    name: "Modern Coffee Table",
    price: 549,
    description:
      "Sleek and contemporary coffee table crafted from solid wood with a minimalist design. Features a spacious tabletop and lower shelf for storage.",
    category: "Living Room",
    images: [
      "https://images.unsplash.com/photo-1642657547271-722df15ce6d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1611633332753-d1e2f695aa3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    inStock: true,
    rating: 4.6,
    reviews: 89,
    owner: {
      name: "Michael Chen",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      responseTime: "Within 1 hour",
    },
    specifications: [
      { label: "Dimensions", value: '48" W x 24" D x 18" H' },
      { label: "Material", value: "Walnut Wood, Steel Legs" },
      { label: "Assembly", value: "Minimal assembly required" },
      { label: "Warrenty", value: "2 years" },
    ],
    colors: ["Walnut", "Oak", "Black"],
  },
  {
    id: 3,
    name: "Premium Velvet Sofa",
    price: 2299,
    description:
      "Transform your living room with this stunning premium velvet sofa. Deep seating, plush cushions, and timeless design make it the perfect centerpiece.",
    category: "Living Room",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1638191376884-f371a22c719f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1668365011614-9c4a49a0e89d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    inStock: true,
    rating: 4.9,
    reviews: 203,
    owner: {
      name: "Emma Williams",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      responseTime: "Within 3 hours",
    },
    specifications: [
      { label: "Dimensions", value: '84" W x 38" D x 32" H' },
      { label: "Material", value: "Premium Velvet, Hardwood Frame" },
      { label: "Assembly", value: "Minimal assembly required" },
      { label: "Warrenty", value: "1 years" },
     
    ],
    colors: ["Charcoal", "Navy", "Blush"],
  },
  {
    id: 4,
    name: "Modern Bookshelf Unit",
    price: 699,
    description:
      "Elegant and functional bookshelf unit with a contemporary design. Features multiple shelves perfect for books, decor, and storage.",
    category: "Living Room",
    images: [
      "https://images.unsplash.com/photo-1765371512707-9e0e96fd9e5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1769092992803-ee97d235ba87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    inStock: false,
    rating: 4.5,
    reviews: 67,
    owner: {
      name: "David Park",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      responseTime: "Within 4 hours",
    },
    specifications: [
      { label: "Dimensions", value: '72" H x 36" W x 12" D' },
      { label: "Material", value: "Solid Oak Wood" },
      { label: "Assembly", value: "Minimal assembly required" },
      { label: "Warrenty", value: "3 years" },
    ],
    colors: ["Natural Oak", "Walnut", "White"],
  },
  {
    id: 5,
    name: "Minimalist Nightstand",
    price: 329,
    description:
      "Clean-lined nightstand with a drawer and open shelf. Perfect for modern bedrooms, combining functionality with elegant simplicity.",
    category: "Bedroom",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1762856490803-8e200418973a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1680503146454-04ac81a63550?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    inStock: true,
    rating: 4.7,
    reviews: 145,
    owner: {
      name: "Lisa Anderson",
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
      responseTime: "Within 2 hours",
    },
    specifications: [
      { label: "Dimensions", value: '20" W x 16" D x 24" H' },
      { label: "Material", value: "Ash Wood, Metal Handles" },
      { label: "Assembly", value: "Minimal assembly required" },
      { label: "Warrenty", value: "2 years" },
    ],
    colors: ["White", "Gray", "Natural"],
  },
  {
    id: 6,
    name: "Outdoor Patio Set",
    price: 1599,
    description:
      "Complete outdoor patio furniture set including loveseat, chairs, and coffee table. Weather-resistant and built to last.",
    category: "Outdoor",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1560990883-9b76fec399a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1637762646936-29b68cd6670d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    inStock: true,
    rating: 4.4,
    reviews: 92,
    owner: {
      name: "James Miller",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      responseTime: "Within 5 hours",
    },
    specifications: [
      { label: "Dimensions", value: 'Loveseat: 60" W x 30" D x 32" H' },
      { label: "Material", value: "Wicker, Aluminum Frame" },
      { label: "Assembly", value: "No assembly required" },
      { label: "Warranty", value: "2 years" },
    ],
    colors: ["Gray", "Brown"],
  },
];
