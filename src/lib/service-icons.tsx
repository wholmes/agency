import { IconAnalytics, IconBrand, IconCode, IconDesign } from "@/components/icons";

/** Renders the correct icon without creating component types during parent render (eslint static-components). */
export function ServiceIconGlyph({ iconKey, size = 22 }: { iconKey: string; size?: number }) {
  switch (iconKey) {
    case "design":
      return <IconDesign size={size} />;
    case "code":
      return <IconCode size={size} />;
    case "brand":
      return <IconBrand size={size} />;
    case "analytics":
      return <IconAnalytics size={size} />;
    default:
      return <IconDesign size={size} />;
  }
}

export function parseOutcomeList(raw: string): string[] {
  try {
    const v = JSON.parse(raw) as unknown;
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}
