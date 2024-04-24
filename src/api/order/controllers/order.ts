/**
 * order controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async create(ctx) {
      const newOrder = await strapi.service("api::order.order").create(ctx);

      const sanitizedOrder = await this.sanitizeOutput(newOrder, ctx);

      ctx.body = sanitizedOrder;
    },
  })
);
