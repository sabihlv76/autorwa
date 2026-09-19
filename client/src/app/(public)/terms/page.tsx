import Link from "next/link";

// Deliberately English-only, unlike the rest of the public storefront —
// legal text should have one authoritative version rather than a
// best-effort machine-quality translation of legal language into 3 more
// locales. This is a generic template, not reviewed by a lawyer — see the
// notice below, which is not just decoration.
export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
        Terms &amp; Conditions
      </h1>

      <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        <strong>Template notice:</strong> this is a general starting-point template covering
        what Autorwa actually does today. It has not been reviewed by a lawyer and is not a
        substitute for real legal advice. Have it reviewed before relying on it as your
        actual, binding terms.
      </div>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-zinc-700">
        <section>
          <h2 className="text-base font-semibold text-black">1. Acceptance of these terms</h2>
          <p className="mt-2">
            By accessing or using Autorwa (the &ldquo;Service&rdquo;), you agree to be bound by
            these Terms &amp; Conditions. If you do not agree, please do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-black">2. What the Service is</h2>
          <p className="mt-2">
            Autorwa is a marketplace that connects buyers with sellers and dealerships of
            vehicles and vehicle spare parts in Rwanda. Depending on the listing, you may be
            able to: browse and add items to a cart and complete an order request over
            WhatsApp with the seller; book a call with a seller; or rent a vehicle for a set
            number of days. Autorwa facilitates these connections but is not itself the buyer,
            seller, or lessor in any transaction unless explicitly stated.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-black">3. Accounts</h2>
          <p className="mt-2">
            Some features (favorites, cart history, call bookings tied to your profile) require
            an account. You&rsquo;re responsible for keeping your login credentials secure and
            for all activity under your account. You must provide accurate information when
            creating an account or placing an order.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-black">4. Listings and sellers</h2>
          <p className="mt-2">
            Sellers are responsible for the accuracy of their own listings (condition, pricing,
            availability, specifications). Autorwa does not inspect, certify, or guarantee
            third-party listings unless a listing is explicitly marked otherwise. Buyers should
            verify a vehicle or part&rsquo;s condition directly with the seller before completing
            a purchase.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-black">5. Pricing and currency</h2>
          <p className="mt-2">
            Prices are shown in the seller&rsquo;s listed currency (RWF or USD) and may be
            displayed in your selected currency using an approximate conversion rate for
            convenience only. The actual transaction currency and amount are agreed directly
            between buyer and seller. Autorwa is not responsible for exchange-rate
            discrepancies.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-black">6. Communication over WhatsApp</h2>
          <p className="mt-2">
            Order requests, call-booking confirmations, and seller contact are conducted over
            WhatsApp and phone, outside of Autorwa&rsquo;s own systems. Autorwa is not
            responsible for the content of, or agreements made during, those direct
            communications.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-black">7. Limitation of liability</h2>
          <p className="mt-2">
            To the fullest extent permitted by law, Autorwa is not liable for any indirect,
            incidental, or consequential damages arising from your use of the Service,
            including disputes between buyers and sellers, vehicle condition issues, or missed
            appointments.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-black">8. Changes to these terms</h2>
          <p className="mt-2">
            These terms may be updated from time to time. Continued use of the Service after a
            change means you accept the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-black">9. Contact</h2>
          <p className="mt-2">
            Questions about these terms? Reach out via the{" "}
            <Link href="/contact" className="text-accent-dark hover:underline">
              Contact Us
            </Link>{" "}
            page.
          </p>
        </section>
      </div>
    </div>
  );
}
