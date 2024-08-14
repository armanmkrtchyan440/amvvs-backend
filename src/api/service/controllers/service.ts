import { factories } from "@strapi/strapi"

export default factories.createCoreController(
  "api::service.service",
  ({ strapi }) => ({
    async findOne(ctx) {
      try {
        const { id } = ctx.params;
        const { query } = ctx;

        // Initialize query filters if not present
        if (!query.filters) query.filters = {};

        // Add OR filter for id or slug
        query.filters = {
          ...query.filters,
          $or: [{ id: { $eq: id } }, { slug: { $eq: id } }],
        };

        // Fetch the entity based on the modified query
        const entity = await strapi.service("api::service.service").find(query);

        // Sanitize the output
        const { results }: any = await this.sanitizeOutput(entity, ctx);

        // Transform and return the response
        return this.transformResponse(results[0]);

      } catch (error) {
        // Log the error for debugging
        console.error("Error in findOne controller:", error);

        // Return a custom error message
        ctx.throw(500, "Internal Server Error");
      }
    },
  })
);
