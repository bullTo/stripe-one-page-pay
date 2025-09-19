import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Loader2, CreditCard, Shield, Check, ArrowLeft, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { stripePromise } from '@/lib/stripe';

interface PaymentFormProps {
  selectedPlan: {
    id: string;
    name: string;
    price: number;
  } | null;
  onBack: () => void;
}

// Price IDs for each plan
const PRICE_IDS = {
  basic: 'price_1S95B2EPUe4GfW8TWa1X8L2x',
  pro: 'price_1S95BKEPUe4GfW8TMLQ7J7Kl',
  enterprise: 'price_1S95BaEPUe4GfW8T1NrWL6dQ'
};

const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMiwiZW1haWwiOiJqYWNrMTBAZXhhbXBsZS5jb20iLCJleHAiOjE3NTgzMTUyODYsInR5cGUiOiJhY2Nlc3MifQ.jU9KP8y-uhwgVuW5PagaI3IXKFr_FteDKMc7WT_m6wc"

export default function PaymentForm({ selectedPlan, onBack }: PaymentFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // On mount, check URL query params for subscription outcome and show toasts
  useEffect(() => {
    console.log('PaymentForm mounted, checking URL params for subscription status');
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const subscription = params.get('subscription');
    console.log('Found subscription param:', subscription);
    if (!subscription) return;

    if (subscription === 'success') {
      setPaymentSuccess(true);
      toast({
        title: 'Payment Successful!',
        description: 'Your subscription has been activated.',
      });
    } else if (subscription === 'cancel') {
      toast({
        title: 'Payment Cancelled',
        description: 'You cancelled the payment. No changes were made.',
        variant: 'destructive',
      });
    }

    // Remove the subscription param from the URL so the toast doesn't reappear on refresh
    params.delete('subscription');
    const newSearch = params.toString();
    const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '');
    window.history.replaceState({}, document.title, newUrl);
  }, [toast]);

  const handleStripeCheckout = async () => {
    if (!selectedPlan) return;

    setIsLoading(true);
    console.log('Initiating checkout for plan:', selectedPlan);
    try {
      // Get the price ID for the selected plan
      const priceId = PRICE_IDS[selectedPlan.id as keyof typeof PRICE_IDS];
      console.log('Using price ID:', priceId);
      if (!priceId) {
        throw new Error('Invalid plan selected');
      }

      // Call backend to create a Stripe Checkout session
      toast({
        title: 'Redirecting to Stripe Checkout',
        description: "You'll be redirected to complete your payment securely.",
      });

  // Build success and cancel URLs so backend can create the Stripe session with proper redirects
  // Use query params so the returning page can show a toast based on ?subscription=success|cancel
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const successUrl = `${origin}?subscription=success`;
  const cancelUrl = `${origin}?subscription=cancel`;

      const resp = await fetch('http://localhost:8000/v1/billing/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify({ price_id: priceId, success_url: successUrl, cancel_url: cancelUrl }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Backend error: ${resp.status} ${text}`);
      }

      const data = await resp.json();

      // Backend may return either a sessionId (preferred) or a redirect URL
      const { sessionId, url } = data as { sessionId?: string; url?: string };

      // Use Stripe.js to redirect to checkout if we have a sessionId
      if (sessionId) {
        const stripe = await stripePromise;
        if (!stripe) throw new Error('Stripe.js failed to load');

        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) throw error;
        // redirectToCheckout will navigate away; nothing more to do here
      } else if (url) {
        // Fallback: backend provided a direct URL
        window.location.href = url;
      } else {
        throw new Error('Invalid response from backend');
      }

      // If we get here, assume redirect happened. Keep spinner on until navigation.
      setIsLoading(false);

    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to redirect to checkout. Please try again.",
        variant: "destructive",
      });
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
              className="w-full hover:opacity-90 text-white shadow-payment"
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
        <div className="space-y-4">
          <div className="p-4 bg-secondary/50 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">{selectedPlan.name} Plan</span>
              <span className="text-lg font-bold text-foreground">${selectedPlan.price}.00</span>
            </div>
            <div className="text-xs text-muted-foreground">Monthly subscription</div>
          </div>

          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span className="font-medium text-foreground">Secure Stripe Checkout</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              You'll be redirected to Stripe's secure checkout page to complete your payment with bank-level security.
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• 256-bit SSL encryption</li>
              <li>• PCI DSS compliant</li>
              <li>• Multiple payment methods</li>
              <li>• Instant activation</li>
            </ul>
          </div>
        </div>

        <Button
          onClick={handleStripeCheckout}
          disabled={isLoading}
          className="w-full bg-payment-gradient hover:opacity-90 text-white shadow-payment font-semibold py-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redirecting to Stripe...
            </>
          ) : (
            <>
              Subscribe to {selectedPlan.name} - $${selectedPlan.price}/month
              <ExternalLink className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            By subscribing, you agree to our terms of service and privacy policy
          </p>
        </div>
      </CardContent>
    </Card>
  );
}