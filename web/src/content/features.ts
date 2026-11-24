// §5 feature rows — 8, from README matrix + docs/SUPERPOWERS.md. No invented rows.

export type Feature = {
  name: string;
  body: string;
  state: "client-side" | "server-enforced";
};

export const features: Feature[] = [
  {
    name: "Login-gate bypass",
    body: "Spoofed 26.24.0 baked in at compile time. No config needed.",
    state: "client-side",
  },
  {
    name: "Device identity rotation",
    body: "A banned fingerprint becomes a new one. Rotate on ban.",
    state: "client-side",
  },
  {
    name: "Experiment override",
    body: "Rewrites the experiments claim in the session token before the client parses it.",
    state: "client-side",
  },
  {
    name: "Role and VIP spoof",
    body: "Unlimited role injected; VIP surfaces unlock.",
    state: "client-side",
  },
  {
    name: "Expiring media capture",
    body: "Saved to local storage before it expires.",
    state: "client-side",
  },
  {
    name: "Unlimited chat albums",
    body: "v2 endpoint with a local database fallback.",
    state: "client-side",
  },
  {
    name: "Always online",
    body: "Fragile: needs location, and the first run 401s until the token refreshes.",
    state: "client-side",
  },
  {
    name: "Geo tier bypass",
    body: "Honduras or Nigeria coordinates unlock free-account entitlements.",
    state: "client-side",
  },
];
