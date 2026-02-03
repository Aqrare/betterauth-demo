import { createAuthClient } from "better-auth/react";
import {
  twoFactorClient,
  adminClient,
  jwtClient,
  organizationClient,
} from "better-auth/client/plugins";
import { passkeyClient } from "@better-auth/passkey/client";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [twoFactorClient(), passkeyClient(), jwtClient(), adminClient(), organizationClient()],
});
