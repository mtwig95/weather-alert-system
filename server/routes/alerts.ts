import express from 'express';
import { Alert } from '../models/Alert';

const router = express.Router();

router.post('/', async function (req, res) {
    const { location, parameter, operator, threshold, description } = req.body;

    if (!location || !parameter || !operator || threshold === undefined) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
    }

    try {
        const alert = new Alert({ location, parameter, operator, threshold, description });
        await alert.save();

        res.status(201).json({ message: 'Alert created', alert });
    return;
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create alert' });
    return;
    }
});

router.get('/', async function(req, res)  {
    try {
        const alerts = await Alert.find();
        res.json(alerts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch alerts' });
    }
});

router.delete('/:id', async function (req, res) {
    try {
        const deleted = await Alert.findByIdAndDelete(req.params.id);
        if (!deleted) {
            res.status(404).json({ error: 'Alert not found' });
            return;
        }

        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete alert' });
    }
});

export default router;
