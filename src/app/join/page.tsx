import { joinCopy } from "@/content/copy";
import { pageMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/sections/PageIntro";
import { Callout } from "@/components/ui/States";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = pageMetadata({
  title: "Join",
  description: "Collaboration and future team interest — framed honestly.",
  path: "/join",
});

export default function JoinPage() {
  return (
    <>
      <PageIntro
        label={joinCopy.label}
        title={joinCopy.headline}
        intro={joinCopy.body}
        crumbs={[{ label: "Join" }]}
      />
      <div className="container-site pb-[var(--space-section)]">
        <div className="grid-editorial">
          <h2 className="type-label pt-1">Ways to get involved</h2>
          <div>
            <ul className="border-b border-line">
              {joinCopy.interests.map((i) => (
                <li
                  key={i.title}
                  className="grid gap-2 border-t border-line py-8 md:grid-cols-2 md:gap-[var(--gutter)]"
                >
                  <h3 className="type-h3">{i.title}</h3>
                  <p className="text-muted">{i.body}</p>
                </li>
              ))}
            </ul>
            <Callout className="mt-10">{joinCopy.note}</Callout>
            <ButtonLink href="/contact" size="lg" className="mt-10">
              Introduce yourself
            </ButtonLink>
          </div>
        </div>
      </div>
    </>
  );
}
