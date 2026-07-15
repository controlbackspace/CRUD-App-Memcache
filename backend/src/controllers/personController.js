// C:\Users\jakea\Basic_CRUD_Application\backend\src\controllers\personController.js
const calculateAge = require('../utils/ageCalc'); 

module.exports = (PersonModel) => {
  return {
    
    
    getAll: async (req, res) => {
      try {
        const currentUserId = req.user.id; 

        
        const rows = await PersonModel.findAllByUserId(currentUserId);
        

        return res.status(200).json(rows);
      } catch (err) {
        console.error("❌ GetAll Error:", err.message);
        return res.status(500).json({ error: "Failed to fetch persons" });
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

        if (!firstname || !lastname || !dob) {
          return res.status(400).json({ error: "Missing required fields: firstname, lastname, dob" });
        }

        const personData = {
          firstname,
          lastname,
          dob,
          sex: sex || 'unknown'
        };

        const newPerson = await PersonModel.create(personData, currentUserId);

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

        if (isNaN(targetId)) {
          return res.status(400).json({ error: "Invalid ID parameter format" });
        }

        if (!firstname || !lastname || !dob) {
          return res.status(400).json({ error: "Missing required fields: firstname, lastname, dob" });
        }

        const updateData = { firstname, lastname, dob, sex: sex || 'unknown' };

        const result = await PersonModel.update(targetId, updateData, currentUserId);

        if (!result || result.changes === 0) {
          return res.status(404).json({ error: "Person not found or unauthorized to update" });
        }

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
        

        if (isNaN(targetId)) {
          return res.status(400).json({ error: "Invalid ID parameter format" });
        }

        
        const result = await PersonModel.delete(targetId, currentUserId);
        

        if (!result || result.changes === 0) {
          return res.status(404).json({ error: "Person not found or unauthorized to delete" });
        }

        return res.status(200).json({ message: "Person deleted successfully" });
      } catch (err) {
        console.error("❌ Delete Error:", err.message);
        return res.status(500).json({ error: "Failed to delete person" });
      }
    }
  };
};