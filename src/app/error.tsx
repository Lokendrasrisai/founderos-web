"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/States";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error.digest ? `Render error (digest ${error.digest})` : "Render error");
  }, [error]);

  return (
    <div className="container-site py-[var(--space-section)]">
      <ErrorState
        action={
          <>
            <Button onClick={reset}>Try again</Button>
            <ButtonLink href="/" variant="secondary">
              Go to the homepage
            </ButtonLink>
          </>
        }
      />
    </div>
  );
}
