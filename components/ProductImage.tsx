import Image, { type ImageProps } from "next/image";
import type { CSSProperties } from "react";

/**
 * Image wrapper.
 *
 * Pre-generated WebP files (and SVG placeholders) are served as plain
 * static files through a plain <img>: next/image does not accept a custom
 * srcSet, and sending these through the optimizer would re-transform them
 * on every cache miss — which was the slow first visit. The optimizer is
 * no longer used for photos. `fill` is translated to the same absolute
 * positioning next/image would apply, and `priority` becomes
 * fetchpriority="high".
 */
type Props = Omit<ImageProps, "unoptimized" | "srcSet"> & {
  srcSet?: string;
};

export function ProductImage(props: Props) {
  const src = typeof props.src === "string" ? props.src : "";
  const isStatic = src.endsWith(".svg") || src.endsWith(".webp");
  if (!isStatic) return <Image {...props} unoptimized={false} />;

  const { fill, priority, sizes, srcSet, style, ...rest } = props;
  const fillStyle: CSSProperties | undefined = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }
    : undefined;
  return (
    <img
      {...rest}
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      fetchPriority={priority ? "high" : undefined}
      style={{ ...fillStyle, ...style }}
    />
  );
}
