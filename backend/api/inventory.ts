
import { Router } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { databaseConnection } from '../connections/DatabaseConnection';

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
  
  
  
  // get all inventory
  router.get("/", (req, res) => {
    const query = "SELECT * FROM inventory";
  
    databaseConnection.query(query, (err, data) => {
        if (err) return res.json(err);
        return res.json(data); 
    });
  });
  
  
  // specific student 
  router.get("/:id", (req, res) => {
    const query = "SELECT * FROM inventory WHERE inventory_id = ?"
    const id = req.params.id
    databaseConnection.query(query, id, (err, data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
  })
  
  
  
  
  //ADD INVENTORY
  router.post("/create", (req, res) => {
    const query = `
      INSERT INTO inventory (inventory_id, itemName, itemDescription, quantity, manufacturingDate, expiryDate, lotNo, associated_Illnesses, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    const values = [
      req.body.inventory_id,
      req.body.itemName,
      req.body.itemDescription,
      req.body.quantity,
      req.body.manufacturingDate,
      req.body.expiryDate,
      req.body.lotNo,
      req.body.associated_Illnesses,
      req.body.created_at
    ];
  
    databaseConnection.query(query, values, (err, data) => {
      if (err) {
        console.error('SQL Error:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      return res.json({
        ...data,
        message: "Successfully added inventory item",
        status: "success",
      });
    });
  });
  
  
  // UPDATE STUDENT 
  router.put(`/update/:id`, upload.single('student_image_path'), (req, res) => {
    const query = `
      UPDATE students 
      SET 
        student_id_code = ?,
        student_image_path = ?,
        student_name = ?,
        student_datebirth = ?,
        student_address = ?,
        student_gender = ?,
        student_grade_level = ?,
        student_program = ?,
        student_block_section = ?,
        student_parent_name = ?,
        student_parent_number = ?,
        student_parent_email = ?
      WHERE student_id = ?
    `;
  
    const id = req.params.id;
    const imagePath = req.file ? 
      path.join('uploads', req.file.filename)
    : req.body.student_image_path; 
  
    const values = [
      req.body.student_id_code,
      imagePath,
      req.body.student_name,
      req.body.student_datebirth,
      req.body.student_address,
      req.body.student_gender,
      req.body.student_grade_level,
      req.body.student_program,
      req.body.student_block_section,
      req.body.student_parent_name,
      req.body.student_parent_number,
      req.body.student_parent_email
    ];
  
    console.log("SQL Query:", query);
    console.log("Values:", [...values, id]);
  
    databaseConnection.query(query, [...values, id], (err, data) => {
      if (err) {
        console.error('SQL Error:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      return res.json({
        ...data,
        message: "Successfully updated student",
        status: "success",
      });
    });
  });
  
  
  // DELETE STUDENT 

  router.delete("/delete/:id", (req, res) => {
    const query = "DELETE FROM students WHERE student_id = ?"
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
  
  
    // specific student 
    router.get("/scan/:id", (req, res) => {
      const query = "SELECT * FROM students WHERE student_id_code = ?"
      const id = req.params.id
      databaseConnection.query(query, [id], (err, data) => {
          if(err) return res.json(err)
          return res.json(data)
      })
    })
  

  export const inventoryRouter = router;
  
  
  