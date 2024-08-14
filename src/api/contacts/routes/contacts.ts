export default {
  routes: [
    {
      method: "POST",
      path: "/contacts",
      handler: "contacts.applyContacts",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
