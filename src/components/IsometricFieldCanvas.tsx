"use client";

import HeroFieldCanvas from "./HeroFieldCanvas";

/** Homepage hero — same full field as desktop; mobile layout shifts the layer right in `Hero`. */
export default function IsometricFieldCanvas() {
  return <HeroFieldCanvas variant="home" />;
}
