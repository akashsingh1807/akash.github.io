import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types/product';

interface ProductContextType {
  products: Product[];
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  saveProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  getProduct: (productId: string) => Product | undefined;
  getCartItemCount: () => number;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Mock database - In a real app, this would be replaced with API calls
const mockProducts: Product[] = [
  {
    id: '1',
    name: "Code Master Hoodie",
    description: "Perfect for late-night coding sessions. Features a minimalist code pattern and comes with hidden pockets for your USB drives.",
    price: 59.99,
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    category: 'Geek Wear',
    badge: 'Most Popular',
    stockLevel: 25,
    sku: "CM-HOOD-001",
    featured: true
  },
  {
    id: '2',
    name: "Binary Beauty T-Shirt",
    description: "Show off your love for binary with this comfortable cotton blend shirt. The front displays an artistic arrangement of 1s and 0s.",
    price: 29.99,
    image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
    category: 'Geek Wear',
    stockLevel: 50,
    sku: "BB-TSHIRT-002",
    featured: false
  },
  {
    id: '3',
    name: "Git Commit Jacket",
    description: "Never lose track of your style versions with this sleek developer jacket. Comes with 'commit early, commit often' embroidered on the back.",
    price: 79.99,
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    category: 'Geek Wear',
    badge: 'New',
    stockLevel: 15,
    sku: "GC-JACKET-003",
    featured: true
  },
  {
    id: '4',
    name: "Debug Mode Pants",
    description: "Comfortable pants with multiple pockets for all your debugging tools. Features a unique circuit board pattern.",
    price: 49.99,
    image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
    category: 'Geek Wear',
    stockLevel: 30,
    sku: "DM-PANTS-004",
    featured: false
  },
  {
    id: '5',
    name: "Stack Overflow Sweater",
    description: "A cozy sweater that's perfect for those long debugging sessions. Copy-paste your way to warmth.",
    price: 54.99,
    image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
    category: 'Geek Wear',
    stockLevel: 20,
    sku: "SO-SWEATER-005",
    featured: true
  }
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load products on component mount
  useEffect(() => {
    const loadProducts = () => {
      try {
        // Simulate loading from API
        setTimeout(() => {
          // Load from localStorage if available
          const storedProducts = localStorage.getItem('geekwear_products');
          if (storedProducts) {
            setProducts(JSON.parse(storedProducts));
          } else {
            // Otherwise use mock data
            setProducts(mockProducts);
            localStorage.setItem('geekwear_products', JSON.stringify(mockProducts));
          }
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load products');
        setIsLoading(false);
      }
    };

    // Load cart from localStorage
    const storedCart = localStorage.getItem('geekwear_cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    loadProducts();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('geekwear_cart', JSON.stringify(cart));
  }, [cart]);

  // Product management functions
  const saveProduct = (product: Product) => {
    setProducts(prevProducts => {
      const updatedProducts = product.id
        ? prevProducts.map(p => (p.id === product.id ? product : p))
        : [...prevProducts, { ...product, id: Date.now().toString() }];
      
      localStorage.setItem('geekwear_products', JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  };

  const deleteProduct = (productId: string) => {
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.filter(p => p.id !== productId);
      localStorage.setItem('geekwear_products', JSON.stringify(updatedProducts));
      return updatedProducts;
    });

    // Also remove from cart if present
    removeFromCart(productId);
  };

  const getProduct = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  // Cart management functions
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prevCart => {
      const itemIndex = prevCart.findIndex(item => item.id === product.id);
      if (itemIndex >= 0) {
        // If product already in cart, increase quantity
        const updatedCart = [...prevCart];
        updatedCart[itemIndex] = {
          ...updatedCart[itemIndex],
          quantity: updatedCart[itemIndex].quantity + quantity
        };
        return updatedCart;
      } else {
        // Add new item to cart
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    products,
    cart,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartTotal,
    saveProduct,
    deleteProduct,
    getProduct,
    getCartItemCount
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
