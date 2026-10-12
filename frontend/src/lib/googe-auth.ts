import { googleClientId } from "../constants";

export const GOOGLE_REDIRECT_URI = `${window.location.origin}/auth/google/callback`;

export function startGoogleOAuth() {
  const state = crypto.randomUUID();
  sessionStorage.setItem("google_oauth_state", state);

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", googleClientId);
  authUrl.searchParams.set("redirect_uri", GOOGLE_REDIRECT_URI);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");

  authUrl.searchParams.set("prompt", "select_account");
  authUrl.searchParams.set("state", state);

  window.location.assign(authUrl.toString());
}
