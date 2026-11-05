import { cn } from "@/lib/cn";

type Variant = "primary" | "white" | "outline" | "outlineWhite";

interface ButtonProps {
  href: string;
  variant?: Variant;
  size?: "md" | "lg";
  className?: string;
  children: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white shadow-card hover:bg-brand-dark hover:-translate-y-0.5",
  white: "bg-white text-brand shadow-card hover:bg-sky-light hover:-translate-y-0.5",
  outline: "border-2 border-brand text-brand hover:bg-brand hover:text-white",
  outlineWhite: "border-2 border-white/70 text-white hover:bg-white hover:text-brand",
};

export default function Button({ href, variant = "primary", size = "md", className, children }: ButtonProps) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200",
        size === "md" ? "px-6 py-2.5 text-sm" : "px-8 py-3.5 text-base",
        variants[variant],
        className,
      )}
    >
      {children}
    </a>
  );
}
