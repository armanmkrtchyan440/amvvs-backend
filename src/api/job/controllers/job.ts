/**
 * job controller
 */

interface ApplyJobBody {
  name: string;
  email: string;
  phone: string;
  message: string;
}

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::job.job", ({ strapi }) => ({
  async applyJob(ctx) {
    const { name, email, phone, message } = ctx.request.body as ApplyJobBody;
    const resume = ctx.request.files.resume;

    await strapi
      .plugin("email")
      .service("email")
      .send({
        to: "armanmkrtchyan440@gmail.com",
        subject: "Job",
        text: "Job",
        html: `<div>
          <h2>Job Data</h2>
          <div>
            <h3>Name: ${name}</h3>
            <h3>Email: <a href="mailto:${email}">${email}</a></h3>
            <h3>Phone: <a href="tel:${phone}">${phone}</a></h3>
            <div>
              <h3>Cover Letter</h3>
              <p>${message}</p>
            </div>
          </div>
        </div>`,
        attachments: [
          {
            filename: resume.name,
            contentType: resume.type,
            path: resume.path,
          },
        ],
      });

    ctx.body = ctx;
  },
}));
