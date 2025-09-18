import { useState } from 'react';
import { stripePromise } from '@/lib/stripe';
import PaymentForm from './PaymentForm';
import PricingTiers from './PricingTiers';
import { Shield, Lock, CreditCard, Star, Users, Zap } from 'lucide-react';

export default function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState<{
    id: string;
    name: string;
    price: number;
  } | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleTierSelect = (tierId: string, price: number) => {
    const tierNames: { [key: string]: string } = {
      basic: 'Basic',
      pro: 'Pro',
      enterprise: 'Enterprise'
    };
    
    setSelectedPlan({
      id: tierId,
      name: tierNames[tierId],
      price: price
    });
    setShowPayment(true);
  };

  const handleBackToPlans = () => {
    setShowPayment(false);
    setSelectedPlan(null);
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-payment-gradient">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {showPayment ? 'Secure Checkout' : 'Choose Your Plan'}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {showPayment 
              ? 'Complete your subscription with our secure, encrypted payment system'
              : 'Select the perfect plan for your needs and start your journey today'
            }
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {showPayment ? (
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Payment Form */}
            <div className="order-2 lg:order-1">
              <PaymentForm 
                selectedPlan={selectedPlan} 
                onBack={handleBackToPlans}
              />
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
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Pricing Tiers */}
            <PricingTiers 
              selectedTier={selectedPlan?.id || null}
              onTierSelect={handleTierSelect}
            />

            {/* Features Overview */}
            <div className="mt-16 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-8">
                Everything you need to succeed
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="p-6 bg-card-gradient rounded-lg border shadow-card">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Lightning Fast</h3>
                  <p className="text-muted-foreground">
                    Get up and running in minutes with our streamlined setup process
                  </p>
                </div>

                <div className="p-6 bg-card-gradient rounded-lg border shadow-card">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Team Collaboration</h3>
                  <p className="text-muted-foreground">
                    Work together seamlessly with advanced team management features
                  </p>
                </div>

                <div className="p-6 bg-card-gradient rounded-lg border shadow-card">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Premium Support</h3>
                  <p className="text-muted-foreground">
                    Get help when you need it with our dedicated support team
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}