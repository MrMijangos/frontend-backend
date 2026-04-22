import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { configureUserRoutes } from './src/users/infrastructure/routes/routes';
import {
  authController, createUserController, getAllUsersController,
  getUserByIdController, updateUserController, deleteUserController,
} from './src/users/infrastructure/dependencies';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api', configureUserRoutes(
  authController, createUserController, getAllUsersController,
  getUserByIdController, updateUserController, deleteUserController
));

app.get('/', (_req, res) => res.json({ message: 'SquadUp API - Running' }));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`API disponible en http://localhost:${PORT}/api`);
});