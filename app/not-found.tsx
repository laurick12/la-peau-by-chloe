import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container section center">
      <span className="eyebrow">404</span>
      <h1>This page melted away.</h1>
      <p className="muted">The page you’re looking for doesn’t exist.</p>
      <Link href="/shop" className="btn mt-lg">Shop all butters</Link>
    </div>
  );
}
