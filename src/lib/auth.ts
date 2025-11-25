import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../../generated/prisma/client";

const DATABASE_URL = import.meta.env.DATABASE_URL;
const BETTER_AUTH_SECRET = import.meta.env.BETTER_AUTH_SECRET;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

export const auth = betterAuth({
  secret: BETTER_AUTH_SECRET,
  advanced: {
    disableOriginCheck: process.env.NODE_ENV !== "production",
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      completedOnboarding: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
        returned: true,
      },
      onboardingStep: {
        type: "number",
        required: false,
        defaultValue: 0, // Changed from '' to 0 since it's a number
        input: false,
        returned: true,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
        returned: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ url, user, token }, request) => {
      console.log("=== PASSWORD RESET EMAIL ===");
      console.log("User:", user.email);
      console.log("Reset URL:", url);
      console.log("Token:", token);
      console.log("===========================");
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    expiresIn: 1000 * 60 * 60 * 24, // 24 hours
    autoSignInAfterVerification: false,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log("=== EMAIL VERIFICATION ===");
      console.log("User:", user.email);
      console.log("Verification URL:", url);
      console.log("Token:", token);
      console.log("==========================");
    },
  },
});
