"use client";

import dynamic from "next/dynamic";

// The editor library loads only on pages that show rich text, and only in the browser
export const RichTextViewer = dynamic(() => import("./rich-text-viewer"), { ssr: false });
