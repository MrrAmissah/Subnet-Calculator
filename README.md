# Subnet Calculator

A fast, client-side IPv4 subnet / CIDR calculator — enter an IP and prefix, get the network, broadcast, host range, masks, and a live binary breakdown.

**Live demo:**

![screenshot](./docs/screenshot.png)

## Features

- Network address, broadcast address, first and last usable host
- Subnet mask (dotted decimal) and wildcard mask
- Total addresses and usable host count
- IP class (A–E) + private/public detection (RFC 1918)
- Visual binary breakdown with network vs host bits colour-coded
- Correct handling of /31 (RFC 3021 point-to-point) and /32 (single host)
- Inline input validation with clear error messages
- Shareable URLs — input is encoded in the query string
- Copy-to-clipboard on every result field
- Mobile-first, responsive dark theme

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Vite](https://vite.dev) | Build tool & dev server |
| [React 19](https://react.dev) | UI framework |
| [TypeScript](https://typescriptlang.org) | Type safety |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling |
| [Vitest](https://vitest.dev) | Unit testing |

## Run locally

```bash
npm install
npm run dev        # development server → http://localhost:5173
npm run build      # production build
npm run preview    # preview the production build
```

## Tests

```bash
npm run test       # run unit tests (vitest)
```

All subnet math lives in `src/lib/subnet.ts` as pure functions.
Tests in `src/lib/subnet.test.ts` cover normal cases, edge cases (/0, /31, /32), boundary octets, private/public detection, and invalid input.

## License

MIT
