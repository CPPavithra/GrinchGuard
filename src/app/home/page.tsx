"use client";

import { PublicLayout } from "@/components/public-layout";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const { toast } = useToast();

  const handleHoneypotClick = () => {
    console.log("Honeypot clicked! Logging potential bot activity.");
    toast({
      title: "Security Alert",
      description: "Honeypot interaction detected. Suspicious activity logged.",
      variant: "destructive",
    });
    // In a real app, this would send a high-priority log to Firebase
  };
  
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8 md:px-6">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Today's Deals
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {/* Honeypot Element */}
        <button
          onClick={handleHoneypotClick}
          style={{ display: "none" }}
          aria-hidden="true"
          tabIndex={-1}
        >
          Special Offer
        </button>
      </div>
    </PublicLayout>
  );
}
