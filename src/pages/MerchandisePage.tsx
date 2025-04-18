
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  category: string;
  badge?: string;
}

const products: Product[] = [
  {
    id: 'p1',
    name: 'Binary Brain Tee',
    description: 'Sleek black tee with binary code pattern that spells "programmer"',
    price: 29.99,
    image: '/placeholder.svg',
    category: 'T-Shirts',
    badge: 'Best Seller'
  },
  {
    id: 'p2',
    name: 'Git Commit Hoodie',
    description: 'Cozy hoodie with Git commit message design',
    price: 49.99,
    discountPrice: 39.99,
    image: '/placeholder.svg',
    category: 'Hoodies',
    badge: 'Sale'
  },
  {
    id: 'p3',
    name: 'Debug Mode Socks',
    description: 'Comfortable socks with debugging pattern',
    price: 12.99,
    image: '/placeholder.svg',
    category: 'Accessories'
  },
  {
    id: 'p4',
    name: 'Syntax Error Cap',
    description: 'Stylish cap with syntax error design',
    price: 24.99,
    image: '/placeholder.svg',
    category: 'Accessories'
  }
];

const MerchandisePage = () => {
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
                <span className="gradient-text">Developer</span> Merch Store
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Express your love for coding with our exclusive collection of programmer-inspired apparel.
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 px-6 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-square bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-muted-foreground/30">&lt;/&gt;</div>
                    {product.badge && (
                      <Badge className={`absolute top-3 right-3 ${product.badge === 'Sale' ? 'bg-destructive' : 'bg-primary'}`}>
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">{product.category}</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-current text-yellow-400" />
                        <span className="text-xs ml-1">4.9</span>
                      </div>
                    </div>
                    <h4 className="font-medium line-clamp-1">{product.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-baseline space-x-2">
                        {product.discountPrice ? (
                          <>
                            <span className="font-bold">${product.discountPrice.toFixed(2)}</span>
                            <span className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                          </>
                        ) : (
                          <span className="font-bold">${product.price.toFixed(2)}</span>
                        )}
                      </div>
                      <Button size="sm" variant="outline">
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MerchandisePage;
