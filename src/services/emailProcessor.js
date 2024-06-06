export function processEmail(email) {
  // Process the email here
  const destination = email.to.value.address;
  const subject = email.subject;
  const text = email.text;

  console.log(`Destination: ${destination}`);
  console.log(`Subject: ${subject}`);
  console.log(`Text: ${text}`);
}