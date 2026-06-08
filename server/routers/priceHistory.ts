import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getPriceHistory } from "../db";

export const priceHistoryRouter = router({
  list: publicProcedure
    .input(
      z.object({
        giftcardId: z.number().int(),
        limit: z.number().int().optional().default(10),
      })
    )
    .query(async ({ input }) => {
      const history = await getPriceHistory(input.giftcardId, input.limit);
      return history.map((item) => ({
        ...item,
        sellDiscount: item.sellDiscount / 10,
        buyDiscount: item.buyDiscount / 10,
      }));
    }),
});
