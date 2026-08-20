/**
 * A live Google Map, no API key needed: the `output=embed` form of a normal
 * Maps search URL is the same thing "Share > Embed a map" gives you, and it
 * works from a plain iframe. This is deliberately the section's only
 * "visual": there is no photography of Tarakeswar in this repository, and a
 * real, interactive map is more useful to someone actually travelling than a
 * stock photo would be. See src/data/tarakeswar/core.ts for the query.
 */
export function MapEmbed({
  query,
  label,
  height = 260,
}: {
  query: string;
  label: string;
  height?: number;
}) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-tara-outline-variant bg-tara-surface-container">
      <iframe
        title={label}
        src={src}
        width="100%"
        height={height}
        style={{ border: 0, display: "block" }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="flex items-center justify-between gap-3 px-4 py-2.5">
        <span className="text-[12px] text-tara-on-surface-muted">{label}</span>
        <a
          href={directionsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 whitespace-nowrap text-[12px] font-semibold text-tara-secondary hover:underline"
        >
          Get directions
        </a>
      </div>
    </div>
  );
}
