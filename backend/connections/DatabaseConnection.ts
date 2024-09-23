import mysql from 'mysql';


const databaseConnection: mysql.Connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'qr-code-monitoring',
  });
  
  
  databaseConnection.connect((err) => {
   if(err) return console.log(err);
  
   return console.log('Database connected');
  })

  export { databaseConnection };