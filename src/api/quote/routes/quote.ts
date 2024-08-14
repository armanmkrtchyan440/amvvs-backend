export default {
  routes: [
    {
      method: "POST",
      path: "/quote",
      handler: "quote.createQuote",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
