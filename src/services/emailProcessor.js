import {getMatcher} from "./cachedMatcherProvider.js";
import {recordHeartbeat} from "../controllers/HeartbeatController.js";
import logger from "../logger.js";

export async function processEmail(email) {
  // Process the email here
  const destination = email.to.value.address;
  const from = email.from.value.address;
  const subject = email.subject;
  const body = email.text;

  console.log(`Destination: ${destination}`);
  console.log(`From: ${from}`);
  console.log(`Subject: ${subject}`);
  console.log(`Text: ${body}`);

  const email_name = destination.split('@')[0];
  const matcher = await getMatcher(email_name);

  if (!matcher) {
    logger.warn("No heartbeat found for email: " + email_name);
    return;
  }

  let matched = true;

  for (const from_matcher of matcher.from) {
    from_matcher.lastIndex = 0;
    if (from_matcher.test(from)) {
      matched = true;
      break;
    }
  }

  if (!matched) {
    for (const subject_matcher of matcher.subject) {
        subject_matcher.lastIndex = 0;
        if (subject_matcher.test(subject)) {
          matched = true;
          break;
        }
    }
  }

  if (!matched) {
    for (const body_matcher of matcher.body) {
        body_matcher.lastIndex = 0;
        if (body_matcher.test(body)) {
          matched = true;
          break;
        }
    }
  }

  if(matched) {
    await recordHeartbeat(email_name);
  }
  else {
    // send to pushover
  }

}