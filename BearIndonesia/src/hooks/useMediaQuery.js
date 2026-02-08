import { useEffect, useState } from "react";

export function useMediaQuery(query) {
  const getMatches = () => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return undefined;
    const media = window.matchMedia(query);
    const handler = () => setMatches(media.matches);
    handler();
    media.addEventListener?.("change", handler);
    return () => media.removeEventListener?.("change", handler);
  }, [query]);

  return matches;
}

