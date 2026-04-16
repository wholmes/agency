"use client";

import { useEffect, useRef } from "react";
import { marked } from "marked";

interface Props {
  body: string;
}

export default function ArticleBody({ body }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const html = (() => {
    try {
      const result = marked.parse(body, { async: false });
      return typeof result === "string" ? result : "";
    } catch {
      return body;
    }
  })();

  return (
    <div
      ref={ref}
      className="blog-prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
