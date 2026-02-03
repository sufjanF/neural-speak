/**
 * @fileoverview Better Auth Server Configuration
 * @module lib/auth
 * 
 * @description
 * Server-side authentication configuration using Better Auth with Prisma adapter
 * and Polar.sh payment integration. Handles user authentication, session management,
 * and payment webhook processing for credit purchases.
 * 
 * @architecture
 * ```
 * ┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
 * │   Better Auth   │────▶│   Prisma Adapter │────▶│   PostgreSQL    │
 * │   (Sessions)    │     │   (User/Session) │     │   (Database)    │
 * └─────────────────┘     └──────────────────┘     └─────────────────┘
 *         │
 *         ▼
 * ┌─────────────────┐     ┌──────────────────┐
 * │   Polar.sh      │────▶│   Webhooks       │
 * │   (Payments)    │     │   (Credits)      │
 * └─────────────────┘     └──────────────────┘
 * ```
 * 
 * @requires better-auth - Core authentication library
 * @requires better-auth/adapters/prisma - Database adapter
 * @requires @polar-sh/sdk - Polar.sh SDK for payment processing
 * @requires @polar-sh/better-auth - Polar.sh Better Auth integration
 * 
 * @see {@link https://better-auth.com/docs|Better Auth Documentation}
 * @see {@link https://www.polar.sh/docs|Polar.sh Documentation}
 */
import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Polar } from "@polar-sh/sdk";
import { checkout, polar, portal, webhooks } from "@polar-sh/better-auth";
import { env } from '~/env';
import { db } from '~/server/db';

/**
 * Credit packages mapped to Polar.sh product IDs.
 * Defines how many credits each product tier provides.
 * 
 * @constant {Record<string, number>}
 */
const CREDIT_PACKAGES: Record<string, number> = {
  "1f4845d1-6550-4163-9e86-814913d357ed": 50,   // Small package
  "10806cf4-e388-49b5-8c34-d22e01e943a3": 200,  // Medium package
  "da30ecbb-73f5-4245-ae4a-8a6db24ff312": 400,  // Large package
};

/**
 * Polar.sh SDK client instance.
 * Configured for production environment with access token authentication.
 * 
 * @constant {Polar}
 */
const polarClient = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: "production",
});

/**
 * Prisma client instance for Better Auth adapter.
 * Separate from the application db client for isolation.
 * 
 * @constant {PrismaClient}
 */
const prisma = new PrismaClient();

/**
 * Configured Better Auth server instance.
 * 
 * Provides:
 * - Email/password authentication
 * - PostgreSQL session storage via Prisma
 * - Polar.sh payment integration
 * - Webhook handling for credit purchases
 * 
 * @constant {ReturnType<typeof betterAuth>}
 * 
 * @example
 * // Use in API route handlers
 * import { auth } from '~/lib/auth';
 * 
 * export const GET = auth.handler;
 * export const POST = auth.handler;
 */
export const auth = betterAuth({
  /**
   * Trusted origins for CORS and origin validation.
   * Required to allow requests from the frontend domain.
   */
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    process.env.BETTER_AUTH_URL ?? "",
  ].filter(Boolean),

  /**
   * Database configuration using Prisma adapter.
   * Stores users, sessions, and accounts in PostgreSQL.
   */
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  
  /**
   * Authentication methods configuration.
   * Currently supports email/password authentication.
   */
  emailAndPassword: {
    enabled: true,
  },

  /**
   * Authentication plugins extending core functionality.
   */
  plugins: [
    /**
     * Polar.sh payment integration plugin.
     * Handles checkout, customer portal, and webhooks.
     */
    polar({
      client: polarClient,
      /** Automatically create Polar customer on user signup */
      createCustomerOnSignUp: true,
      use: [
        /**
         * Checkout configuration for credit purchases.
         * Defines available products and redirect behavior.
         */
        checkout({
          products: [
            {
              productId: "1f4845d1-6550-4163-9e86-814913d357ed",
              slug: "small",
            },
            {
              productId: "10806cf4-e388-49b5-8c34-d22e01e943a3",
              slug: "medium",
            },
            {
              productId: "da30ecbb-73f5-4245-ae4a-8a6db24ff312",
              slug: "large",
            },
          ],
          /** Redirect to dashboard after successful purchase */
          successUrl: "/dashboard",
          /** Only authenticated users can purchase */
          authenticatedUsersOnly: true,
        }),
        
        /** Customer portal for subscription management */
        portal(),
        
        /**
         * Webhook handler for payment events.
         * Processes order completion and credits user account.
         */
        webhooks({
          secret: env.POLAR_WEBHOOK_SECRET,
          /**
           * Handler for successful order payments.
           * Credits the user's account based on purchased product.
           * 
           * @param {Object} order - Polar.sh order event data
           * @throws {Error} If customer external ID is missing
           */
          onOrderPaid: async (order) => {
            // Extract user ID from Polar customer's external reference
            const externalCustomerId = order.data.customer.externalId;

            if (!externalCustomerId) {
              console.error("No external customer ID found.");
              throw new Error("No external customer id found.");
            }

            const productId = order.data.productId;

            // Determine credits to add based on product purchased
            const creditsToAdd = productId ? CREDIT_PACKAGES[productId] ?? 0 : 0;

            // Atomically increment user's credit balance
            await db.user.update({
              where: { id: externalCustomerId },
              data: {
                credits: {
                  increment: creditsToAdd,
                },
              },
            });
          },
        }),
      ],
    }),
  ],
});