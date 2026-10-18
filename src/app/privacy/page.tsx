import Link from "next/link";
import { copyrightHolder, entityStatement, site } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { getContactMode } from "@/lib/contact-config";
import { formatDate } from "@/lib/utilities";
import { PageIntro } from "@/components/sections/PageIntro";

export const metadata = pageMetadata({
  title: "Privacy",
  description: `How ${site.name} handles information about visitors.`,
  path: "/privacy",
});

/**
 * Privacy notice generated from the site's actual behaviour (contact mode is read from configuration).
 * If you add analytics, cookies, embeds or a new data flow, update this page and privacyLastUpdated.
 */
export default function PrivacyPage() {
  const mode = getContactMode();
  return (
    <>
      <PageIntro
        label="Privacy"
        title="Privacy notice."
        intro="This site collects as little as possible. Here is exactly what happens to information about you."
        crumbs={[{ label: "Privacy" }]}
      >
        <p className="mt-6 text-sm text-subtle">
          Last updated <time dateTime={site.privacyLastUpdated}>{formatDate(site.privacyLastUpdated)}</time>
        </p>
      </PageIntro>

      <div className="container-site pb-[var(--space-section)]">
        <div className="grid-editorial">
          <div aria-hidden className="hidden md:block" />
          <div className="prose-site">
            <h2>Who we are</h2>
            <p>
              This website is operated by{" "}
              {copyrightHolder().toLowerCase().startsWith("the ")
                ? "the " + copyrightHolder().slice(4)
                : copyrightHolder()}
              . {entityStatement()}
            </p>

            <h2>What this site does not do</h2>
            <ul>
              <li>No analytics, tracking pixels, or advertising.</li>
              <li>No cookies are set by this site.</li>
              <li>No third-party scripts, embeds, or font services — fonts are served from this site.</li>
              <li>No accounts, and no database of visitors.</li>
            </ul>

            <h2>Information processed when you visit</h2>
            <p>
              Like any website, the servers that deliver these pages receive technical information with each
              request, such as your IP address, browser user agent, the page requested, and the time. This is
              processed by the provider that hosts the site to deliver pages, keep the service secure, and
              diagnose faults, and is kept according to that provider&rsquo;s log retention.
            </p>

            <h2>Your theme preference</h2>
            <p>
              If you switch between light and dark mode, that choice is saved in your browser&rsquo;s local
              storage so it persists between visits. It never leaves your device. You can clear it by clearing
              site data in your browser.
            </p>

            <h2>When you contact us</h2>
            {mode.kind === "form" && (
              <>
                <p>
                  If you use the contact form, we receive the name, email address, optional organization,
                  subject, and message you enter. The message is sent once to the team&rsquo;s inbox through
                  our email delivery provider (Resend) and is not stored by this website.
                </p>
                <p>
                  To limit abuse, your IP address is held briefly in server memory to count recent
                  submissions; it is not written to storage. We use what you send only to reply to you, and we
                  don&rsquo;t share it or add you to any list.
                </p>
              </>
            )}
            {mode.kind === "mailto" && (
              <p>
                If you email us, we receive whatever your message contains, including your email address. We
                use it only to reply, and we don&rsquo;t share it or add you to any list.
              </p>
            )}
            {mode.kind === "unconfigured" && (
              <p>
                This site doesn&rsquo;t currently offer a contact form or a published address, so no contact
                information is collected through it.
              </p>
            )}

            <h2>Your choices</h2>
            <p>
              You can ask us what we hold about you from correspondence, or ask us to delete it, using the
              same channel you used to reach us
              {mode.kind !== "unconfigured" && (
                <>
                  {" "}
                  or via the <Link href="/contact">contact page</Link>
                </>
              )}
              .
            </p>

            <h2>Changes</h2>
            <p>
              If the way this site handles information changes — for example if analytics are ever added —
              this notice will be updated first, and the date at the top will change.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
