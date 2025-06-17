import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server';

jest.mock('../services/weatherService', () => ({
    getWeatherForLocation: jest.fn(),
}));

import { getWeatherForLocation } from '../services/weatherService';

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

beforeEach(() => {
    jest.clearAllMocks();
});

describe('GET /weather', () => {
    it('should return weather data for valid location', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        (getWeatherForLocation as jest.Mock).mockResolvedValue({
            temperature: 28,
            windSpeed: 12,
            precipitation: 0,
        });

        const res = await request(app).get('/weather').query({ location: 'Tel Aviv' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({
            location: 'Tel Aviv',
            temperature: 28,
            windSpeed: 12,
            precipitation: 0,
        });
    });

    it('should return 400 if location is missing', async () => {
        const res = await request(app).get('/weather');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/Missing location/);
    });

    it('should return 500 if getWeatherForLocation throws', async () => {
        (getWeatherForLocation as jest.Mock).mockImplementation(() => {
            throw new Error('Invalid location: "abcdef"');
        });

        const res = await request(app).get('/weather').query({ location: 'abcdef' });

        expect(res.statusCode).toBe(500);
        expect(res.body.error).toMatch(/Failed to fetch weather/);
    });
});
