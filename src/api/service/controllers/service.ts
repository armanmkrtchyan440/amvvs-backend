/**
 * service controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::service.service",
  ({ strapi }) => ({
    async findOne(ctx) {
      const { id } = ctx.params;
      const { query } = ctx;
      if (!query.filters) query.filters = {};
      query.filters = {
        ...query.filters,
        $or: [{ id: { $eq: id } }, { slug: { $eq: id } }],
      };
      const entity = await strapi.service("api::service.service").find(query);
      const { results }: any = await this.sanitizeOutput(entity, ctx);

      return this.transformResponse(results[0]);
    },
  })
);
