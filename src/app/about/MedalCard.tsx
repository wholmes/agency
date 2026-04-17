"use client";

import dynamic from "next/dynamic";

const TeamMedal = dynamic(() => import("@/components/TeamMedal"), { ssr: false });

export default function MedalCard() {
  return (
    <div className="relative flex h-[380px] items-center justify-center overflow-hidden bg-[linear-gradient(135deg,var(--color-surface-2)_0%,#1c1810_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(201,165,90,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(201,165,90,0.04)_1px,transparent_1px)] bg-size-[40px_40px]" />
      <div className="relative -mt-8">
        <TeamMedal
          width={300}
          height={420}
          topText="BRAND  •  MEETS  •  CODE"
          bottomText="EST.  2019"
        />
      </div>
    </div>
  );
}
