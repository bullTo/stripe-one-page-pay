import { Check, Star, Zap, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const pricingTiers = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9,
    currency: 'USD',
    icon: Zap,
    popular: false,
    description: 'Perfect for getting started',
    features: [
      'Up to 5 projects',
      'Basic analytics',
      'Email support',
      '1GB storage',
      'Standard templates'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    currency: 'USD',
    icon: Star,
    popular: true,
    description: 'Most popular choice for professionals',
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      '10GB storage',
      'Premium templates',
      'API access',
      'Team collaboration'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    currency: 'USD',
    icon: Crown,
    popular: false,
    description: 'For large teams and organizations',
    features: [
      'Everything in Pro',
      'Custom integrations',
      'Dedicated support',
      'Unlimited storage',
      'White-label solution',
      'Advanced security',
      'SLA guarantee',
      'Custom contracts'
    ]
  }
];

interface PricingTiersProps {
  selectedTier: string | null;
  onTierSelect: (tierId: string, price: number) => void;
}

export default function PricingTiers({ selectedTier, onTierSelect }: PricingTiersProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {pricingTiers.map((tier) => {
        const Icon = tier.icon;
        const isSelected = selectedTier === tier.id;
        
        return (
          <Card 
            key={tier.id}
            className={`relative transition-all duration-300 hover:shadow-card cursor-pointer ${
              isSelected 
                ? 'ring-2 ring-primary shadow-card bg-card-gradient' 
                : 'hover:shadow-card bg-card-gradient'
            } ${tier.popular ? 'scale-105 md:scale-110' : ''}`}
            onClick={() => onTierSelect(tier.id, tier.price)}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-payment-gradient text-white px-4 py-1 font-semibold">
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                tier.popular 
                  ? 'bg-payment-gradient text-white' 
                  : 'bg-primary/10 text-primary'
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
              <p className="text-sm text-muted-foreground">{tier.description}</p>
              
              <div className="mt-4">
                <span className="text-3xl font-bold text-foreground">${tier.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 bg-payment-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-payment-success" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                className={`w-full font-semibold ${
                  isSelected
                    ? 'bg-payment-gradient hover:opacity-90 text-white shadow-payment'
                    : tier.popular
                    ? 'bg-payment-gradient hover:opacity-90 text-white shadow-payment'
                    : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onTierSelect(tier.id, tier.price);
                }}
              >
                {isSelected ? 'Selected' : 'Choose Plan'}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}