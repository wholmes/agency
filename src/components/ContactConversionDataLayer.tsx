"use client";

import { useEffect } from "react";
import {
  consumeStashedContactConversion,
  pushGenerateLeadDataLayer,
} from "@/lib/analytics-data-layer";

/** Fires once on `/contact/thank-you` after a successful v2 form submit (sessionStorage handoff). */
export default function ContactConversionDataLayer() {
  useEffect(() => {
    const payload = consumeStashedContactConversion();
    if (payload) pushGenerateLeadDataLayer(payload);
  }, []);
  return null;
}
