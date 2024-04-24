/**
 * address controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::address.address",
  ({ strapi }) => ({
    async create(ctx) {
      const newAddress = await strapi
        .service("api::address.address")
        .create(ctx);

      const sanitizedAddress = await this.sanitizeOutput(newAddress, ctx);

      ctx.body = sanitizedAddress;
    },
  })
);
