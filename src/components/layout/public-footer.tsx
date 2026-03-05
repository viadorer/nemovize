import Link from "next/link"

export function PublicFooter() {
  return (
    <footer className="border-t border-[rgba(0,112,243,0.15)] bg-[rgba(240,255,240,0.65)] backdrop-blur-[10px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Nemovize</h3>
            <p className="text-base text-muted-foreground mt-4">
              Transparentní prodej nemovitosti založený na datech.
            </p>
          </div>

          <div>
            <h4 className="text-base font-semibold mb-4">Služby</h4>
            <div className="space-y-3">
              <Link href="/properties" className="block text-base text-muted-foreground hover:text-foreground transition-colors">
                Nemovitosti
              </Link>
              <Link href="/valuation" className="block text-base text-muted-foreground hover:text-foreground transition-colors">
                Online ocenění
              </Link>
              <Link href="/consultants" className="block text-base text-muted-foreground hover:text-foreground transition-colors">
                Konzultanti
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold mb-4">Firma</h4>
            <div className="space-y-3">
              <Link href="/about" className="block text-base text-muted-foreground hover:text-foreground transition-colors">
                O nás
              </Link>
              <Link href="/contact" className="block text-base text-muted-foreground hover:text-foreground transition-colors">
                Kontakt
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold mb-4">Kontakt</h4>
            <div className="space-y-3 text-base text-muted-foreground">
              <p>info@nemovize.cz</p>
              <p>+420 123 456 789</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-base text-muted-foreground">
          {new Date().getFullYear()} Nemovize. Všechna práva vyhrazena.
        </div>
      </div>
    </footer>
  )
}
