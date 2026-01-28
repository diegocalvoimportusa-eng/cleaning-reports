require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 4000;

// Ensure uploads folder exists
const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.listen(PORT, () => {
  console.log(`Cleaning Reports backend listening on port ${PORT}`);
});

// Create demo users if none exist (for development)
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user.model');
(async function ensureDemoUsers() {
  try {
    // Wait for DB connection
    if (mongoose.connection.readyState !== 1) {
      mongoose.connection.once('open', async () => {
        const count = await User.countDocuments();
        if (count === 0) {
          const passwordHash = await bcrypt.hash('password123', 10);
          await User.insertMany([
            { name: 'Admin', email: 'admin@test.com', passwordHash, role: 'admin' },
            { name: 'Inspector John', email: 'inspector@test.com', passwordHash, role: 'inspector' },
            { name: 'Cleaner Mary', email: 'cleaner@test.com', passwordHash, role: 'cleaner' }
          ]);
          console.log('Demo users created: admin@test.com / inspector@test.com / cleaner@test.com (password123)');
        }
      });
    } else {
      const count = await User.countDocuments();
      if (count === 0) {
        const passwordHash = await bcrypt.hash('password123', 10);
        await User.insertMany([
          { name: 'Admin', email: 'admin@test.com', passwordHash, role: 'admin' },
          { name: 'Inspector John', email: 'inspector@test.com', passwordHash, role: 'inspector' },
          { name: 'Cleaner Mary', email: 'cleaner@test.com', passwordHash, role: 'cleaner' }
        ]);
        console.log('Demo users created: admin@test.com / inspector@test.com / cleaner@test.com (password123)');
      }
    }
  } catch (err) {
    console.error('Seeding users failed', err);
  }
})();
