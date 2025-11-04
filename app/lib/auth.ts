import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/app/index";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      firstNames: {
        type: "string",
        required: true,
      },
      lastNames: {
        type: "string",
        required: true,
      },
      role: {
        type: "string",
        required: true,
        defaultValue: "doctor",
      },
      isActive: {
        type: "boolean",
        required: true,
        defaultValue: true,
      },
      phone: {
        type: "string",
        required: false,
      },
      speciality: {
        type: "string",
        required: false,
      },
      licenseNumber: {
        type: "string",
        required: false,
      },
      department: {
        type: "string",
        required: false,
      },
    },
  },
});
