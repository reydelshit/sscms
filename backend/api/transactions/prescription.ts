
import { Router } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { databaseConnection } from '../../connections/DatabaseConnection';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', '..', 'uploads');
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

  
  const upload = multer({ storage });
  
  
  
  // get all 
  router.get("/", (req, res) => {
    const query = "SELECT * FROM prescription";
  
    databaseConnection.query(query, (err, data) => {
        if (err) return res.json(err);
        return res.json(data); 
    });
  });
  
  
  // specific  
  router.get("/:id", (req, res) => {
    const query = "SELECT * FROM prescription WHERE prescription_id = ?"
    const id = req.params.id
    databaseConnection.query(query, id, (err, data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
  })
  
  
  
  
  //CREATE 
  router.post("/create", (req, res) => {
    const query = `
      INSERT INTO prescription (prescription_id, studentId, illness, prescrip, sig, quantity, date, studentName, course, year) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      req.body.prescription_id,
      req.body.studentId,
      req.body.illness,
      req.body.prescrip,
      req.body.sig,
      req.body.quantity,
      req.body.date,
      req.body.studentName,
      req.body.course,
      req.body.year

    ];

    databaseConnection.query(query, values, (err, data) => {
      if (err) {
        console.error('SQL Error:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      return res.json({
        ...data,
        message: "Successfully added prescription",
        status: "success",
      });
    });
});

  
  
  // UPDATE  
  router.put("/update/:id", (req, res) => {
    const query = `
      UPDATE prescription 
      SET studentId = ?, 
          illness = ?, 
          prescrip = ?, 
          sig = ?, 
          quantity = ?, 
          studentName = ?, 
          course = ?
          year = ?
      WHERE prescription_id = ?
    `;

    const values = [
      req.body.studentId,
      req.body.illness,
      req.body.prescrip,
      req.body.sig,
      req.body.quantity,
      req.body.studentName,
      req.body.course,
      req.body.year,
      req.params.id
    ];

    databaseConnection.query(query, values, (err, data) => {
      if (err) {
        console.error('SQL Error:', err);
        return res.status(500).json({ error: 'Database update failed' });
      }

      if (data.affectedRows === 0) {
        return res.status(404).json({ message: "Prescription not found" });
      }

      return res.json({
        message: "Successfully updated prescription",
        status: "success"
      });
    });
});

  
  // DELETE  
  router.delete("/delete/:id", (req, res) => {
    const query = "DELETE FROM prescription WHERE prescription_id = ?"
    const id = req.params.id
  
    databaseConnection.query(query, id, (err, data) => {
        if(err) return res.json(err)
        return res.json({
        ...data,
        message: "succesfully deleted",
        status: "success",
      })
    })
  })
  
  

  

  export const transactionsPrescription = router;
  
  
  