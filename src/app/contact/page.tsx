import { Mail } from "lucide-react";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { getContactMode } from "@/lib/contact-config";
import { PageIntro } from "@/components/sections/PageIntro";
import { ContactForm } from "@/components/forms/ContactForm";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";

export const metadata = pageMetadata({
  title: "Contact",
  description: `Get in touch with the ${site.name} founding team.`,
  path: "/contact",
});

const topics = [
  "A difficult problem from your own work",
  "Research you'd like to compare notes on",
  "Collaboration on something specific",
  "Feedback on anything we've published",
];

/**
 * Contact. Shows exactly one of three truthful states:
 *  - form:         delivery is configured and the form really sends
 *  - mailto:       a real public address is configured
 *  - unconfigured: nothing is set up yet, and we say so
 */
export default function ContactPage() {
  const mode = getContactMode();
  return (
    <>
      <PageIntro
        label="Contact"
        title="Start a conversation."
        intro="We're interested in thoughtful conversations about difficult problems, emerging technology, and ambitious ideas."
        crumbs={[{ label: "Contact" }]}
      />
      <div className="container-site grid gap-14 pb-[var(--space-section)] lg:grid-cols-12 lg:gap-[var(--gutter)]">
        <aside className="lg:col-span-4" aria-labelledby="topics-title">
          <h2 id="topics-title" className="type-label">
            Good reasons to write
          </h2>
          <ul className="mt-5 space-y-3">
            {topics.map((t) => (
              <li key={t} className="flex gap-3 border-t border-line pt-3 text-muted">
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-subtle">
            We aren&rsquo;t hiring or selling services right now. {site.contact.responseNote ?? ""}
          </p>
        </aside>

        <div className="lg:col-span-7 lg:col-start-6">
          {mode.kind === "form" && <ContactForm />}

          {mode.kind === "mailto" && (
            <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-8 sm:p-10">
              <Mail aria-hidden className="size-6 text-accent" strokeWidth={1.75} />
              <h2 className="type-h3 mt-4">Email the team</h2>
              <p className="mt-2 max-w-[48ch] text-muted">
                Write to us directly. Your email client will open with our address filled in.
              </p>
              <p className="mt-6 text-lg break-all">{mode.email}</p>
              <ButtonLink href={`mailto:${mode.email}`} size="lg" className="mt-6">
                Write an email
              </ButtonLink>
            </div>
          )}

          {mode.kind === "unconfigured" && (
            <EmptyState title="Contact details haven't been published yet.">
              <p>
                The team hasn&rsquo;t set up a public contact address for this site, so there&rsquo;s no form
                here that could silently lose your message. If you already know one of the founders, reach
                them directly.
              </p>
            </EmptyState>
          )}
        </div>
      </div>
    </>
  );
}
