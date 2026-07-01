import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function PrivacyPage() {
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

        <h1 className="text-3xl font-bold text-stone-800 mb-2">{t('privacy')}</h1>
        <p className="text-stone-500 text-sm mb-10">
          {t('lastUpdated')}: June 30, 2026 &nbsp;|&nbsp; Version 1.0
        </p>

        {/* Plain-language summary — for humans */}
        <div className="bg-amber-100 border border-amber-200 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-stone-800 mb-4">🔒 {t('humanTitle')}</h2>
          <ul className="space-y-2.5">
            {(t.raw('privacyHuman') as string[]).map((point, i) => (
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
              This Privacy Policy explains how Frenchie Health Companion ("we," "us," or "our") collects,
              uses, and protects the personal information of users ("you") of our application. We are
              committed to transparency and to handling your data responsibly in compliance with applicable
              laws, including the EU General Data Protection Regulation (GDPR) and the California Consumer
              Privacy Act (CCPA).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">2. Information We Collect</h2>
            <p className="mb-2">We collect the following categories of information:</p>

            <h3 className="font-semibold text-stone-700 mt-4 mb-1">a) Account Information</h3>
            <p>Email address and authentication tokens provided when you create an account.</p>

            <h3 className="font-semibold text-stone-700 mt-4 mb-1">b) Pet Information</h3>
            <p>
              Your dog's name, date of birth, weight, and profile photo (optional) that you voluntarily
              enter into the App.
            </p>

            <h3 className="font-semibold text-stone-700 mt-4 mb-1">c) Health Tracking Data</h3>
            <p>
              Data you record across the App's 6 health modules, including: skin photos, itch scores,
              and zone observations; respiratory episode logs and triggers; ear and eye check results;
              joint pain scores and mobility notes; weight measurements and digestion logs; and
              general health events such as vaccinations, vet visits, and parasite prevention records.
            </p>

            <h3 className="font-semibold text-stone-700 mt-4 mb-1">d) Chat Messages</h3>
            <p>
              Messages you send to the AI assistant, stored to maintain conversation context across
              sessions.
            </p>

            <h3 className="font-semibold text-stone-700 mt-4 mb-1">e) Payment Information</h3>
            <p>
              If you subscribe to a paid plan, payment processing is handled by Stripe. We receive only a
              Stripe customer ID and subscription status — we do not store credit card numbers or full
              payment details.
            </p>

            <h3 className="font-semibold text-stone-700 mt-4 mb-1">f) Consent Records</h3>
            <p>
              Timestamps and versions of legal documents you accepted, which we retain as proof of
              informed consent.
            </p>

            <h3 className="font-semibold text-stone-700 mt-4 mb-1">g) Usage Data</h3>
            <p>
              Standard server logs including IP addresses, browser type, pages visited, and timestamps.
              This data is used for security monitoring and product improvement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">3. How We Use Your Information</h2>
            <p>We use the information collected to:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Provide, operate, and improve the App's features.</li>
              <li>Personalize your experience (e.g., showing your dog's history and relevant tips).</li>
              <li>Process subscription payments through Stripe.</li>
              <li>Send transactional emails (account confirmation, password reset).</li>
              <li>Provide AI-assisted responses via the Mistral AI API.</li>
              <li>Maintain legal consent records.</li>
              <li>Comply with legal obligations.</li>
            </ul>
            <p className="mt-2">
              We do <strong>not</strong> sell your personal data to third parties. We do not use your data
              for targeted advertising.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">
              4. Data Storage and Security (Supabase)
            </h2>
            <p>
              Your data is stored securely on Supabase, a cloud database platform built on PostgreSQL.
              Supabase stores data on servers in the United States (AWS). All data is encrypted in transit
              (TLS 1.2+) and at rest. Row-Level Security (RLS) policies ensure that you can only access
              your own data — no other user can read or write your records.
            </p>
            <p className="mt-2">
              Photos uploaded to the skin tracker are stored in Supabase Storage, accessible only to you
              via authenticated, time-limited URLs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">5. Third-Party Services</h2>

            <h3 className="font-semibold text-stone-700 mt-3 mb-1">Stripe</h3>
            <p>
              Payment processing is handled by Stripe, Inc. When you subscribe, you interact directly with
              Stripe's secure checkout. Stripe's privacy policy is available at{' '}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 underline hover:text-amber-500"
              >
                stripe.com/privacy
              </a>
              .
            </p>

            <h3 className="font-semibold text-stone-700 mt-4 mb-1">Mistral AI</h3>
            <p>
              The AI chat feature is powered by the Mistral AI API. Messages you send to the assistant
              are transmitted to Mistral AI's servers for processing. Mistral AI's privacy policy is
              available at{' '}
              <a
                href="https://mistral.ai/terms/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 underline hover:text-amber-500"
              >
                mistral.ai/terms/privacy
              </a>
              . We pass only your conversation messages and your dog's recent health-tracking context
              (from the relevant modules) to generate responses; we do not send your email address or
              payment information to Mistral AI. Mistral AI does not use API request data to train its
              models by default.
            </p>

            <h3 className="font-semibold text-stone-700 mt-4 mb-1">Vercel</h3>
            <p>
              The App is hosted on Vercel. Standard access logs may be retained by Vercel. See{' '}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 underline hover:text-amber-500"
              >
                Vercel's privacy policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">
              6. Your Rights (GDPR / CCPA)
            </h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>
                <strong>Access:</strong> Request a copy of the personal data we hold about you.
              </li>
              <li>
                <strong>Correction:</strong> Ask us to correct inaccurate or incomplete data.
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your personal data ("right to be
                forgotten"). You can initiate this by deleting your account in Settings.
              </li>
              <li>
                <strong>Portability:</strong> Request your data in a machine-readable format.
              </li>
              <li>
                <strong>Objection / Restriction:</strong> Object to or restrict how we process your
                data in certain circumstances.
              </li>
              <li>
                <strong>Opt-Out of Sale (CCPA):</strong> We do not sell personal data, so there is
                nothing to opt out of.
              </li>
              <li>
                <strong>Non-Discrimination (CCPA):</strong> Exercising your privacy rights will not
                result in denial of service or different pricing.
              </li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, email us at{' '}
              <a
                href="mailto:privacy@frenchieskintracker.com"
                className="text-amber-700 underline hover:text-amber-500"
              >
                privacy@frenchieskintracker.com
              </a>
              . We will respond within 30 days (or as required by applicable law).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">7. Data Retention</h2>
            <p>
              We retain your personal data for as long as your account is active. If you delete your
              account, we will delete or anonymize your data within 30 days, except where we are required
              by law to retain it (e.g., billing records retained for tax purposes for 7 years).
            </p>
            <p className="mt-2">
              AI chat message history is retained to provide context-aware responses. You can clear your
              chat history at any time from within the App.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">8. Children's Privacy</h2>
            <p>
              The App is not directed at children under the age of 13 (or 16 in the EU). We do not
              knowingly collect personal information from children. If we become aware that a child has
              provided personal information without parental consent, we will delete that information
              promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">9. Cookies and Tracking</h2>
            <p>
              The App uses session cookies necessary for authentication. We do not use third-party
              tracking cookies or advertising pixels. Analytics, if used in the future, will be disclosed
              in an updated version of this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">10. International Transfers</h2>
            <p>
              If you are located in the European Economic Area (EEA), your data may be transferred to and
              processed in the United States. Such transfers are made under appropriate safeguards
              (Standard Contractual Clauses or equivalent mechanisms) where required by GDPR.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant
              changes via email or in-app notice and update the "last updated" date above. Continued use
              of the App after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mb-3">12. Contact Us</h2>
            <p>
              For privacy-related questions, requests, or complaints, contact us at:
            </p>
            <div className="mt-2 bg-amber-100 rounded-lg p-4 text-stone-700">
              <p>
                <strong>Frenchie Health Companion</strong>
                <br />
                Email:{' '}
                <a
                  href="mailto:privacy@frenchieskintracker.com"
                  className="text-amber-700 underline hover:text-amber-500"
                >
                  privacy@frenchieskintracker.com
                </a>
              </p>
            </div>
            <p className="mt-3">
              If you are located in the EU and believe we have not adequately addressed your complaint,
              you have the right to lodge a complaint with your local data protection authority.
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
