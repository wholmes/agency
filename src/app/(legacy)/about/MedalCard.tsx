"use client";

import dynamic from "next/dynamic";

const TeamMedal = dynamic(() => import("@/components/TeamMedal"), { ssr: false });

export default function MedalCard() {
  return (
    <TeamMedal
      width={280}
      height={390}
      topText="BRAND  •  MEETS  •  CODE"
      bottomText="EST.  2019"
    />
  );
}
