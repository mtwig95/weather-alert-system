import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Alert } from '../models/Alert';
import { evaluateAlerts } from '../jobs/evaluateAlerts';

jest.mock('../services/weatherService', () => ({
    getWeatherForLocation: jest.fn(),
}));
jest.mock('../utils/sendEmail', () => ({
    sendEmail: jest.fn(),
}));

import { getWeatherForLocation } from '../services/weatherService';
import { sendEmail } from '../utils/sendEmail';

let mongo: MongoMemoryServer;

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
});

beforeEach(async () => {
    await Alert.deleteMany({});
    jest.clearAllMocks();
});

describe('evaluateAlerts', () => {
    it('should trigger alert when condition is met', async () => {
        const alert = await Alert.create({
            location: 'Tel Aviv',
            parameter: 'temperature',
            operator: '>',
            threshold: 25,
            description: 'Hot day!',
            email: 'test@example.com',
            status: 'not_triggered',
            lastChecked: null,
            lastNotified: null,
        });

        (getWeatherForLocation as jest.Mock).mockResolvedValue({
            temperature: 30,
            windSpeed: 5,
            precipitation: 0,
        });

        await evaluateAlerts();

        const updated = await Alert.findById(alert._id);

        expect(updated?.status).toBe('triggered');
        expect(updated?.lastChecked).not.toBeNull();
        expect(updated?.lastNotified).not.toBeNull();
        expect(sendEmail).toHaveBeenCalledTimes(1);
        const args = (sendEmail as jest.Mock).mock.calls[0];

        expect(args[0]).toBe('test@example.com');
        expect(args[1]).toContain('Tel Aviv');
        expect(args[2]).toContain('temperature');
        expect(args[2]).toContain('30');
    });

    it('should NOT trigger alert when condition is NOT met', async () => {
        await Alert.create({
            location: 'Tel Aviv',
            parameter: 'temperature',
            operator: '<',
            threshold: 15,
            description: 'Cold alert',
            email: 'test@example.com',
            status: 'not_triggered',
            lastChecked: null,
            lastNotified: null,
        });

        (getWeatherForLocation as jest.Mock).mockResolvedValue({
            temperature: 20,
            windSpeed: 2,
            precipitation: 0,
        });

        await evaluateAlerts();

        const alerts = await Alert.find();
        expect(alerts[0].status).toBe('not_triggered');
        expect(sendEmail).not.toHaveBeenCalled();
    });

    it('should not send email again if alert is already triggered', async () => {
        await Alert.create({
            location: 'Tel Aviv',
            parameter: 'temperature',
            operator: '>',
            threshold: 25,
            description: 'Hot day!',
            email: 'test@example.com',
            status: 'triggered',
            lastChecked: new Date(),
            lastNotified: new Date(),
        });

        (getWeatherForLocation as jest.Mock).mockResolvedValue({
            temperature: 30,
            windSpeed: 3,
            precipitation: 0,
        });

        await evaluateAlerts();

        expect(sendEmail).not.toHaveBeenCalled();
    });

    it('should trigger alert when condition is "<" and value is low enough', async () => {
        const alert = await Alert.create({
            location: 'Jerusalem',
            parameter: 'windSpeed',
            operator: '<',
            threshold: 10,
            description: 'No wind!',
            email: 'lowwind@example.com',
            status: 'not_triggered',
            lastChecked: null,
            lastNotified: null,
        });

        (getWeatherForLocation as jest.Mock).mockResolvedValue({
            temperature: 20,
            windSpeed: 5,
            precipitation: 0,
        });

        await evaluateAlerts();

        const updated = await Alert.findById(alert._id);
        expect(updated?.status).toBe('triggered');
        expect(sendEmail).toHaveBeenCalledWith(
            'lowwind@example.com',
            expect.any(String),
            expect.stringContaining('windSpeed')
        );
    });
});
