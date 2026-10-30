import { Icon } from "@/components/Icons";

const BADGES = [
  { icon: Icon.leaf, title: "100% Natural", text: "Plant-based, nothing synthetic" },
  { icon: Icon.feather, title: "Sensitive-Skin Friendly", text: "Gentle, low-scent formulas" },
  { icon: Icon.drop, title: "Clean Ingredients", text: "Every one you can pronounce" },
  { icon: Icon.hand, title: "Small Batch", text: "Hand-whipped in Charlotte, NC" },
  { icon: Icon.heart, title: "Cruelty-Free", text: "Never tested on animals" },
];

export function TrustBadges() {
  return (
    <section className="trust" aria-label="Why La Peau">
      <div className="container trust__grid">
        {BADGES.map(({ icon: I, title, text }) => (
          <div className="trust__item" key={title}>
            <I />
            <strong>{title}</strong>
            <span>{text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
