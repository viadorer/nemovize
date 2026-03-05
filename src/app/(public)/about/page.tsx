import { Card, CardContent } from "@/components/ui/card"
import { Shield, BarChart3, Heart, Zap } from "lucide-react"

export const metadata = {
  title: "O nás",
}

const values = [
  {
    icon: BarChart3,
    title: "Přímost",
    description: "Řekneme vám narovinu, za kolik se vaše nemovitost skutečně prodá.",
  },
  {
    icon: Shield,
    title: "Bezpečnost",
    description: "Právní jistota a transparentní smlouvy bez kliček.",
  },
  {
    icon: Heart,
    title: "Empatie",
    description: "Chápeme, že prodej nemovitosti je stresující životní událost.",
  },
  {
    icon: Zap,
    title: "Efektivita",
    description: "Digitální procesy. Žádné zbytečné papírování a zdlouhavé schůzky.",
  },
]

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">O Nemovize</h1>
        <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
          Budujeme platformu pro transparentní prodej nemovitosti.
          Náš přístup je založený na datech, ne na pocitech.
          Odstraňujeme tradiční nedůvěru vůči realitním makléřům.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
        {values.map((value) => (
          <Card key={value.title}>
            <CardContent className="p-6">
              <div className="p-3 rounded-xl bg-accent/10 text-accent w-fit">
                <value.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold mt-4">{value.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{value.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
