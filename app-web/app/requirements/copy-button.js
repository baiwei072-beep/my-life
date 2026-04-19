"use client";

import { useState } from "react";

export default function CopyButton({ content }) {
  const [label, setLabel] = useState("复制 Markdown");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setLabel("已复制");
      window.setTimeout(() => setLabel("复制 Markdown"), 1800);
    } catch {
      setLabel("复制失败");
      window.setTimeout(() => setLabel("复制 Markdown"), 1800);
    }
  }

  return (
    <button className="button secondary" type="button" onClick={handleCopy}>
      {label}
    </button>
  );
}
