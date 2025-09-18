import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import PaymentForm from './PaymentForm';
import { Shield, Lock, CreditCard } from 'lucide-react';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-payment-gradient">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Secure Checkout
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Complete your purchase with our secure, encrypted payment system
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Payment Form */}
          <div className="order-2 lg:order-1">
            <Elements stripe={stripePromise}>
              <PaymentForm />
            </Elements>
          </div>

          {/* Features & Trust Signals */}
          <div className="order-1 lg:order-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Why choose our secure payment?
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Bank-Level Security</h3>
                    <p className="text-muted-foreground">
                      Your payment information is protected with industry-standard encryption
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">PCI Compliant</h3>
                    <p className="text-muted-foreground">
                      We meet the highest standards for payment card industry compliance
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Multiple Payment Methods</h3>
                    <p className="text-muted-foreground">
                      Accept all major credit cards and digital payment methods
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="p-6 bg-secondary/30 rounded-lg border">
              <h3 className="font-semibold text-foreground mb-4">Trusted by thousands</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-payment-success rounded-full"></div>
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-payment-success rounded-full"></div>
                  <span>256-bit Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-payment-success rounded-full"></div>
                  <span>PCI DSS Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}