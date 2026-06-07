import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getAllGiftcards,
  createGiftcard,
  updateGiftcard,
  deleteGiftcard,
  reorderGiftcards,
  recordPriceChange,
  getPriceHistory,
} from "./db";
import { priceHistoryRouter } from "./routers/priceHistory";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  giftcards: router({
    list: publicProcedure.query(async () => {
      const items = await getAllGiftcards();
      return items.map((item) => ({
        ...item,
        available: item.available === 1,
        sellDiscount: item.sellDiscount / 10,
        buyDiscount: item.buyDiscount / 10,
      }));
    }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          category: z.string().min(1),
          sellPrice: z.number().int(),
          sellDiscount: z.number(),
          buyPrice: z.number().int(),
          buyDiscount: z.number(),
          note: z.string().optional(),
          available: z.boolean().default(true),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const created = await createGiftcard({
          name: input.name,
          category: input.category,
          sellPrice: input.sellPrice,
          sellDiscount: Math.round(input.sellDiscount * 10),
          buyPrice: input.buyPrice,
          buyDiscount: Math.round(input.buyDiscount * 10),
          note: input.note || null,
          available: input.available ? 1 : 0,
          displayOrder: 0,
        });

        if (!created) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }

        return {
          ...created,
          available: created.available === 1,
          sellDiscount: created.sellDiscount / 10,
          buyDiscount: created.buyDiscount / 10,
        };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number().int(),
          name: z.string().min(1).optional(),
          category: z.string().min(1).optional(),
          sellPrice: z.number().int().optional(),
          sellDiscount: z.number().optional(),
          buyPrice: z.number().int().optional(),
          buyDiscount: z.number().optional(),
          note: z.string().optional(),
          available: z.boolean().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const { id, ...data } = input;
        const updateData: Record<string, unknown> = {};

        if (data.name !== undefined) updateData.name = data.name;
        if (data.category !== undefined) updateData.category = data.category;
        if (data.sellPrice !== undefined) updateData.sellPrice = data.sellPrice;
        if (data.sellDiscount !== undefined)
          updateData.sellDiscount = Math.round(data.sellDiscount * 10);
        if (data.buyPrice !== undefined) updateData.buyPrice = data.buyPrice;
        if (data.buyDiscount !== undefined)
          updateData.buyDiscount = Math.round(data.buyDiscount * 10);
        if (data.note !== undefined) updateData.note = data.note || null;
        if (data.available !== undefined) updateData.available = data.available ? 1 : 0;

        const updated = await updateGiftcard(id, updateData);

        if (!updated) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        return {
          ...updated,
          available: updated.available === 1,
          sellDiscount: updated.sellDiscount / 10,
          buyDiscount: updated.buyDiscount / 10,
        };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number().int() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const success = await deleteGiftcard(input.id);
        if (!success) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        return { success: true };
      }),

    reorder: protectedProcedure
      .input(
        z.object({
          orders: z.array(
            z.object({
              id: z.number().int(),
              displayOrder: z.number().int(),
            })
          ),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const success = await reorderGiftcards(input.orders);
        if (!success) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }

        return { success: true };
      }),
  }),

  priceHistory: priceHistoryRouter,
});

export type AppRouter = typeof appRouter;
