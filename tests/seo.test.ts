import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import robots from "../app/robots";
import sitemap from "../app/sitemap";
import { publicRoutes } from "../lib/site-map";
import { getStructuredData, serializeJsonLd } from "../lib/structured-data";

const originalEnvironment = {
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  VERCEL_URL: process.env.VERCEL_URL,
};

function setEnvironment(values: Partial<typeof process.env>): void {
  for (const [name, value] of Object.entries(values)) {
    if (value === undefined) {
      delete process.env[name];
    } else {
      process.env[name] = value;
    }
  }
}

test.afterEach(() => setEnvironment(originalEnvironment));

test("sitemap contains every public route as an absolute, deterministic URL", () => {
  setEnvironment({
    VERCEL_PROJECT_PRODUCTION_URL: "modeltrace.example",
    VERCEL_URL: undefined,
  });

  const firstResult = sitemap();

  assert.deepEqual(firstResult, sitemap());
  assert.deepEqual(
    firstResult.map(({ url }) => url),
    publicRoutes.map(({ path: routePath }) =>
      new URL(routePath, "https://modeltrace.example").toString(),
    ),
  );
  assert.ok(firstResult.every(({ url }) => URL.canParse(url)));
});

test("robots allows production and references the absolute sitemap URL", () => {
  setEnvironment({
    VERCEL_ENV: "production",
    VERCEL_PROJECT_PRODUCTION_URL: "modeltrace.example",
  });

  assert.deepEqual(robots(), {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://modeltrace.example/sitemap.xml",
  });
});

test("robots blocks preview deployments and does not advertise a sitemap", () => {
  setEnvironment({
    VERCEL_ENV: "preview",
    VERCEL_PROJECT_PRODUCTION_URL: "modeltrace.example",
  });

  assert.deepEqual(robots(), {
    rules: { userAgent: "*", disallow: "/" },
  });
});

test("robots does not treat local development as preview", () => {
  setEnvironment({
    VERCEL_ENV: undefined,
    VERCEL_PROJECT_PRODUCTION_URL: undefined,
    VERCEL_URL: undefined,
  });

  assert.deepEqual(robots(), {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "http://localhost:3000/sitemap.xml",
  });
});

test("structured data contains Organization and SoftwareApplication", () => {
  setEnvironment({ VERCEL_PROJECT_PRODUCTION_URL: "modeltrace.example" });

  const structuredData = getStructuredData();
  const types = structuredData["@graph"].map((entry) => entry["@type"]);

  assert.deepEqual(types, ["Organization", "SoftwareApplication"]);
  assert.equal(structuredData["@graph"][1].url, "https://modeltrace.example/");
  assert.equal(serializeJsonLd({ value: "</script>" }).includes("<"), false);
});

test("every public route has a unique description wired to its page", () => {
  const descriptions = new Set(publicRoutes.map(({ description }) => description));

  assert.equal(descriptions.size, publicRoutes.length);

  for (const route of publicRoutes) {
    assert.ok(route.description.length > 0);

    const pagePath =
      route.path === "/" ? "app/page.tsx" : `app${route.path}/page.tsx`;
    const pageSource = readFileSync(path.join(process.cwd(), pagePath), "utf8");

    assert.match(pageSource, new RegExp(`getRouteDescription\\(\\"${route.path}\\"\\)`));
  }
});
