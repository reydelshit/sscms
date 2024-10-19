import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import path from 'path';
import { inventoryRouter } from './api/inventory';
import { transactionsMedReport } from './api/transactions/medical-report';
import { transactionsPrescription } from './api/transactions/prescription';
import { volunteerRouter } from './api/volunteer';
import { transactionsMedicalCert } from './api/transactions/medical-certificate';
import { medicalHistoryRouter } from './api/medical-history';
import { dashboardRouter } from './api/dashboard';
import { dtrRouter } from './api/dtr';
import { loginRouter } from './api/login';
// import { studentRouter } from './api/studentRoute';
// import { attendanceRouter } from './api/attendanceRoute';
// import { messageRouter } from './api/messagesRoute';
// import { dashboardRouter } from './api/dashboardRoute';



dotenv.config();
const app: Express = express();
const PORT = process.env.PORT || 8800;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

console.log('Serving static files from:', path.join(__dirname, 'uploads'));





app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
}) 


app.use("/test", (req: Request, res: Response) => {

    console.log('Test route hit');
    res.send('Hello World');
})



app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});



app.use("/login", loginRouter)
app.use("/dashboard", dashboardRouter)
app.use("/transaction/prescription", transactionsPrescription);
app.use("/transaction/medical-report", transactionsMedReport)
app.use("/transaction/medical-certificate", transactionsMedicalCert)

app.use("/medical-history", medicalHistoryRouter);
app.use("/inventory", inventoryRouter);
app.use("/volunteer", volunteerRouter)
app.use("/dtr", dtrRouter)




