const db = require('./src/config/db'); 
const User = require('./src/models/User')(db); 
const Person = require('./src/models/Person')(db);

async function runDatabaseTests() {
  console.log('🚀 Starting Database Layer Architecture Test...\n');

  try {
    // 1. TEST USER CREATION
    console.log('🧪 Test 1: Creating User A...');
    const userIdA = await new Promise((resolve, reject) => {
      User.create('user_alpha', 'secretPassword123', (err, id) => {
        if (err) reject(err);
        else resolve(id);
      });
    });
    console.log(`✅ User A created with ID: ${userIdA}`);

    // 2. TEST PASSWORD VERIFICATION
    console.log('\n🧪 Test 2: Verifying Password Matching Logic...');
    const userRow = await new Promise((resolve, reject) => {
      User.findByUsername('user_alpha', (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    const isMatch = await User.verifyPassword('secretPassword123', userRow.password);
    if (isMatch) {
      console.log('✅ Cryptographic verification functions match perfectly.');
    } else {
      throw new Error('Password verification logic failure!');
    }

    // 3. TEST PERSON CRUD
    console.log('\n🧪 Test 3: Creating a Person Record...');
    const personId = await new Promise((resolve, reject) => {
      Person.create({
        user_id: userIdA,
        firstname: 'John',
        lastname: 'Doe',
        dob: '1995-08-24',
        sex: 'M'
      }, (err, id) => {
        if (err) reject(err);
        else resolve(id);
      });
    });
    console.log(`✅ Person created with ID: ${personId}`);

    console.log('\n🎉 ALL MODEL DATA TESTS PASSED SUCCESSFULLY!');

  } catch (error) {
    console.error('\n❌ Test execution failed with error:', error.message);
  } finally {
    db.close((err) => {
      if (err) console.error('Error closing database:', err.message);
      else console.log('\nDatabase connection pool released.');
    });
  }
}

// ─── ADD A SHORT TIMEOUT TO WAIT FOR THE ASYNC TABLE WRITES ───
setTimeout(() => {
  runDatabaseTests();
}, 200);