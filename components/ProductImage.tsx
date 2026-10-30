import Image, { type ImageProps } from "next/image";

/**
 * next/image wrapper that serves generated SVG placeholders unoptimized and
 * real photography (jpg/png/webp) through the Next.js image optimizer.
 */
export function ProductImage(props: Omit<ImageProps, "unoptimized">) {
  const src = typeof props.src === "string" ? props.src : "";
  const isSvg = src.endsWith(".svg");
  return <Image {...props} unoptimized={isSvg} />;
}
