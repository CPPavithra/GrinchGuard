import { PublicLayout } from "@/components/public-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Bot, User, BarChart, AlertTriangle } from "lucide-react";

export default function StoryPage() {
  const storyPoints = [
    {
      icon: User,
      title: "Happy Shoppers",
      description: "Our story begins with real customers enjoying the holiday deals, their every move creating a normal pattern of behavior."
    },
    {
      icon: Bot,
      title: "The Grinch Bot Arrives",
      description: "Suddenly, the Grinch Bot attacks! It tries to buy all the best toys, moving faster and more predictably than any human."
    },
    {
      icon: BarChart,
      title: "GrinchGuard AI Analyzes",
      description: "Our AI, GrinchGuard, watches everything. It spots the bot's unnatural speed, strange clicks, and fake information."
    },
    {
      icon: AlertTriangle,
      title: "Alerting the Elf Team",
      description: "GrinchGuard sends an instant alert to Santa's security elves, showing them exactly where the bot is and what it's doing."
    },
    {
      icon: Shield,
      title: "The System is Protected",
      description: "The elves use the GrinchGuard dashboard to block the bot, ensuring all the toys are safe for the real children. Christmas is saved!"
    }
  ];

  return (
    <PublicLayout>
      <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">The Story of Operation GrinchStop</h1>
          <p className="mt-4 text-lg text-muted-foreground">How Santa's Elves and AI save Christmas from malicious bots.</p>
        </div>
        <div className="mt-12 grid gap-8">
          {storyPoints.map((point, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <point.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">{point.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-base text-muted-foreground">{point.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
