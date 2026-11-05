import { FC, ReactNode } from "react";
import type { Node, RichTextDocument } from "@/shared/types";
import { cn } from "@/shared/lib/cn";
import { readingClasses } from "./reading-classes";

// Same rule as the editor: other people's text keeps only web and mail links
const SAFE_LINK = /^(https?:\/\/|mailto:)/i;

const withMarks = (node: Node): ReactNode =>
  (node.marks ?? []).reduce<ReactNode>((inner, mark) => {
    switch (mark.type as string) {
      case "bold":
        return <strong>{inner}</strong>;
      case "italic":
        return <em>{inner}</em>;
      case "underline":
        return <u>{inner}</u>;
      case "strike":
        return <s>{inner}</s>;
      case "code":
        return <code>{inner}</code>;
      case "highlight":
        return <mark>{inner}</mark>;
      case "link": {
        const href = String(mark.attrs?.href ?? "");
        return SAFE_LINK.test(href.trim()) ? (
          <a href={href} target="_blank" rel="noopener noreferrer nofollow">
            {inner}
          </a>
        ) : (
          inner
        );
      }
      default:
        return inner;
    }
  }, node.text);

const children = (node: Node) => node.content?.map((child, index) => <NodeView key={index} node={child} />);

const NodeView: FC<{ node: Node }> = ({ node }) => {
  switch (node.type) {
    case "text":
      return <>{withMarks(node)}</>;
    case "paragraph":
      return <p>{children(node)}</p>;
    case "heading": {
      const Heading = `h${Math.min(Math.max(Number(node.attrs?.level) || 2, 1), 6)}` as "h2";
      return <Heading>{children(node)}</Heading>;
    }
    case "bulletList":
      return <ul>{children(node)}</ul>;
    case "orderedList":
      return <ol start={Number(node.attrs?.start) || undefined}>{children(node)}</ol>;
    case "listItem":
      return <li>{children(node)}</li>;
    case "blockquote":
      return <blockquote>{children(node)}</blockquote>;
    case "codeBlock":
      return (
        <pre>
          <code>{children(node)}</code>
        </pre>
      );
    case "horizontalRule":
      return <hr />;
    case "hardBreak":
      return <br />;
    case "image":
      return (
        // eslint-disable-next-line @next/next/no-img-element -- addresses come from users, any host
        <img src={String(node.attrs?.src ?? "")} alt={String(node.attrs?.alt ?? "")} loading="lazy" />
      );
    default:
      return <>{children(node)}</>;
  }
};

// The look of RichTextViewer without an editor behind it: it renders on the server, so search
// engines and slow connections get the words in the first HTML
export const RichTextStatic: FC<{ content: RichTextDocument; className?: string }> = ({ content, className }) => (
  <div className={cn(readingClasses, className)}>
    {content.content?.map((node, index) => <NodeView key={index} node={node} />)}
  </div>
);
