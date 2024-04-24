/**
 * address service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::address.address",
  ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;
      const { body } = ctx.request;
      const addressId = body.addressId;

      const payload = {
        firstName: body.firstName,
        lastName: body.lastName,
        address: body.address,
        city: body.city,
        state: body.state,
        zip: body.zip,
        email: body.email,
        phone: body.phone,
        userId: user.id,
      };

      if (addressId) {
        const updatedAddress = await strapi.entityService.update(
          "api::address.address",
          addressId,
          {
            data: {
              ...payload,
            },
          }
        );

        return updatedAddress;
      }

      const newAddress = await strapi.entityService.create(
        "api::address.address",
        {
          data: {
            ...payload,
          },
        }
      );

      return newAddress;
    },
  })
);
