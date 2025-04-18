
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Loader2, Code, Binary, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CheckoutDialog from "@/components/CheckoutDialog";
import { useQuery } from '@tanstack/react-query';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  badge?: string;
}

// Transform regular products into geeky themed products
const transformToGeekyProducts = (products: any[]): Product[] => {
  const geekyThemes = [
    { name: "Code Master Hoodie", description: "Perfect for late-night coding sessions. Features a minimalist code pattern and comes with hidden pockets for your USB drives." },
    { name: "Binary Beauty T-Shirt", description: "Show off your love for binary with this comfortable cotton blend shirt. The front displays an artistic arrangement of 1s and 0s." },
    { name: "Git Commit Jacket", description: "Never lose track of your style versions with this sleek developer jacket. Comes with 'commit early, commit often' embroidered on the back." },
    { name: "Debug Mode Pants", description: "Comfortable pants with multiple pockets for all your debugging tools. Features a unique circuit board pattern." },
    { name: "Stack Overflow Sweater", description: "A cozy sweater that's perfect for those long debugging sessions. Copy-paste your way to warmth." }
  ];

  return products
    .filter((item: any) => item.category.toLowerCase().includes('clothing'))
    .map((item: any, index: number) => ({
      id: item.id.toString(),
      name: geekyThemes[index % geekyThemes.length].name,
      description: geekyThemes[index % geekyThemes.length].description,
      price: item.price,
      image: item.image,
      category: 'Geek Wear',
      badge: item.rating.rate >= 4.5 ? 'Most Popular' : undefined
    }));
};

const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch('https://fakestoreapi.com/products');
  const data = await response.json();
  return transformToGeekyProducts(data);
};

const MerchandisePage = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['geeky-products'],
    queryFn: fetchProducts
  });

  const handleBuyNow = (product: Product) => {
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 px-6 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4">
              <Badge variant="outline" className="px-3 py-1 text-sm bg-primary/10">
                New Collection
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                <span className="gradient-text">Geek</span> Apparel Store
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Wear your code on your sleeve with our exclusive collection of developer-inspired clothing.
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 px-6 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500">
                Failed to load products. Please try again later.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative aspect-square bg-muted">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-contain p-4"
                      />
                      {product.badge && (
                        <Badge className="absolute top-3 right-3 bg-primary">
                          {product.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground capitalize">{product.category}</span>
                        <div className="flex items-center">
                          <Terminal className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <h4 className="font-medium line-clamp-1">{product.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-bold">${product.price.toFixed(2)}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleBuyNow(product)}
                          className="gap-2"
                        >
                          <Code className="h-4 w-4" />
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      {selectedProduct && (
        <CheckoutDialog
          open={isCheckoutOpen}
          onOpenChange={setIsCheckoutOpen}
          product={selectedProduct}
        />
      )}
      <Footer />
    </div>
  );
};

export default MerchandisePage;
