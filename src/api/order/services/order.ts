/**
 * order service
 */

import { factories } from "@strapi/strapi";

import midtransClient from "midtrans-client";

export default factories.createCoreService(
  "api::order.order",
  ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;
      const { body } = ctx.request;

      let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
      });

      const newOrder = await strapi.entityService.create("api::order.order", {
        data: {
          firstName: body.data.firstName,
          lastName: body.data.lastName,
          address: body.data.address,
          city: body.data.city,
          state: body.data.state,
          zip: body.data.zip,
          email: body.data.email,
          phone: body.data.phone,
          totalOrderAmount: body.data.totalOrderAmount,
          userId: user.id,
          orderItemList: body.data.orderItemList,
        },
      });

      const parameter = {
        transaction_details: {
          order_id: newOrder.id,
          gross_amount: newOrder.totalOrderAmount,
        },
        customer_details: {
          first_name: newOrder.firstName,
          last_name: newOrder.lastName,
          email: newOrder.email,
          phone: newOrder.phone,
        },
        shipping_address: {
          first_name: newOrder.firstName,
          last_name: newOrder.lastName,
          email: newOrder.email,
          phone: newOrder.phone,
          address: newOrder.address,
          city: newOrder.city,
          postal_code: newOrder.zip,
          country_code: "IDN",
        },
        item_details: body.data.orderItemList.map((item) => ({
          id: item.product,
          price: item.price,
          quantity: item.quantity,
          name: item.productName,
        })),
      };

      const transactionToken = await snap.createTransaction(parameter);

      const newPayment = await strapi.entityService.create(
        "api::payment.payment",
        {
          data: {
            order: newOrder.id,
            token: transactionToken.token,
            redirect_url: transactionToken.redirect_url,
          },
        }
      );

      await strapi.db.query("api::user-cart.user-cart").deleteMany({
        where: {
          $and: [
            {
              userId: user.id,
            },
            {
              productId: body.data.orderItemList.map((item) => item.product),
            },
          ],
        },
      });

      const result = {
        orderId: newOrder.id,
        ...newPayment,
      };

      return result;
    },
  })
);
