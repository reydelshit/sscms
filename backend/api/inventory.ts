
import { Router } from 'express';
import { databaseConnection } from '../connections/DatabaseConnection';

const router = Router();


  
  
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
      INSERT INTO inventory (inventory_id, itemName, itemDescription, quantity, manufacturingDate, expiryDate, lotNo, associated_Illnesses, category, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      req.body.category,
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
  
  
  // UPDATE INVENTORY 
  router.put("/update/:id", (req, res) => {
    const query = `
      UPDATE inventory 
      SET itemName = ?, 
          itemDescription = ?, 
          quantity = ?, 
          manufacturingDate = ?, 
          expiryDate = ?, 
          lotNo = ?, 
          associated_Illnesses = ?, 
          category = ?
      WHERE inventory_id = ?
    `;
  
    const values = [
      req.body.itemName,
      req.body.itemDescription,
      req.body.quantity,
      req.body.manufacturingDate,
      req.body.expiryDate,
      req.body.lotNo,
      req.body.associated_Illnesses,
      req.body.category,
      req.params.id
    ];
  
    databaseConnection.query(query, values, (err, data) => {
      if (err) {
        console.error('SQL Error:', err);
        return res.status(500).json({ error: 'Database update failed' });
      }
      
      if ((data as any).affectedRows === 0) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
  
      return res.json({
        message: "Successfully updated inventory item",
        status: "success"
      });
    });
  });
  
  
  // DELETE STUDENT 

  router.delete("/delete/:id", (req, res) => {
    const query = "DELETE FROM inventory WHERE inventory_id = ?"
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
  
  
  