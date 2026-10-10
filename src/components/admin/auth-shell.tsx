import type { ReactNode } from "react";
import { Logo } from "@/components/site/logo";

export function AuthShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main id="main" className="flex min-h-dvh items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-[4px] border border-sage bg-white p-7 sm:p-9">
          <h1 className="mb-6 text-[2rem] leading-tight text-ink">{title}</h1>
          {children}
        </div>
      </div>
    </main>
  );
}
