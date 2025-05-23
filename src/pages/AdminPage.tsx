
import React, { useState } from 'react';
import { useProducts } from '@/context/ProductContext';
import { Product } from '@/types/product';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Search, XCircle, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

const AdminPage = () => {
  const { products, saveProduct, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [currentProduct, setCurrentProduct] = useState<Product>({
    id: '',
    name: '',
    description: '',
    price: 0,
    image: '',
    category: 'Geek Wear',
    stockLevel: 0,
    sku: '',
    featured: false,
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenForm = (mode: 'add' | 'edit', product?: Product) => {
    setFormMode(mode);
    if (mode === 'edit' && product) {
      setCurrentProduct(product);
    } else {
      setCurrentProduct({
        id: '',
        name: '',
        description: '',
        price: 0,
        image: '',
        category: 'Geek Wear',
        stockLevel: 0,
        sku: '',
        featured: false,
      });
    }
    setIsFormOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setCurrentProduct(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else if (type === 'number') {
      setCurrentProduct(prev => ({
        ...prev,
        [name]: parseFloat(value)
      }));
    } else {
      setCurrentProduct(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProduct(currentProduct);
    setIsFormOpen(false);
    toast({
      title: formMode === 'add' ? "Product Added" : "Product Updated",
      description: `${currentProduct.name} has been ${formMode === 'add' ? 'added to' : 'updated in'} your inventory.`,
    });
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirmId(null);
    toast({
      title: "Product Deleted",
      description: "The product has been removed from your inventory.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">Product Management</h1>
              <p className="text-muted-foreground">Manage your GeekWear inventory</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={() => handleOpenForm('add')} className="gap-2">
                <Plus className="h-4 w-4" /> Add Product
              </Button>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="w-12 h-12 bg-muted rounded-md overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=No+Image';
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {product.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                      <TableCell className="text-center">{product.stockLevel}</TableCell>
                      <TableCell className="text-center">
                        {product.stockLevel > 10 ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            In Stock
                          </Badge>
                        ) : product.stockLevel > 0 ? (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Out of Stock
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenForm('edit', product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteConfirmId(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Product Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {formMode === 'add' ? 'Add New Product' : 'Edit Product'}
              </DialogTitle>
              <DialogDescription>
                Fill out the form below to {formMode === 'add' ? 'add a new product to' : 'update this product in'} your inventory.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={currentProduct.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={currentProduct.sku}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={currentProduct.description}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={currentProduct.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stockLevel">Stock Quantity *</Label>
                  <Input
                    id="stockLevel"
                    name="stockLevel"
                    type="number"
                    min="0"
                    value={currentProduct.stockLevel}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    name="category"
                    value={currentProduct.category}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Image URL *</Label>
                <Input
                  id="image"
                  name="image"
                  value={currentProduct.image}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="badge">Badge (optional)</Label>
                <Input
                  id="badge"
                  name="badge"
                  value={currentProduct.badge || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., New, Sale, Popular"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={currentProduct.featured}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {formMode === 'add' ? 'Add Product' : 'Update Product'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this product? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
