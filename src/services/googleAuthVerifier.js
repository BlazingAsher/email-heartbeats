import {OAuth2Client} from "google-auth-library";
import logger from "../logger.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const ALLOWED_DOMAIN = process.env.GOOGLE_ALLOWED_DOMAIN;

export async function verifyGoogleToken (token) {
    if (!token) {
        return null;
    }

    try {
        const ticket = await client.verifyIdToken({
            "idToken": token,
            "audience": process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        if (ALLOWED_DOMAIN && payload.hd !== ALLOWED_DOMAIN) {
            logger.warn("Google Auth failed: Domain mismatch. Expected " + ALLOWED_DOMAIN + ", got " + payload.hd);
            return null;
        }

        return {
            "uid": payload.sub,
            "email": payload.email,
            "name": payload.name,
            "picture": payload.picture,
            "domain": payload.hd
        };
    } catch (error) {
        // Token is invalid, expired, or malformed. 
        return null;
    }
}
