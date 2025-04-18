
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CheckoutAddress from "./CheckoutAddress";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: string;
    name: string;
    price: number;
  };
}

const CheckoutDialog: React.FC<CheckoutDialogProps> = ({ open, onOpenChange, product }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddressSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Here we'll add the Stripe integration in the next step
      console.log("Address submitted:", data);
      toast({
        title: "Processing payment",
        description: "Redirecting to payment gateway...",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Checkout - {product.name}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-6">
            <p className="text-lg font-semibold">Total Amount: ${product.price.toFixed(2)}</p>
          </div>
          <CheckoutAddress onSubmit={handleAddressSubmit} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
