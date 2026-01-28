import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { Polar } from "@polar-sh/sdk";

import { checkout, polar, portal, webhooks } from "@polar-sh/better-auth";
import { env } from '~/env';
import { db } from '~/server/db';

const polarClient = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: "production",
});

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
  },

   plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
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
          successUrl: "/dashboard",
          authenticatedUsersOnly: true,
        }),
        portal(),
        webhooks({
          secret: env.POLAR_WEBHOOK_SECRET,
          onOrderPaid: async (order) => {
            const externalCustomerId = order.data.customer.externalId;

            if (!externalCustomerId) {
              console.error("No external customer ID found.");
              throw new Error("No external customer id found.");
            }

            const productId = order.data.productId;

            let creditsToAdd = 0;

            switch (productId) {
              case "1f4845d1-6550-4163-9e86-814913d357ed":
                creditsToAdd = 50;
                break;
              case "10806cf4-e388-49b5-8c34-d22e01e943a3":
                creditsToAdd = 200;
                break;
              case "da30ecbb-73f5-4245-ae4a-8a6db24ff312":
                creditsToAdd = 400;
                break;
            }

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