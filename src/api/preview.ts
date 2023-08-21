import express from 'express';
import { FirebaseAdmin } from '../lib/firebase_admin';
import Spider from '../lib/spider';

const router = express.Router();

router.get<{}, any>('/', async (req, res) => {
    try {
        await FirebaseAdmin.verifyReq(req);

        const spider = new Spider({
            url: req.query['url']?.toString() || ""
        });

        const html = await spider.getPreview();
        await spider.close();

        res.status(200).json({ html });
    } catch (error: any) {
        console.error(error);
        res.status(500).json(error.errorInfo || { msg: "error" });
    }
});

export default router;
