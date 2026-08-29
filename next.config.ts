import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  /**
   * i18n routing with the App Router.
   *
   * The App Router handles locale routing via the file-system rather than the
   * `i18n` config key (which is Pages Router-only). The locale is resolved by
   * `lib/i18n/index.ts → resolveLocale()`, which currently returns "en" and
   * will read from request headers / middleware when a second locale lands.
   *
   * To add a new locale later:
   *   1. Create lib/i18n/messages/<locale>.ts with the translated strings.
   *   2. Add the locale to the `Locale` union and `LOCALE_META` in lib/i18n/index.ts.
   *   3. Add a middleware.ts that reads Accept-Language (or a cookie) and
   *      sets the locale in a response header, then update `resolveLocale()`
   *      to read it. Optionally add an `app/[locale]/` segment for URL-based
   *      routing.
   *
   * See: https://nextjs.org/docs/app/building-your-application/routing/internationalization
   */
};

export default nextConfig;
