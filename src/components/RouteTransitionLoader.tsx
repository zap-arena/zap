"use client"

import { useIsFetching } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import LoadingScreen from "./LoadingScreen";

// The live contest workspace polls submissions/leaderboard in the background;
// waiting on those fetches would make the loader reappear during an active contest.
const EXCLUDED_ROUTE = /^\/contest\/[^/]+\/workspace/;

/** Shows the brand loading screen on first load, on every route change, and while
 *  that route's data is still being fetched. */
export default function RouteTransitionLoader() {
  const pathname = usePathname();
  const isFetching = useIsFetching();
  const [loading, setLoading] = useState(true);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setLoading(true);
  }, [pathname]);

  if (!loading) return null;

  const ready = EXCLUDED_ROUTE.test(pathname) || isFetching === 0;
  return (
    <LoadingScreen
      key={pathname}
      ready={ready}
      onDone={() => setLoading(false)}
    />
  );
}
