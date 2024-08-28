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

      if (!Array.isArray(files)) {
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
            <h3>namn: ${service.name}</h3>
            <h3>pris: ${price} - ${rot && "(Efter ROT)"}</h3>
            <h3>mängd: ${service.quantity}</h3>
            <h3>totalt: ${price * service.quantity}</h3>
          </li>
        `;
        total += price * service.quantity;
      });

      await strapi
        .plugin("email")
        .service("email")
        .send({
          to: process.env.SMTP_USERNAME,
          subject: "Citat",
          text: "Nytt citat",
          html: `<div>
          <h2>Offertdata</h2>
          <div>
            <h3>Förnamn: ${firstName}</h3>
            <h3>Efternamn: ${lastName}</h3>
            <h3>E-postadress: <a href="mailto:${email}">${email}</a></h3>
            <h3>Telefon: <a href="tel:${phone}">${phone}</a></h3>
            <div>
              <h3>Tjänster</h3>
              <ul>
                ${servicesHtml}
              </ul>
              <div>
                <h3>Totalbelopp: ${total}</h3>
              </div>
            </div>
            <div>
              <h3>Meddelande</h3>
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
