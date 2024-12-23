import { SMTPServer } from "smtp-server";
import { simpleParser, type ParsedMail } from "mailparser";

export default class EMock {
  static #emails: ParsedMail[] = [];
  #server;
  #port;

  /**
   * Creates an instance of the mock SMTP server.
   * @param [port=2525] - The port on which the SMTP server will listen.
   */
  constructor(port = 2525) {
    this.#port = port;
    this.#server = new SMTPServer({
      disabledCommands: ["AUTH", "STARTTLS"],
      onAuth(auth, session, callback) {
        callback(null);
      },
      onMailFrom(address, session, callback) {
        callback(null);
      },
      onData(stream, session, callback) {
        simpleParser(stream)
          .then((mail) => {
            EMock.#emails.push(mail);
            callback();
          })
          .catch((err) => {
            callback(err);
          });
      },
    });
  }

  /**
   * Starts the mock SMTP server on the specified port.
   */
  async start() {
    await new Promise<void>((resolve) => {
      this.#server.listen(this.#port, resolve);
    });
  }

  /**
   * Stops the mock SMTP server.
   */
  async stop() {
    await new Promise<void>((resolve) => {
      this.#server.close(resolve);
    });
  }

  /**
   * Finds emails where the recipient (`to`) contains the specified text.
   * @param address - The address to look for in the recipient.
   */
  static findByTo(address: string) {
    return this.#emails.filter((email) => {
      if (!email.to) {
        return false;
      }

      if (Array.isArray(email.to)) {
        return email.to.some((addr) => addr.text.includes(address));
      }

      return email.to.text.includes(address);
    });
  }
}
