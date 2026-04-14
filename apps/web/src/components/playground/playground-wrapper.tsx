"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import GrainOverlay from "./grain-overlay";
import CustomCursor from "./custom-cursor";

const EXCLUDED_PREFIXES = ["/admin", "/auth"];

export default function PlaygroundWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isExcluded = EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (isExcluded) return;
    document.body.classList.add("playground-active");
    return () => {
      document.body.classList.remove("playground-active");
    };
  }, [isExcluded]);

  if (isExcluded) {
    return <>{children}</>;
  }

  return (
    <>
      <GrainOverlay />
      <CustomCursor />
      {children}
    </>
  );
}
