import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function TermsPage() {
  const t = useTranslations('legal');

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Draft Warning Banner */}
      <div className="bg-yellow-400 text-yellow-900 px-4 py-3 text-center text-sm font-semibold">
        ⚠️ {t('draftWarning')}
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link
          href="/"
          className="inline-flex items-center text-amber-800 hover:text-amber-600 mb-8 text-sm font-medium"
        >
          ← Back
        </Link>

        <h1 className="text-3xl font-bold text-stone-800 mb-2">{t('terms')}</h1>
        <p className="text-stone-500 text-sm mb-10">
          {t('lastUpdated')}: June 30, 2026 &nbsp;|&nbsp; Version 1.0
        </p>

        {/* Plain-language summary — for humans */}
        <div className="bg-amber-100 border border-amber-200 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-stone-800 mb-4">💛 {t('humanTitle')}</h2>
          <ul className="space-y-2.5">
            {(t.raw('termsHuman') as string[]).map((point, i) => (
              <li key={i} className="text-stone-700 leading-relaxed">
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Full legal document — collapsed by default */}
        <details className="group">
          <summary className="cursor-pointer list-none inline-flex items-center gap-2 text-amber-800 hover:text-amber-600 font-medium text-sm mb-6 select-none">
            <span className="transition-transform group-open:rotate-90">▶</span>
            {t('viewFullLegal')}
          </summary>

          <div className="space-y-8 text-stone-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">1. Introduction</h2>
            <p>
              Welcome to Frenchie Health Companion ("the App," "we," "us," or "our"). By creating an account
              or using the App, you agree to these Terms of Service ("Terms"). Please read them carefully.
              If you do not agree, do not use the App.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">2. Description of Service</h2>
            <p>
              Frenchie Health Companion is an educational pet-health tracking application designed to help
              owners of French Bulldogs monitor and log health observations across 6 integrated modules:
              skin health, respiratory care, ear &amp; eye checks, joint mobility, weight &amp; digestion,
              and general health calendar. The App also provides general care tips, a nutrition guide,
              and an AI assistant for educational information purposes.
              The App is <strong>not a veterinary service</strong> and does not provide medical diagnosis,
              treatment advice, or prescriptions of any kind.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">3. Eligibility</h2>
            <p>
              You must be at least 18 years old to create an account. By using the App you represent that
              you meet this requirement and that all information you provide is accurate and complete.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">4. User Accounts</h2>
            <p>
              You are responsible for maintaining the security of your account credentials. You agree to
              notify us immediately of any unauthorized use of your account. We are not liable for losses
              caused by unauthorized use of your account.
            </p>
            <p className="mt-2">
              You may delete your account at any time from the Settings section of the App. Upon deletion,
              your personal data will be handled in accordance with our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">5. Subscription Plans and Payments</h2>
            <p>
              The App offers a free tier with limited features and a paid Premium subscription.
              Subscriptions are billed through Stripe. By subscribing you authorize us to charge your
              payment method on a recurring basis at the then-current subscription price.
            </p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Free Plan: up to 5 skin-tracking entries, 3 AI chat messages per day, basic content.</li>
              <li>Premium Monthly: $7.99/month — unlimited entries across all 6 health modules, PDF export, unlimited AI chat, full feeding plan.</li>
              <li>Lifetime: one-time purchase of $59 for permanent Premium access to all current and future modules.</li>
            </ul>
            <p className="mt-2">
              Prices are displayed in USD and may be subject to applicable taxes depending on your location.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">6. Cancellation and Refunds</h2>
            <p>
              You may cancel your subscription at any time through your account settings or by contacting
              support. Cancellation takes effect at the end of the current billing period; you will retain
              access to Premium features until then. We do not offer prorated refunds for partial billing
              periods except where required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">7. Medical Disclaimer</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="font-semibold text-red-800 mb-2">Important — Please Read</p>
              <p>
                Frenchie Health Companion is an informational and educational tool only. It does{' '}
                <strong>NOT</strong> diagnose medical conditions, <strong>NOT</strong> prescribe
                treatments, and <strong>NOT</strong> replace the professional judgment of a licensed
                veterinarian. The App's 6 health modules (skin, respiratory, ears &amp; eyes, joints,
                weight &amp; digestion, and general health) are tracking and logging tools only — not
                diagnostic instruments. Always seek professional veterinary advice for any health
                concern about your pet. In the event of an emergency — including difficulty breathing,
                collapse, seizures, paralysis, or extreme lethargy — seek immediate veterinary care.
              </p>
              <p className="mt-3 text-sm text-red-700">
                The AI assistant integrated into this App may be subject to the EU AI Act (Regulation
                2024/1689) as a general-purpose AI system. It is classified as a low-risk tool and is
                not intended for high-risk decision-making in medical, legal, or safety contexts.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">8. User Content</h2>
            <p>
              You retain ownership of photos, notes, and other content you upload ("User Content"). By
              uploading content, you grant us a limited, non-exclusive license to store and display that
              content solely to provide the App's features to you. We do not sell your User Content to
              third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">9. Privacy</h2>
            <p>
              Your privacy matters to us. Our collection and use of personal information is described in
              our{' '}
              <Link href="/privacy" className="text-amber-700 underline hover:text-amber-500">
                Privacy Policy
              </Link>
              , which is incorporated into these Terms by reference.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">10. Prohibited Uses</h2>
            <p>You agree not to:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Use the App for any unlawful purpose.</li>
              <li>Attempt to reverse-engineer, scrape, or copy the App's content or code.</li>
              <li>Impersonate any person or entity.</li>
              <li>Upload content that is harmful, offensive, or infringes third-party rights.</li>
              <li>Attempt to circumvent usage limits or access features not available on your plan.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">11. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Frenchie Skin Tracker and its operators shall not be
              liable for any indirect, incidental, special, consequential, or punitive damages arising from
              your use of the App. Our total liability for any claim shall not exceed the amount you paid
              to us in the twelve months preceding the claim, or $10 USD, whichever is greater.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">12. Disclaimer of Warranties</h2>
            <p>
              The App is provided "as is" and "as available" without warranties of any kind, express or
              implied, including but not limited to merchantability, fitness for a particular purpose, or
              non-infringement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">13. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the jurisdiction in which the App operator is
              registered, without regard to conflict-of-law principles. Any disputes shall be resolved
              through binding arbitration or, where arbitration is not enforceable, in the courts of that
              jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">14. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. When we do, we will revise the "last updated"
              date above and notify you via email or in-app notice. Continued use of the App after changes
              take effect constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">15. Contact</h2>
            <p>
              Questions about these Terms? Contact us at{' '}
              <a
                href="mailto:support@frenchieskintracker.com"
                className="text-amber-700 underline hover:text-amber-500"
              >
                support@frenchieskintracker.com
              </a>
              .
            </p>
          </section>

          </div>
        </details>

        <div className="mt-12 pt-6 border-t border-stone-200 text-center">
          <Link
            href="/"
            className="inline-block bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors"
          >
            ← Back to App
          </Link>
        </div>
      </div>
    </div>
  );
}
