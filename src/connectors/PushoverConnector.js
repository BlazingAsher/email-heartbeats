import axios from "axios";

const pushoverApi = axios.create({
    "baseURL": "https://api.pushover.net/1/"
});

export async function sendPushoverMessage (app_token, user_token, message, title) {
    const requestData = {
        "token": app_token,
        "user": user_token,
        message
    };

    if (title) {
        requestData.title = title;
    }

    return pushoverApi.post(
        "messages.json",
        requestData
    );
}
