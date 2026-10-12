// NOTE: never put a client secret here. This file ships to the browser in the
// built bundle, so anything in it is public. The code-for-token exchange is
// done server-side in backend/src/modules/auth-module/auth.service.ts, which
// reads the secret from process.env.GOOGLE_CLIENT_SECRET.
export const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ??
  "80676076372-97piq9976tgq2si6ev0126q435cvaagg.apps.googleusercontent.com";
