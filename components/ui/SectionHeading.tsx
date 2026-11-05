import { cn } from "@/lib/cn";

interface Props { title: string; text?: string; align?: "left" | "center"; light?: boolean }

export default function SectionHeading({ title, text, align = "center", light }: Props) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <h2 className={cn("text-3xl font-extrabold tracking-tight sm:text-4xl", light ? "text-white" : "text-ink")}>{title}</h2>
      {text && <p className={cn("mt-4 text-base leading-relaxed sm:text-lg", light ? "text-white/85" : "text-ink-soft")}>{text}</p>}
    </div>
  );
}
