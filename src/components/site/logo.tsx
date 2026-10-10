import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/brand/anoka-advisors-logo.png";
import mark from "@/assets/brand/anoka-mark.png";

/** The full logo: gold A mark, "Anoka" in white and "Advisors" in bronze. For dark backgrounds. */
export function BrandLogo({ className = "h-11 w-auto", priority = false }: { className?: string; priority?: boolean }) {
  return <Image src={logo} alt="Anoka Advisors" priority={priority} sizes="200px" className={className} />;
}

/** The gold A mark on its own. Decorative unless alt is given. */
export function BrandMark({ className = "size-10", alt = "" }: { className?: string; alt?: string }) {
  return <Image src={mark} alt={alt} sizes="64px" className={className} />;
}

/** For light backgrounds (the admin sign-in page): the mark with the name in dark type. */
export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 text-evergreen no-underline" aria-label="Anoka Advisors, home">
      <BrandMark className="size-10 shrink-0" />
      <span className="font-serif text-[1.375rem] leading-none font-medium tracking-[-0.01em]">Anoka Advisors</span>
    </Link>
  );
}
