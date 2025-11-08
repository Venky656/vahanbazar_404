import React, { useMemo } from "react";
import Layout from "@/components/layout/Layout";
import { vehicles } from "@/data/vehicles";

/** Bundle all images under src/assets/vehicles/** (brand-based folders) */
const bundled = import.meta.glob(
  "/src/assets/vehicles/**/*.{avif,webp,jpg,jpeg,png}",
  // Vite deprecation fix: use query/import instead of `as: 'url'`
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

/** Make a slug: "Royal Enfield" -> "royal-enfield" */
const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Public path helper for BASE_URL */
const toBase = (p?: string) => {
  if (!p) return "";
  const base = import.meta.env.BASE_URL || "/";
  const rel = p.startsWith("/") ? p.slice(1) : p;
  return `${base}${rel}`;
};

/** Pick first bundled image by trying:
 *  1) path contains /<vehicle.id>/
 *  2) path contains /vehicles/<brand-slug>/
 *  Sorts numerically so 1,2,3… wins.
 */
function resolveBundledFirst(veh: { id: string; brand: string }): string | "" {
  const idFrag = `/${slug(veh.id)}/`;
  const brandFrag = `/vehicles/${slug(veh.brand)}/`;

  // 1) try exact vehicle-id match anywhere in the path
  const idMatches = Object.keys(bundled).filter((p) => p.includes(idFrag));
  if (idMatches.length) {
    const first = idMatches.sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
    )[0];
    return bundled[first];
  }

  // 2) fallback: any image under the brand folder
  const brandMatches = Object.keys(bundled).filter((p) => p.includes(brandFrag));
  if (brandMatches.length) {
    const first = brandMatches.sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
    )[0];
    return bundled[first];
  }

  return "";
}

/** Final resolver: prefer bundled, else public path from vehicles[].images[0] */
function resolveFirstImage(veh: {
  id: string;
  brand: string;
  images?: string[];
}): string | "" {
  const fromBundled = resolveBundledFirst(veh);
  if (fromBundled) return fromBundled;

  const fromPublic = veh.images?.[0];
  return fromPublic ? toBase(fromPublic) : "";
}

const DealerLocatorPage: React.FC = () => {
  const cards = useMemo(
    () =>
      vehicles.map((v) => ({
        ...v,
        firstImage: resolveFirstImage(v),
      })),
    []
  );

  const handleShowroomClick = (brand: string) => {
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(
      `${brand} bike showroom`
    )}+near+me/`;
    window.open(mapsUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-inter font-bold text-3xl text-foreground mb-2">Find Dealers</h1>
          <p className="font-open-sans text-muted-foreground">
            Locate authorized showrooms and dealers near you
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((vehicle) => {
            const img = vehicle.firstImage;

            return (
              <div
                key={vehicle.id}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className="w-full h-56 sm:h-64 lg:h-48 overflow-hidden rounded-t-2xl bg-muted"
                  onClick={() => handleShowroomClick(vehicle.brand)}
                  role="button"
                  aria-label={`View nearby ${vehicle.brand} showrooms`}
                >
                  {img ? (
                    <img
                      src={img}
                      alt={`${vehicle.brand} ${vehicle.name}`}
                      className="w-full h-full object-cover cursor-pointer block"
                      loading="lazy"
                      onError={(e) => {
                        console.error("Image 404:", img);
                        e.currentTarget.replaceWith(
                          Object.assign(document.createElement("div"), {
                            className:
                              "flex h-full w-full items-center justify-center text-muted-foreground",
                            textContent: "No image",
                          })
                        );
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="font-inter text-lg font-semibold text-foreground">
                    {vehicle.brand} {vehicle.name}
                  </h2>

                  <p className="mt-2 text-sm text-foreground">
                    💸 <b>On-road:</b>{" "}
                    ₹{Number(vehicle.price?.onRoad || 0).toLocaleString("en-IN")}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground leading-6">
                    🛠 <b>Engine:</b> {vehicle.specifications?.engine}
                    <br />
                    ⛽ <b>Mileage:</b>{" "}
                    {vehicle.specifications?.mileage > 0
                      ? `${vehicle.specifications.mileage} km/l`
                      : "Electric"}
                  </p>

                  <button
                    onClick={() => handleShowroomClick(vehicle.brand)}
                    className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium !text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    🔍 View Nearby {vehicle.brand} Showrooms
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default DealerLocatorPage;
