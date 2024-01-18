const { EmailClient } = require("@azure/communication-email");
const client = new EmailClient(`endpoint=https://workforce-azure.communication.azure.com/;accessKey=<Base64-Encoded-Key>`);

app.post('/send-email', async (req, res) => {
  
  const secretCode = req.body.data.secretCode
  const subject = req.body.data.subject
  const employee_number = req.body.data.employee_number
  const address = req.body.data.address
  const name = req.body.data.name
  
  const message = {
    senderAddress: address,
    content: {
      subject: subject,
      plainText: secretCode,
    },
    recipients: {
      to: [
        {
          address: employee_number,
          displayName: name,
        },
      ],
    },
  }
  
  const poller = await client.beginSend(message)
  const response = await poller.pollUntilDone()
  res.json(response)
})


