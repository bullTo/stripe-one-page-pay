import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Loader2, CreditCard, Shield, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    // For demo purposes, we'll simulate a successful payment
    // In a real app, you'd create a payment intent on your backend
    setTimeout(() => {
      setIsLoading(false);
      setPaymentSuccess(true);
      toast({
        title: "Payment Successful!",
        description: "Your payment has been processed successfully.",
      });
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto bg-card-gradient shadow-card border-0">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-payment-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for your payment. Your transaction has been completed successfully.
          </p>
          <Button 
            onClick={() => setPaymentSuccess(false)}
            className="bg-payment-gradient hover:opacity-90 text-white shadow-payment"
          >
            Make Another Payment
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-card-gradient shadow-card border-0">
      <CardHeader className="text-center pb-4">
        <div className="w-12 h-12 bg-payment-gradient rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Secure Payment</h2>
        <p className="text-muted-foreground">Complete your payment securely</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-secondary/50 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Amount</span>
                <span className="text-lg font-bold text-foreground">$99.00</span>
              </div>
              <div className="text-xs text-muted-foreground">One-time payment</div>
            </div>
            
            {/* Note: PaymentElement would need a real payment intent */}
            <div className="p-4 bg-secondary/30 rounded-lg border-2 border-dashed border-border">
              <div className="text-center text-sm text-muted-foreground">
                <CreditCard className="w-6 h-6 mx-auto mb-2 opacity-50" />
                Payment form would appear here<br />
                <span className="text-xs">(Requires backend setup for payment intents)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>

          <Button
            disabled={!stripe || isLoading}
            type="submit"
            className="w-full bg-payment-gradient hover:opacity-90 text-white shadow-payment font-semibold py-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Pay $99.00'
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            By completing your payment, you agree to our terms of service
          </p>
        </div>
      </CardContent>
    </Card>
  );
}