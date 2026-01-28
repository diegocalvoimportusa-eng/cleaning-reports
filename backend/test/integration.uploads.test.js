const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  // Ensure the app uses the in-memory DB
  process.env.MONGO_URI = uri;
  // Connect mongoose explicitly and then require the app
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  app = require('../src/app');
});

afterAll(async () => {
  // Cleanup uploads created during test
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    for (const f of files) {
      try { fs.unlinkSync(path.join(uploadsDir, f)); } catch (e) { /* ignore */ }
    }
  }

  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

test('POST /api/uploads accepts multipart file and attaches to inspection', async () => {
  const User = require('../src/models/user.model');
  const Building = require('../src/models/building.model');
  const Inspection = require('../src/models/inspection.model');
  const Upload = require('../src/models/upload.model');
  const jwt = require('jsonwebtoken');

  const user = await User.create({ name: 'Uploader', email: 'upload@example.com', passwordHash: 'hash', role: 'inspector' });
  const building = await Building.create({ name: 'B1' });
  const inspection = await Inspection.create({ buildingId: building._id, areaId: new mongoose.Types.ObjectId(), inspectorId: user._id, items: [] });

  const token = jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET || 'changeme', { expiresIn: '8h' });

  const res = await request(app)
    .post('/api/uploads')
    .set('Authorization', `Bearer ${token}`)
    .field('relatedType', 'inspection')
    .field('relatedId', inspection._id.toString())
    .attach('file', Buffer.from('test'), 'photo.jpg')
    .expect(201);

  expect(res.body).toBeDefined();

  const dbUpload = await Upload.findOne({ filename: 'photo.jpg' });
  expect(dbUpload).toBeDefined();
  expect(dbUpload.url).toMatch(/^\/uploads\//);

  const updatedInspection = await Inspection.findById(inspection._id);
  expect(updatedInspection.photos).toContain(dbUpload.url);
});
