# Brand assets and destination verification

Checked 25 October 2026. Assets are stored locally in `public/icons/brands/`; there is no runtime hotlinking. Every included brand image was downloaded from its official website, its official asset CDN, or its official source repository. No Simple Icons or other community logo collection is used. Images retain their source shapes, proportions and colors. Raster files are official publisher assets, not traced replacements.

These marks identify linked tools and services; they do not imply endorsement. Copyright and trademarks remain with their respective owners. Download availability is not a blanket trademark license. Follow the linked brand guidance when reusing this site for a different purpose. Decorative images have empty alt text beside visible names. The site must use `object-fit: contain`, preserve intrinsic proportions and avoid filters that recolor brand marks.

| Local file | Exact official source | Attribution / usage reference |
| --- | --- | --- |
| java.png | https://www.java.com/jcom/images/java-logo.png | Oracle; official Java homepage's Duke mascot asset (not a newly drawn coffee-cup logo) |
| python.png | https://s3.dualstack.us-east-2.amazonaws.com/pythondotorg-assets/media/community/logos/python-logo-only.png | Python Software Foundation; linked by https://www.python.org/community/logos/ (permits the device without wordmark) |
| cpp.png | https://isocpp.org/assets/images/cpp_logo.png | Standard C++ Foundation; official website logo |
| typescript.png | https://www.typescriptlang.org/icons/icon-144x144.png | Microsoft; https://www.typescriptlang.org/branding/ |
| dart.svg | https://dart.dev/assets/img/logo/dart-192.svg | Google; https://dart.dev/brand |
| php.svg | https://www.php.net/images/logos/php-logo-white.svg | PHP project; https://www.php.net/download-logos.php |
| laravel.svg | https://raw.githubusercontent.com/laravel/art/master/laravel-logo.svg | Laravel; https://github.com/laravel/art |
| nextjs.svg | https://nextjs.org/_next/static/immutable/media/logo-next-dark.0jqrwuxq05oly.svg | Vercel; official website dark-background icon |
| flutter.png | https://flutter.dev/assets/favicon.26abda3864324ef4ac32dd0d3ce28907.png | Google; https://flutter.dev/brand |
| bootstrap.svg | https://getbootstrap.com/docs/6.0/assets/brand/bootstrap-logo.svg | Bootstrap team; https://getbootstrap.com/docs/5.3/about/brand/ |
| tailwind.png | https://tailwindcss.com/favicons/apple-touch-icon.png?v=4 | Tailwind Labs; official website touch icon |
| nativewind.svg | https://www.nativewind.dev/favicon.svg | NativeWind; official adaptive favicon (contains publisher-provided dark-scheme styling) |
| jquery.gif | https://brand.jquery.org/resources/jquery-mark-light.gif | OpenJS Foundation; https://brand.jquery.org/logos/ (official static GIF, kept unmodified) |
| mysql.png | https://www.mysql.com/common/logos/logo-mysql-170x115.png | Oracle; https://www.mysql.com/about/legal/logos.html |
| sqlite.svg | https://www.sqlite.org/images/sqlite370_banner.svg | SQLite authors; official website wordmark, retained in full |
| git.svg | https://git-scm.com/images/logos/downloads/Git-Icon-1788C.svg | Jason Long, CC BY 3.0; https://git-scm.com/downloads/logos and https://creativecommons.org/licenses/by/3.0/ |
| github.svg | https://github.githubassets.com/favicons/favicon-dark.svg | GitHub, Inc.; official white icon; https://brand.github.com/foundations/logo permits social buttons linking to GitHub profiles/projects |
| docker.png | https://www.docker.com/app/uploads/2024/02/cropped-docker-logo-favicon-192x192.png | Docker, Inc.; official website icon |
| laragon.svg | https://laragon.org/logo.svg | Laragon; official website logo |
| xampp.svg | https://www.apachefriends.org/images/xampp-logo-ac950edf.svg | Apache Friends; official website logo |
| nginx.svg | https://nginx.org/img/nginx_logo_dark.svg | F5; official website dark-background logo |
| postgresql.png | https://www.postgresql.org/media/img/about/press/elephant.png | PostgreSQL Global Development Group; https://www.postgresql.org/about/press/ |
| supabase.svg | https://supabase.com/brand-assets.zip — entry `brand-assets/supabase-logo-icon.svg` | Supabase; kit linked by https://supabase.com/brand-assets; unmodified icon |
| riverpod.svg | https://riverpod.dev/img/logo.svg | Riverpod project; official website logo |
| react-native.svg | https://reactnative.dev/img/header_logo.svg | Meta; official React Native website logo |
| serverpod.png | https://serverpod.dev/icons/favicon/apple-touch-icon@21194cf381907d0c7d24ab39e9b1daca585ca1f2.png | Serverpod; official website touch icon |
| astro.svg | https://astro.build/favicon.svg | Astro; official website icon, for footer credit only |
| linkedin.png | https://static.licdn.com/scds/common/u/images/logos/linkedin/logo-in-win8-tile-144_v1.png | LinkedIn; tile referenced by https://brand.linkedin.com/ |

## Honest text fallbacks

- **JavaScript:** no single official language logo. Use a text name tile; MDN is the documentation destination, not the language's brand owner. No MDN logo is substituted.
- **Dart Shelf:** its official package page does not provide a standalone package logo. Do not substitute the Dart or pub.dev logo.
- **Gemini API:** the official destination was verified, but a standalone API-specific downloadable asset was not verified. Use text rather than the Google AI for Developers or Gemini consumer-app mark.
- **WhatsApp Cloud API:** Meta's official documentation was verified, but an API-specific downloadable logo was not verified. Use text rather than a Facebook favicon or an invented API badge.
- **Sanctum / Blade / Swing:** these components use linked names and official documentation; no independent logos are claimed.
- **REKA:** exact product identity and official assets remain unknown; excluded from the toolkit.

## Link checks and limitations

All 30 specified toolkit destinations and the Astro credit returned HTTP 200. GitHub and the supplied GitHub profile returned HTTP 200. The supplied WhatsApp Cloud API URL redirects to `https://developers.facebook.com/documentation/business-messaging/whatsapp/about-the-platform`; the supplied destination remains the link registry value. Google AI for Developers redirected to a localized version. These are reachability checks, not endorsements of content or evidence of skill proficiency.

LinkedIn returned HTTP 999 (automated requests blocked). Keep the exact supplied profile URL; a human should verify it before launch. The `mailto:justin03joel@gmail.com` address is preserved from the supplied content; syntax can be checked, but mailbox ownership and delivery were not verified and no email was sent.

`docs/asset-verification.json` records response statuses, final destinations, exact asset sources and SHA-256 hashes. `node scripts/fetch-brand-assets.mjs` rechecks destinations; `node scripts/fetch-brand-assets.mjs --download` refreshes individual assets. Supabase is obtained separately from its official ZIP entry above. Website content, filenames and brand terms can change; review assets again when refreshing them.
