import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import type Stripe from "stripe";
import { SchedulingEmbed } from "@/components/site/scheduling-embed";
import { PageHero } from "@/components/site/sections";
import { getSchedulingUrl } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = pageMetadata({
  title: "Payment Confirmation",
  description: "Confirmation of your Anoka Advisors purchase.",
  path: "/checkout/success",
  noIndex: true,
});

async function loadSession(sessionId: string) {
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) return null;
  try {
    return await getStripe().checkout.sessions.retrieve(sessionId, { expand: ["line_items"] });
  } catch (error) {
    console.error("[checkout] Could not retrieve session", error);
    return null;
  }
}

function isPaid(session: Stripe.Checkout.Session) {
  return session.status === "complete" && session.payment_status !== "unpaid";
}

async function Confirmation({ searchParams }: { searchParams: PageProps<"/checkout/success">["searchParams"] }) {
  const { session_id } = await searchParams;
  const session = await loadSession(typeof session_id === "string" ? session_id : "");

  if (!session) {
    return (
      <div className="card max-w-3xl p-8">
        <h2 className="text-[2rem] text-fg">We could not find that checkout</h2>
        <p className="mt-4 text-fg-muted">
          The confirmation link may be incomplete. If you were charged, your receipt from Stripe has the details, and you
          can contact us so we can match it to your order.
        </p>
        <Link href="/contact" className="btn btn-gold mt-6">
          Contact us
        </Link>
      </div>
    );
  }

  const paid = isPaid(session);
  const itemName = session.line_items?.data[0]?.description ?? "your package";
  const email = session.customer_details?.email;
  const schedulingUrl = await getSchedulingUrl();

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <p className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/10 px-4 py-1.5 font-semibold text-gold">
          <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5">
            <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M6 10.5l2.75 2.75L14 8" stroke="currentColor" strokeWidth="1.75" fill="none" />
          </svg>
          {paid ? "Payment confirmed" : "Payment processing"}
        </p>
        <h2 className="mt-5 text-[2.25rem] leading-[1.1] text-fg">
          {paid ? `Your purchase of ${itemName} is complete.` : `Your order for ${itemName} is in.`}
        </h2>
        <p className="mt-5 text-fg-muted">
          {paid ? "" : "Your payment is still processing. Stripe will email you once it clears. "}
          {email ? `A receipt is on its way to ${email}.` : null}
        </p>
        <p className="mt-5 text-fg-muted">
          Next, choose a time for your video session. Questions in the meantime?{" "}
          <Link href="/contact" className="text-link">
            Send us a message
          </Link>
          .
        </p>
      </div>
      <div className="lg:col-span-8">
        <h2 className="mb-5 text-[1.75rem] text-fg">Choose a time for your session</h2>
        <SchedulingEmbed
          schedulingUrl={schedulingUrl}
          sessionId={session.id}
          prefill={{ name: session.customer_details?.name, email }}
          title="Book your session with Anoka Advisors"
        />
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage({ searchParams }: PageProps<"/checkout/success">) {
  return (
    <>
      <PageHero compact image="ck-success" title="Thank you for choosing Anoka Advisors" lede="Your next step is to choose a time for your video session." />
      <section className="page-container py-16 md:py-20">
        <Suspense fallback={<p className="text-lede text-fg-muted">Confirming your payment…</p>}>
          <Confirmation searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}
