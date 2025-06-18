import express from 'express';
import {
  createAlert,
  getAllAlerts,
  deleteAlertById,
  updateAlertById,
} from '../services/alertService';

const router = express.Router();

router.post('/', async (req, res) => {
  const { location, parameter, operator, threshold, description, email } = req.body;

  if (!location || !parameter || !operator || threshold === undefined) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  try {
    const alert = await createAlert({
      location,
      parameter,
      operator,
      threshold,
      description,
      email,
    });
    res.status(201).json({ message: 'Alert created', alert });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

router.get('/', async (_req, res) => {
  try {
    const alerts = await getAllAlerts();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await deleteAlertById(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Alert not found' });
      return;
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});

router.put('/:id', async (req, res) => {
  const { location, parameter, operator, threshold, description, email } = req.body;

  if (!location || !parameter || !operator || threshold === undefined) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const updated = await updateAlertById(req.params.id, {
      location,
      parameter,
      operator,
      threshold,
      description,
      email,
    });
    if (!updated) {
      res.status(404).json({ error: 'Alert not found' });
      return;
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update alert' });
  }
});

export default router;
