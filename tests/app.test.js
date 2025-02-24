const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

describe('User Endpoints', () => {
    it('should login a user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'krutoiska777@gmail.com',
        password: '123456'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Вход выполнен успешно');
  });

  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'krutoiska777@gmail.com',
        password: '123456'
      });
  
    console.log('Login Response:', res.body);
  
    expect(res.statusCode).toEqual(200);
    token = res.body.token;
  
    console.log('Token after login:', token);
  });
  
  

  it('should generate a new API key for the user', async () => {
    console.log('Token before request:', token);
    
    const res = await request(app)
      .post('/api/users/generate-api-key')
      .set('Authorization', `Bearer ${token.trim()}`);
  
    console.log('API response:', res.body);
  
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'API key generated successfully');
    expect(res.body).toHaveProperty('apiKey');
  });
  
});

describe('Forecast Endpoints', () => {
  it('should get forecast for a city', async () => {
    const res = await request(app)
      .get('/api/forecast/Astana?apiKey=b9174a483eecfb4a06815d01a7729224af492b6c3ab6e269c062fd8d6013539b');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('city', 'Astana');
  });

  it('should return 401 for missing API key', async () => {
    const res = await request(app)
      .get('/api/forecast/Astana');
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'API key is missing');
  });
});

describe('Email Endpoints', () => {
  it('should send registration email', async () => {
    const res = await request(app)
      .post('/api/email/send-email')
      .send({
        email: 'testuser@example.com'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Email sent successfully');
  });
});

const sendEmail = async (req, res) => {
  const { email } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }
};

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

afterAll(async () => {
  await mongoose.connection.close();
});
