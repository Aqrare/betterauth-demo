import { createAuthClient } from "better-auth/react";
import {
  twoFactorClient,
  adminClient,
  jwtClient,
  organizationClient,
  apiKeyClient,
} from "better-auth/client/plugins";
import { passkeyClient } from "@better-auth/passkey/client";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_AUTH_URL || "",
  plugins: [
    twoFactorClient(),
    passkeyClient(),
    jwtClient(),
    adminClient(),
    organizationClient(),
    apiKeyClient(),
  ],
});
