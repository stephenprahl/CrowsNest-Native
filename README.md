# CrowsNest Native 

A small mobile + server example project combining an Expo React Native client and a minimal Bun-based server. This repository contains a working client app built with Expo Router and a tiny server entry point in TypeScript.

**Project Structure**

- `client/`: Expo React Native app using `expo-router` and standard Expo toolchain.
- `server/`: Minimal TypeScript server (example uses Bun).
- `README.md`: This file.

**Prerequisites**

- Node.js (for general tooling). Either `npm`, `yarn`, or `pnpm` will work for the client.
- Expo CLI (optional) or use the `expo` commands shipped with the SDK.
- Bun (recommended for running the example `server/index.ts`) — see https://bun.sh for install instructions.

**Quick Start**

1. Install dependencies for both client and server:

```bash
# from repo root
cd client && npm install
cd ../server && npm install
```

2. Run the client (Expo):

```bash
# from repo root
cd client
npm start
```

You can also run `npm run android`, `npm run ios`, or `npm run web` from `client/` — these map to the scripts in `client/package.json` and use `expo start` under the hood.

3. Run the server (example uses Bun):

```bash
# from repo root
cd server
# run the TypeScript entry with Bun
bun index.ts
```

If you prefer Node.js, compile the TypeScript or use a runner like `ts-node` — the server here is intentionally minimal and mainly demonstrates structure.

**Notes**

- The client is an Expo project (see `client/app` and `client/app.json`). Main entry uses `expo-router/entry` as configured in `client/package.json`.
- The server currently contains a simple `index.ts` which prints a message when run with Bun. Expand this to add routes or business logic as needed.

**Contributing**

- Open an issue for design or feature requests.
- Create PRs against the `main` branch; keep changes small and focused.

**License**

This repository does not include a license file. Add a `LICENSE` if you want to specify reuse terms.

---

If you want, I can also:

- add a `server/package.json` `scripts` section (for `npm run dev` or `bun start`),
- add a short `CONTRIBUTING.md`, or
- scaffold a basic server route and example API used by the client.

