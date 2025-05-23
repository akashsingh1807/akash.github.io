
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingCart, 
  Star, 
  Loader2, 
  Code, 
  Filter, 
  SlidersHorizontal,
  Search,
  ShoppingBag,
  Tag,
  Menu,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CheckoutDialog from "@/components/CheckoutDialog";
import { Input } from '@/components/ui/input';
import { useProducts } from '@/context/ProductContext';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const MerchandisePage = () => {
  const { products, isLoading, addToCart, cart, getCartItemCount } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under25' | 'under50' | 'over50'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { toast } = useToast();

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesPrice = true;
    if (priceFilter === 'under25') {
      matchesPrice = product.price < 25;
    } else if (priceFilter === 'under50') {
      matchesPrice = product.price < 50;
    } else if (priceFilter === 'over50') {
      matchesPrice = product.price >= 50;
    }
    
    return matchesSearch && matchesPrice;
  });

  const FilterContent = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Price Range</h3>
        <div className="space-y-2">
          {[
            { value: 'all', label: 'All Prices' },
            { value: 'under25', label: 'Under $25' },
            { value: 'under50', label: 'Under $50' },
            { value: 'over50', label: '$50 & Above' }
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="priceFilter"
                value={option.value}
                checked={priceFilter === option.value}
                onChange={(e) => setPriceFilter(e.target.value as any)}
                className="w-4 h-4"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section - Mobile Optimized */}
        <section className="py-8 md:py-12 px-4 md:px-8 lg:px-12 bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4">
              <Badge variant="outline" className="px-3 py-1 text-sm bg-primary/10">
                New Collection
              </Badge>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                  Geek Apparel Store
                </span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                Wear your code on your sleeve with our exclusive collection of developer-inspired clothing.
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-3 px-4">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  <Tag className="h-4 w-4" />
                  Shop Collection
                </Button>
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                  <ShoppingBag className="h-4 w-4" />
                  View Cart ({getCartItemCount()})
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Filter and Search - Mobile Optimized */}
        <section className="py-4 md:py-8 px-4 md:px-8 lg:px-12 border-b">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative w-full md:w-auto flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for geek apparel..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Desktop Filter */}
              <div className="hidden md:flex gap-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <select 
                    className="bg-transparent border-0 cursor-pointer focus:outline-none"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value as any)}
                  >
                    <option value="all">All Prices</option>
                    <option value="under25">Under $25</option>
                    <option value="under50">Under $50</option>
                    <option value="over50">$50 & Above</option>
                  </select>
                </div>
              </div>

              {/* Mobile Filter */}
              <div className="md:hidden">
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-fit">
                    <SheetHeader>
                      <SheetTitle>Filter Products</SheetTitle>
                    </SheetHeader>
                    <div className="py-4">
                      <FilterContent />
                    </div>
                    <Button 
                      onClick={() => setIsFilterOpen(false)} 
                      className="w-full mt-4"
                    >
                      Apply Filters
                    </Button>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid - Mobile Optimized */}
        <section className="py-6 md:py-12 px-4 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">No products found</h3>
                <p className="mt-1 text-muted-foreground px-4">Try adjusting your search or filter to find what you're looking for.</p>
                <Button onClick={() => {setSearchTerm(''); setPriceFilter('all');}} variant="outline" className="mt-6">
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
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
                        <Badge className="absolute top-2 right-2 bg-primary text-xs">
                          {product.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="p-3 md:p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground capitalize">{product.category}</span>
                        <Code className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                      </div>
                      <h4 className="font-medium text-sm md:text-base line-clamp-1">{product.name}</h4>
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-bold text-sm md:text-base">${product.price.toFixed(2)}</span>
                        <div className="flex gap-1 md:gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAddToCart(product)}
                            className="h-7 w-7 md:h-8 md:w-8 p-0"
                          >
                            <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleBuyNow(product)}
                            className="h-7 md:h-8 text-xs md:text-sm px-2 md:px-3"
                          >
                            Buy Now
                          </Button>
                        </div>
                      </div>
                      
                      {product.stockLevel <= 5 && product.stockLevel > 0 && (
                        <div className="text-xs text-amber-600 mt-2">
                          Only {product.stockLevel} left in stock
                        </div>
                      )}
                      {product.stockLevel === 0 && (
                        <div className="text-xs text-red-500 mt-2">
                          Out of stock
                        </div>
                      )}
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
