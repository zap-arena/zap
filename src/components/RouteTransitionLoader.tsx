import { useIsFetching } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

// The live contest workspace polls submissions/leaderboard in the background;
// waiting on those fetches would make the loader reappear during an active contest.
const EXCLUDED_ROUTE = /^\/contest\/[^/]+\/workspace/;

/** Shows the brand loading screen on first load, on every route change, and while
 *  that route's data is still being fetched. */
export default function RouteTransitionLoader() {
  const location = useLocation();
  const isFetching = useIsFetching();
  const [loading, setLoading] = useState(true);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setLoading(true);
  }, [location.pathname]);

  if (!loading) return null;

  const ready = EXCLUDED_ROUTE.test(location.pathname) || isFetching === 0;
  return (
    <LoadingScreen key={location.pathname} ready={ready} onDone={() => setLoading(false)} />
  );
}
