"use client";

import dynamic from "next/dynamic";
import type { ScopeEstimatorData } from "@/lib/cms/scope-estimator-types";

const ScopeEstimatorModal = dynamic(() => import("@/components/ScopeEstimatorModal"), {
  ssr: false,
});

export default function ScopeEstimatorModalDynamic({ data }: { data: ScopeEstimatorData }) {
  return <ScopeEstimatorModal data={data} />;
}
