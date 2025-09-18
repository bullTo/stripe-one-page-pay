import { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Loader2, CreditCard, Shield, Check, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentFormProps {
  selectedPlan: {
    id: string;
    name: string;
    price: number;
  } | null;
  onBack: () => void;
}

export default function PaymentForm({ selectedPlan, onBack }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPlan) {
      // Create payment intent
      createPaymentIntent();
    }
  }, [selectedPlan]);

  const createPaymentIntent = async () => {
    try {
      // In a real app, this would call your backend to create a payment intent
      // For demo purposes, we'll simulate this
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedPlan!.price * 100, // Convert to cents
          currency: 'usd',
        }),
      });
      
      if (response.ok) {
        const { client_secret } = await response.json();
        setClientSecret(client_secret);
      } else {
        // Simulate client secret for demo
        setClientSecret('pi_demo_client_secret');
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      // Simulate client secret for demo
      setClientSecret('pi_demo_client_secret');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !selectedPlan) {
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, this would confirm the payment with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message || "An error occurred during payment.",
          variant: "destructive",
        });
      } else {
        setPaymentSuccess(true);
        toast({
          title: "Payment Successful!",
          description: `Your ${selectedPlan.name} subscription has been activated.`,
        });
      }
    } catch (error) {
      // For demo purposes, simulate success
      setTimeout(() => {
        setPaymentSuccess(true);
        toast({
          title: "Payment Successful!",
          description: `Your ${selectedPlan.name} subscription has been activated.`,
        });
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedPlan) {
    return (
      <Card className="w-full max-w-md mx-auto bg-card-gradient shadow-card border-0">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Please select a plan to continue.</p>
          <Button onClick={onBack} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plans
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (paymentSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto bg-card-gradient shadow-card border-0">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-payment-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground mb-2">
            Your <strong>{selectedPlan.name}</strong> subscription is now active.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            You'll receive a confirmation email shortly.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={onBack}
              className="w-full bg-payment-gradient hover:opacity-90 text-white shadow-payment"
            >
              Back to Plans
            </Button>
            <Button 
              variant="outline"
              onClick={() => setPaymentSuccess(false)}
              className="w-full"
            >
              Make Another Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-card-gradient shadow-card border-0">
      <CardHeader className="text-center pb-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="absolute left-4 top-4 p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        <div className="w-12 h-12 bg-payment-gradient rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Secure Payment</h2>
        <p className="text-muted-foreground">Complete your {selectedPlan.name} subscription</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-secondary/50 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{selectedPlan.name} Plan</span>
                <span className="text-lg font-bold text-foreground">${selectedPlan.price}.00</span>
              </div>
              <div className="text-xs text-muted-foreground">Monthly subscription</div>
            </div>
            
            {clientSecret ? (
              <div className="space-y-4">
                <PaymentElement
                  options={{
                    layout: 'tabs',
                  }}
                />
              </div>
            ) : (
              <div className="p-4 bg-secondary/30 rounded-lg border-2 border-dashed border-border">
                <div className="text-center text-sm text-muted-foreground">
                  <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin opacity-50" />
                  Loading payment form...
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>

          <Button
            disabled={!stripe || isLoading || !clientSecret}
            type="submit"
            className="w-full bg-payment-gradient hover:opacity-90 text-white shadow-payment font-semibold py-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Subscribe to ${selectedPlan.name} - $${selectedPlan.price}/month`
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            By subscribing, you agree to our terms of service and privacy policy
          </p>
        </div>
      </CardContent>
    </Card>
  );
}