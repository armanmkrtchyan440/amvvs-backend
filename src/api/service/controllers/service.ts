/**
 * service controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::service.service",
  ({ strapi }) => ({
    async findOne(ctx) {
      const { id } = ctx.params;

      const entity = await strapi.service("api::service.service").find({
        where: { $or: [{ id }, { slug: id }] },
      });
      const { results }: any = await this.sanitizeOutput(entity, ctx);

      return this.transformResponse(results);
    },
  })
);
