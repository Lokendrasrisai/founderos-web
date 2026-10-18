import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";

/** Global MDX element mapping: responsive tables and safe external links. */
const components: MDXComponents = {
  table: (props: ComponentPropsWithoutRef<"table">) => (
    // The scroll container is focusable so keyboard users can scroll wide tables.
    <div className="table-scroll" tabIndex={0} role="region" aria-label="Table">
      <table {...props} />
    </div>
  ),
  a: ({ href = "", children, ...rest }: ComponentPropsWithoutRef<"a">) => {
    if (href.startsWith("/") || href.startsWith("#")) {
      return (
        <Link href={href} {...rest}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  },
};

export function useMDXComponents(): MDXComponents {
  return components;
}
