/**
 * rating controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::rating.rating', ({ strapi }) => ({
  async create(ctx) {
    const newReview = await strapi.service('api::rating.rating').create(ctx);

    const sanitizedReview = await this.sanitizeOutput(newReview, ctx);

    ctx.body = sanitizedReview;
  }
}));
