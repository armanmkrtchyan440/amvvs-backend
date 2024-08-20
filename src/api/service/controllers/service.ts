/**
 * service controller
 */

import { factories } from "@strapi/strapi";
import { errors } from "@strapi/utils";

const { NotFoundError } = errors;

export default factories.createCoreController(
  "api::service.service",
  ({ strapi }) => ({
    async findOne(ctx) {
      const { id } = ctx.params;

      const entity = await strapi.service("api::service.service").find({
        ...ctx.query,
        filters: {
          slug: {
            $eq: id,
          },
        },
        populate: ["img", "localizations"],
      });

      const { results }: any = await this.sanitizeOutput(entity, ctx);

      const result = results[0];

      return this.transformResponse(result);
    },
  })
);
