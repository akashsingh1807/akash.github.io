
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    description: 'Cozy hoodie with "git commit -m 'dressed for success'"',
    price: 49.99,
    discountPrice: 39.99,
    image: '/placeholder.svg',
    category: 'Hoodies',
    badge: 'Sale'
  },
  {
    id: 'p3',
    name: 'Debug Mode Socks',
    description: 'Comfortable socks with "Currently in Debug Mode" text',
    price: 12.99,
    image: '/placeholder.svg',
    category: 'Accessories'
  },
  {
    id: 'p4',
    name: 'Syntax Error Cap',
    description: 'Stylish cap with "Syntax Error" embroidered on front',
    price: 24.99,
    image: '/placeholder.svg',
    category: 'Accessories'
  }
];

const MerchandiseStore = () => {
  return (
    <section id="merchandise" className="py-20 px-6 md:px-8 lg:px-12 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--accent),0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(var(--accent),0.05),transparent_70%)]" />
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* Store header with advertisement */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="px-3 py-1 text-sm bg-primary/10">
                Just Launched
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                <span className="gradient-text">Code Couture</span> Collection
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl">
                Express your love for coding with our exclusive collection of programmer-inspired 
                apparel. Designed by developers, for developers.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="group hover-highlight">
                  Shop Collection <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" className="hover-highlight">
                  Gift Cards
                </Button>
              </div>
              
              {/* Special offer banner */}
              <div className="flex items-center space-x-2 p-3 bg-primary/10 rounded-lg border border-primary/20 text-sm">
                <Code className="h-4 w-4 text-primary" />
                <p className="font-medium">Use code <span className="font-bold">CODELIFE10</span> for 10% off your first order</p>
              </div>
            </div>
            
            {/* Featured product advertisement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-accent/10 to-accent/5 p-6 rounded-2xl border border-accent/10 relative overflow-hidden"
            >
              <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">Limited Edition</Badge>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-1/2 aspect-square bg-muted rounded-xl flex items-center justify-center">
                  <div className="text-4xl font-bold text-accent/50">&lt;/&gt;</div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">"Hello World" Developer Sweatshirt</h3>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">(42 reviews)</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Our flagship product featuring the iconic first line of code 
                    every developer learns. Made from premium organic cotton.
                  </p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold">$59.99</span>
                    <span className="text-muted-foreground line-through">$69.99</span>
                  </div>
                  <Button className="w-full">
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Product grid */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-semibold">Popular Items</h3>
            <Button variant="ghost" className="group hover-highlight">
              View All <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
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
                    <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Newsletter and promotion */}
        <div className="rounded-2xl p-8 bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Join the Coder Community</h3>
              <p className="text-muted-foreground">
                Subscribe to get 15% off your first order, early access to new products, 
                and exclusive developer-themed merch drops.
              </p>
              <div className="flex gap-2 flex-wrap">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-md border bg-background min-w-[200px] flex-1"
                />
                <Button>Subscribe</Button>
              </div>
            </div>
            
            <div className="flex justify-center md:justify-end">
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">500+</div>
                  <div className="text-sm text-muted-foreground">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">10k+</div>
                  <div className="text-sm text-muted-foreground">Happy Coders</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">24/7</div>
                  <div className="text-sm text-muted-foreground">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MerchandiseStore;
