import { after, before, beforeEach, describe, it } from "node:test";
import { equal } from "node:assert";
import { createTransport } from "nodemailer";
import EMock from "./index.js";

describe("EMock", () => {
  const emock = new EMock();

  before(async () => {
    await emock.start();
  });

  after(async () => {
    await emock.stop();
  });

  it("should capture sent emails", async () => {
    const from = "sender@example.com";
    const to = "receiver@example.com";
    const subject = "Test";
    const text = "Hello world";

    const transporter = createTransport({
      host: "127.0.0.1",
      port: 2525,
      secure: false,
    });
    await transporter.sendMail({ from, to, subject, text });

    const emails = EMock.findByTo(to);
    equal(emails.length, 1);
    equal(emails[0]?.from?.text, from);
    equal(emails[0]?.subject, subject);
    equal(emails[0]?.text, text + "\n");
  });
});
