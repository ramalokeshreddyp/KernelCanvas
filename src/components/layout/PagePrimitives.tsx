export function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Icon size={16} className="text-primary" />
      <h2 className="text-sm font-mono font-bold tracking-wider text-foreground">{title}</h2>
      {subtitle && <span className="text-xs font-mono text-muted-foreground">- {subtitle}</span>}
    </div>
  );
}

export function PanelCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`rounded-xl border border-border bg-card/90 p-4 shadow-sm md:p-5 ${className}`}>{children}</section>;
}

export function PageIntro({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="space-y-2 text-center md:text-left">
      <h1 className="text-2xl font-mono font-bold tracking-wider text-foreground md:text-3xl">{title}</h1>
      <p className="mx-auto max-w-3xl text-sm text-muted-foreground md:mx-0 md:text-base">{subtitle}</p>
    </div>
  );
}
