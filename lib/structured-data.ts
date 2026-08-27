import { SITE_DESCRIPTION, SITE_NAME, getSiteUrl } from "./site";

const ORGANIZATION_NAME = "FinesseStudioLab";
const ORGANIZATION_URL = "https://github.com/FinesseStudioLab";

export function getStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORGANIZATION_URL,
        name: ORGANIZATION_NAME,
        url: ORGANIZATION_URL,
      },
      {
        "@type": "SoftwareApplication",
        name: SITE_NAME,
        url: getSiteUrl().toString(),
        description: SITE_DESCRIPTION,
        publisher: { "@id": ORGANIZATION_URL },
      },
    ],
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
