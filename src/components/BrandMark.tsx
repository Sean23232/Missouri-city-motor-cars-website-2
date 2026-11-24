import Link from "next/link";

type BrandMarkProps = { inverse?: boolean; compact?: boolean };

export function BrandMark({ inverse = false, compact = false }: BrandMarkProps) {
  return (
    <Link
      href="/"
      className={`brand-mark${inverse ? " brand-mark-inverse" : ""}${compact ? " brand-mark-compact" : ""}`}
      aria-label="Missouri City Motor Cars home"
    >
      <span className="brand-script">Missouri City</span>
      <span className="brand-subline">MOTOR CARS</span>
    </Link>
  );
}
