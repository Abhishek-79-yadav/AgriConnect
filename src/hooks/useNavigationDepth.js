import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Module-level (not component state) so it survives remounts and is
// readable from anywhere without prop drilling or context. It counts how
// many times the person has navigated forward within this app session —
// not the browser's real history length, which we can't reliably read
// across browsers/WebViews.
let forwardNavigations = 0;

export function consumeForwardNavigation() {
  if (forwardNavigations > 0) forwardNavigations -= 1;
}

export function hasInAppHistory() {
  return forwardNavigations > 0;
}

/** Call once near the app root so the counter stays in sync with routing. */
export function useTrackNavigationDepth() {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    forwardNavigations += 1;
  }, [location.pathname]);
}
