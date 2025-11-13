import logger from "../logger.js";

import express from "express";
import {simpleParser} from "mailparser";
import Busboy from "busboy";

import {processEmail, processHeartbeatContent} from "../services/emailProcessor.js";
import * as HeartbeatController from "../controllers/HeartbeatController.js";

var router = express.Router();

/* GET home page. */
router.get(
    "/",
    function (req, res) {
        return res.json({"message": "ok"});
    }
);

router.post(
    "/incoming-sendgrid",
    function (req, res) {
        if(!req.privileges.has("email:write")){
            return res.status(401).json({"message": "Unauthorized"});
        }

        const busboy = Busboy({"headers": req.headers});
        const startTime = new Date().getTime();

        busboy.on(
            "field",
            function (name, value) {
                if (name === "email") {
                    simpleParser(
                        value,
                        {
                            "skipTextToHtml": true,
                            "skipImageLinks": true,
                            "skipTextLinks": true
                        }
                    ).
                        then((mail) => {
                            processEmail(mail).then(() => {
                                const processingTime = new Date().getTime() - startTime;
                                logger.info(`Email processed in ${processingTime}ms`);
                            }).
                                catch((err) => {
                                    logger.error(
                                        "Error processing email from Sendgrid.",
                                        err
                                    );
                                });
                        }).
                        catch((err) => {
                            logger.error(
                                "Error parsing email from Sendgrid.",
                                err
                            );
                        });
                }
            }
        );

        busboy.on(
            "finish",
            function () {
                return res.json({"message": "ok"});
            }
        );

        req.pipe(busboy);
    }
);

router.post('/heartbeat/:email_name', async (req, res) => {
    if(!req.privileges.has("heartbeat:write")){
        return res.status(401).json({"message": "Unauthorized"});
    }

    try {
        const subject = (req.body && typeof req.body.subject !== "undefined") ? req.body.subject : "(no subject)";
        const body = req.body ? req.body.body : undefined;

        await processHeartbeatContent(
            req.params.email_name,
            "(unknown sender)",
            subject,
            body,
            req.params.email_name,
            true
        );
        return res.status(201).json({"message": "ok"});
    }
    catch (e) {
        if (e instanceof Error && e.message?.match(/Email name .* does not exist/)) {
            return res.status(404).json({"message": e.message});
        }

        logger.error(
            "Error recording web heartbeat.",
            e
        );
        return res.status(500).json({"message": "Internal Server Error"});
    }
})

export default router;
