import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server';

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

describe('Alerts API', () => {
  const validAlert = {
    location: 'Tel Aviv',
    parameter: 'temperature',
    operator: '>',
    threshold: 30,
    description: 'Too hot!',
    email: 'test@example.com',
  };

  it('should create a new alert', async () => {
    const res = await request(app).post('/alerts').send(validAlert);

    expect(res.statusCode).toBe(201);
    expect(res.body.alert).toHaveProperty('_id');
    expect(res.body.alert.location).toBe('Tel Aviv');
  });

  it('should return error for missing fields', async () => {
    const res = await request(app).post('/alerts').send({
      location: 'Tel Aviv',
    });

    expect(res.statusCode).toBe(400);
  });

  it('should get all alerts', async () => {
    // add another alert first
    await request(app)
      .post('/alerts')
      .send({ ...validAlert, location: 'Haifa' });

    const res = await request(app).get('/alerts');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0]).toHaveProperty('location');
  });

  it('should delete an alert', async () => {
    // create alert
    const createRes = await request(app)
      .post('/alerts')
      .send({ ...validAlert, location: 'Jerusalem' });
    const id = createRes.body.alert._id;

    const deleteRes = await request(app).delete(`/alerts/${id}`);

    expect(deleteRes.statusCode).toBe(204);

    // verify deletion
    const getRes = await request(app).get('/alerts');
    const deleted = getRes.body.find((a: any) => a._id === id);
    expect(deleted).toBeUndefined();
  });

  it('should update an existing alert', async () => {
    const createRes = await request(app)
      .post('/alerts')
      .send({ ...validAlert, location: 'Eilat' });
    const id = createRes.body.alert._id;

    const updateRes = await request(app)
      .put(`/alerts/${id}`)
      .send({
        ...validAlert,
        location: 'Updated City',
      });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.location).toBe('Updated City');
  });

  it('should return 404 for deleting non-existent alert', async () => {
    const res = await request(app).delete('/alerts/648e2beae1a48f5c45b12345'); // fake ID
    expect(res.statusCode).toBe(404);
  });

  it('should return 404 for updating non-existent alert', async () => {
    const res = await request(app).put('/alerts/648e2beae1a48f5c45b12345').send(validAlert);
    expect(res.statusCode).toBe(404);
  });
});
