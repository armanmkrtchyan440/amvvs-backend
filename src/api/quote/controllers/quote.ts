/**
 * A set of functions called "actions" for `quote`
 */

interface IService {
  name: string;
  description: string;
  price: number;
  img: string;
  slug: string;
  quantity: number;
}

interface QuoteBody {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  services: string;
  message: string;
  rot: string;
}

function calculateRot(amount: number) {
  return Math.ceil(amount * 0.7);
}

export default {
  createQuote: async (ctx, next) => {
    try {
      const { firstName, lastName, email, phone, message } = ctx.request
        .body as QuoteBody;
      let files = ctx.request.files.files || [];

      if (files.length == 1) {
        files = [files];
      }

      const services = JSON.parse(ctx.request.body.services) as IService[];
      const rot = JSON.parse(ctx.request.body.rot) as boolean;

      const attachments = files.map((file) => {
        return { filename: file.name, contentType: file.type, path: file.path };
      }, []);

      let servicesHtml = "";
      let total = 0;

      services.forEach((service) => {
        const price = rot ? calculateRot(service.price) : service.price;
        servicesHtml += `
          <li>
            <h3>name: ${service.name}</h3>
            <h3>price: ${price} - ${rot && "(Efter ROT)"}</h3>
            <h3>quantity: ${service.quantity}</h3>
            <h3>total: ${price * service.quantity}</h3>
          </li>
        `;
        total += price * service.quantity;
      });

      await strapi
        .plugin("email")
        .service("email")
        .send({
          to: "armanmkrtchyan440@gmail.com",
          subject: "Hello world",
          text: "New Quote",
          html: `<div>
          <h2>Quote data</h2>
          <div>
            <h3>First name: ${firstName}</h3>
            <h3>Last name: ${lastName}</h3>
            <h3>Email: <a href="mailto:${email}">${email}</a></h3>
            <h3>Phone: <a href="tel:${phone}">${phone}</a></h3>
            <div>
              <h3>Services</h3>
              <ul>
                ${servicesHtml}
              </ul>
              <div>
                <h3>Subtotal: ${total}</h3>
              </div>
            </div>
            <div>
              <h3>Message</h3>
              <p>${message}</p>
            </div>
          </div>
        </div>`,
          attachments,
        });

      ctx.body = ctx;
    } catch (err) {
      console.log(err);

      ctx.badRequest("Post report controller error", { moreDetails: err });
    }
  },
};
