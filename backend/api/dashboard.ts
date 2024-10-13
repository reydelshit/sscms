
import { Router } from 'express';
import { databaseConnection } from '../connections/DatabaseConnection';

const router = Router();

  
  //pie chart
  router.get("/pie-chart", (req, res) => {
    const query = "SELECT illness AS label, COUNT(illness) AS value FROM prescription GROUP BY illness ORDER BY value DESC LIMIT 3";
  
    databaseConnection.query(query, (err, data) => {
        if (err) return res.json(err);
        return res.json(data); 
    });
  });

  //graph dispensed
  router.get("/dispensed", (req, res) => {
    const query = "SELECT inventory.itemName AS name, SUM(dispensed.quantity) AS total FROM dispensed INNER JOIN inventory ON inventory.inventory_id = dispensed.inventory_id GROUP BY inventory.itemName ORDER BY total DESC LIMIT 8;";
  
    databaseConnection.query(query, (err, data) => {
        if (err) return res.json(err);
        return res.json(data); 
    });
  });


   //graph dispensed
   router.get("/visits", (req, res) => {
    const query = `
            SELECT 
                DAYNAME(medreport.date) AS name, 
                COUNT(*) AS total 
            FROM 
                medreport
            WHERE 
                MONTH(medreport.date) = MONTH(CURDATE())  
                AND YEAR(medreport.date) = YEAR(CURDATE())  
                AND WEEK(medreport.date) = WEEK(CURDATE())  
            GROUP BY 
                DAYNAME(medreport.date) 
            ORDER BY 
                FIELD(DAYNAME(medreport.date), 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

            `;
    databaseConnection.query(query, (err, data) => {
        if (err) return res.json(err);
        return res.json(data); 
    });
  });
  
  


  export const dashboardRouter = router;
  
  
  