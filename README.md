# EMock

A simple mock SMTP server to capture emails during testing.

## Installation

```bash
npm install e-mockjs
```

## Usage

```js
import EMock from "e-mockjs";

const emock = new EMock();
await emock.start();

// Send test emails here using any SMTP client,
// for example, Nodemailer:
//
// import nodemailer from "nodemailer";
// const transporter = nodemailer.createTransport({
//   host: "localhost",
//   port: 2525,
//   secure: false
// });
// await transporter.sendMail({
//   from: "sender@example.com",
//   to: "recipient@example.com",
//   subject: "Test Email",
//   text: "Hello from EMock!"
// });

// Retrieve emails that match a specific recipient:
const matchedEmails = EMock.findByTo("recipient@example.com");
console.log("Matched Emails:", matchedEmails);

await emock.stop();
```
