import express from 'express';
import { MailService } from '../lib/utils/MailService';
import QuizResponse from '../interfaces/QuizResponse';
import { config } from "dotenv";

const router = express.Router();

config();

router.post<{}, QuizResponse>('/', async (req, res) => {
    // Call Google's API to get score
    const captchaResp = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GCAPTCHA}&response=${req.headers['captchatoken']}`
    );

    const rr = await captchaResp.json();

    // Extract result from the API response
    if (!rr.success) {
        res.json({
            success: false,
            message: 'bot'
        });
        return;
    }

    let html = `
        <p>
    `;

    req.body.forEach((qa: any) => {
        html += `
            <strong>${qa['label']}</strong><br />
            <span>&nbsp;&nbsp;${qa['answer']}</span><br />
        `;
    });

    html += `</p>`

    let template = await MailService.getEmailTemplate('QuizSubmission');
    template = template.replace("{INNER_HTML}", html);

    if (process.env.MAIL_USER && process.env.MAIL_RECEIVER) {
        try {
            await MailService.send({
                from: process.env.MAIL_USER,
                to: process.env.MAIL_RECEIVER,
                subject: "New Quiz Submission",
                html: template
            });

            res.json({
                success: true
            });
        } catch (error) {
            console.error(error);
            res.json({
                success: false
            });
        }
    } else {
        res.json({
            success: false,
            message: "Env not set."
        });
    }

});

export default router;
