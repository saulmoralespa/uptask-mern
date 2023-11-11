import express from "express";
import connectDb from "./config/db.js";
import dotenv from "dotenv";
import cors from 'cors';
import userRouters from "./routes/userRoutes.js";
import projectRouters from "./routes/projectRoutes.js";
import taskRouters from "./routes/taskRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();

connectDb();

const whiteList = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback) {        
        if(whiteList.includes(origin)){
            callback(null, true);
        }else{
            callback(new Error('Error de Cors'));
        }
    }
};

app.use(cors(corsOptions));

app.use("/api/users", userRouters);
app.use("/api/projects", projectRouters);
app.use("/api/tasks", taskRouters);

const port = process.env.PORT || 8585;

app.listen(port, () => {
    console.log(`Server run in port ${port}`);
})