import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/data';
import { PublicLayout } from '@/components/public-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star, ShoppingCart } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <PublicLayout>
      <div className="container mx-auto max-w-5xl px-4 py-8 md:px-6">
        <Card className="overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2">
              <div className="p-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="h-full w-full rounded-lg object-cover"
                  data-ai-hint={product.dataAiHint}
                />
              </div>
              <div className="flex flex-col p-6 md:p-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                  {product.name}
                </h1>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">(1,283 reviews)</span>
                </div>
                <Separator className="my-6" />
                <p className="text-4xl font-extrabold text-primary">${product.price.toFixed(2)}</p>
                <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
                <div className="mt-auto flex flex-col gap-3 pt-8">
                  <Button size="lg" className="w-full text-lg">Buy Now</Button>
                  <Button size="lg" variant="outline" className="w-full text-lg">
                    <ShoppingCart className="mr-2 h-6 w-6" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
