import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { App as CapacitorApp } from "@capacitor/app";

import {
  consumeForwardNavigation,
  hasInAppHistory,
  useTrackNavigationDepth,
} from "../../hooks/useNavigationDepth";

/**
 * Makes the Android hardware/gesture back button behave like a normal app
 * instead of Capacitor's default (which exits the app the moment the
 * WebView's own history is empty — e.g. when the app opens straight to
 * Login with no prior in-app navigation):
 *  - If the person has navigated forward at least once this session, go
 *    back one step, same as the visible in-app back arrow.
 *  - Otherwise, if they're not on the home route, send them Home first
 *    (matching how most Android apps require one extra back-press before
 *    exiting from a deep screen).
 *  - Only exit the app when they're already on Home with no forward
 *    history — a real "nothing left to go back to" state.
 */
export default function BackButtonHandler() {
  useTrackNavigationDepth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const listenerPromise = CapacitorApp.addListener("backButton", () => {
      if (hasInAppHistory()) {
        consumeForwardNavigation();
        navigate(-1);
        return;
      }

      if (location.pathname !== "/") {
        navigate("/");
        return;
      }

      CapacitorApp.exitApp();
    });

    return () => {
      listenerPromise.then((listener) => listener.remove());
    };
    // Re-subscribe whenever the path changes so the closure above always
    // sees the latest location without needing a ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return null;
}
