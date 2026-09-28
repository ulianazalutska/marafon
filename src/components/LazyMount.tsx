"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Renders nothing (both on the server and on the client's first paint) until
// its wrapper div is within `rootMargin` of the viewport — at which point it
// mounts `children` for good (IntersectionObserver disconnects after the
// first hit, no need to track further). Since `visible` starts false on
// both server and client, the very first client render matches the SSR
// output exactly — no hydration mismatch — and because React never
// reconciles `children` into the tree before that, a below-fold section
// wrapped in this never triggers its `next/dynamic` import() (and the
// network fetch that comes with it) until it's actually about to be
// scrolled into view.
//
// Trade-off (accepted deliberately, see the LCP work this came out of): the
// wrapped section's content isn't in the initial server HTML at all, so a
// crawler that doesn't execute JS won't see it. Google does execute JS, and
// this site's SEO score was already 100 with nothing riding on that content
// being present pre-hydration.
export default function LazyMount({
  children,
  rootMargin = "800px 0px",
}: {
  children: ReactNode;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  // minHeight: 1px — a 0×0 element is an unreliable IntersectionObserver
  // target (Chrome measured found it never fires for a genuinely empty
  // rect), so the wrapper needs *some* area even while empty.
  return (
    <div ref={ref} style={{ minHeight: visible ? undefined : 1 }}>
      {visible ? children : null}
    </div>
  );
}
