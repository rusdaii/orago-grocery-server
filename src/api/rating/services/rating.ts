/**
 * rating service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::rating.rating",
  ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;
      const { body } = ctx.request;

      const product = await strapi.entityService.findOne(
        "api::product.product",
        body.data.product
      );

      if (!product) {
        return ctx.badRequest("Product not found");
      }

      const newRating = await strapi.entityService.create(
        "api::rating.rating",
        {
          data: {
            value: body.data.value,
            product: product.id,
            users_permissions_user: user.id,
          },
        }
      );

      const productRating = await strapi.entityService.findMany(
        "api::rating.rating",
        {
          filters: {
            product: {
              id: product.id,
            },
          },
        }
      );

      const sum = productRating.reduce(
        (acc, current) => acc + current.value,
        0
      );

      const averageRating = sum / productRating.length;

      await strapi.entityService.update("api::product.product", product.id, {
        data: {
          averageRating,
        },
      });

      return newRating;
    },
  })
);
