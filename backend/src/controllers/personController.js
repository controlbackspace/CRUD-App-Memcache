// C:\Users\jakea\Basic_CRUD_Application\backend\src\controllers\personController.js
const calculateAge = require('../utils/ageCalc'); 
const cache = require('../config/cache');

module.exports = (PersonModel) => {

  return {
    // 1. GET ALL RECORDS (Read-Through Cache Implementation)
    getAll: async (req, res) => {
      try {
        const currentUserId = req.user.id;
        const cacheKey = `user_${currentUserId}_persons`;
        const reqTimestamp = Date.now();

        cache.get(cacheKey, (err, data) => {

          if (err) console.error(`[${reqTimestamp}] 🚨 MEMCACHED READ ERROR:`, err);
          
          if (err || !data) {
            console.log('🐢 Cache MISS: Querying SQLite database disk.');
            
            (async () => {
// ^^^ FIX: IIFE initialized to safely encapsulate the modern `await` promises.
                try {
                    const rows = await PersonModel.findAllByUserId(currentUserId);
                    const ttlSeconds = 60; 
                    
                    cache.set(cacheKey, JSON.stringify(rows), ttlSeconds, (setErr) => {
                        if (setErr) console.error(`❌ Cache WRITE FAILURE:`, setErr.message);
                        else console.log(`✅ Cache SET SUCCESS: Key ${cacheKey} frozen in RAM.`);
                    });
                    
                    return res.status(200).json(rows);
// ^^^ FIX: HTTP Response successfully sent from within the isolated async micro-context.
                } catch (dbErr) {
                    console.error("Database Error:", dbErr);
                    return res.status(500).json({ error: "Internal Server Error" });
                }
            })();

            return; 
// ^^^ FIX: Execution firewall. This guarantees the function halts here, preventing the V8 engine from executing the cache hit logic below and throwing ERR_HTTP_HEADERS_SENT.
          }

          console.log('⚡ Cache HIT: Serving from Memcached RAM.');
          return res.status(200).json(JSON.parse(data));
// ^^^ FIX: All duplicate database query logic previously stranded above this line has been entirely deleted, resolving the fatal SyntaxError.
        });
      } catch (err) {
        console.error("Server Error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    },

    // 2. GET RECORD BY ID (Asynchronous)
    getById: async (req, res) => {
      try {
        const currentUserId = req.user.id;
        const targetId = parseInt(req.params.id, 10);
        
        if (isNaN(targetId)) {
          return res.status(400).json({ error: "Invalid ID parameter format" });
        }

        const row = await PersonModel.findById(targetId, currentUserId);

        if (!row) {
          return res.status(404).json({ error: "Person not found" });
        }

        return res.status(200).json(row);
      } catch (err) {
        console.error("❌ GetById Error:", err.message);
        return res.status(500).json({ error: "Failed to fetch person" });
      }
    },

    // 3. CREATE RECORD (Asynchronous)
    create: async (req, res) => {
      try {
        const currentUserId = req.user.id;
        const { firstname, lastname, dob, sex } = req.body;

        const personData = { firstname, lastname, dob, sex: sex || 'unknown' };
        const newPerson = await PersonModel.create(personData, currentUserId);

        const cacheKey = `user_${currentUserId}_persons`;
        cache.del(cacheKey, (err) => {
// EXISTING: Invalidates the cache on write to guarantee data consistency.
          if (err) console.error('❌ Failed to flush cache on create:', err.message);
          else console.log(`🗑️ Cache FLUSHED for key: ${cacheKey}`);
        });

        return res.status(200).json(newPerson);
      } catch (err) {
        console.error("❌ Create Error:", err.message);
        return res.status(500).json({ error: "Failed to create person" });
      }
    },

    // 4. UPDATE RECORD (Asynchronous)
    update: async (req, res) => {
      try {
        const currentUserId = req.user.id;
        const targetId = parseInt(req.params.id, 10);
        
        const { firstname, lastname, dob, sex } = req.body;

        const updateData = { firstname, lastname, dob, sex: sex || 'unknown' };
        const result = await PersonModel.update(targetId, updateData, currentUserId);

        if (!result || result.changes === 0) {
          return res.status(404).json({ error: "Person not found or unauthorized to update" });
        }

        const cacheKey = `user_${currentUserId}_persons`;
        cache.del(cacheKey, (err) => {
// EXISTING: Cache flush ensures subsequent read-through operations pull the updated record.
          if (err) console.error('❌ Failed to flush cache on update:', err.message);
          else console.log(`🗑️ Cache FLUSHED for key: ${cacheKey}`);
        });

        return res.status(200).json({ message: "Person updated successfully" });
      } catch (err) {
        console.error("❌ Update Error:", err.message);
        return res.status(500).json({ error: "Failed to update person" });
      }
    },

    // 5. DELETE RECORD (Asynchronous)
    deletePerson: async (req, res) => {
      try {
        const currentUserId = req.user.id;
        const targetId = parseInt(req.params.id, 10);
        
        const result = await PersonModel.delete(targetId, currentUserId);
        
        if (!result || result.changes === 0) {
          return res.status(404).json({ error: "Person not found or unauthorized to delete" });
        }

        const cacheKey = `user_${currentUserId}_persons`;
        cache.del(cacheKey, (err) => {
// EXISTING: Cleans up RAM footprint when a user is hard-deleted.
          if (err) console.error('❌ Failed to flush cache on delete:', err.message);
          else console.log(`🗑️ Cache FLUSHED for key: ${cacheKey}`);
        });

        return res.status(200).json({ message: "Person deleted successfully" });
      } catch (err) {
        console.error("❌ Delete Error:", err.message);
        return res.status(500).json({ error: "Failed to delete person" });
      }
    }
  };
};