"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserController = exports.updateUserController = exports.getUserByIdController = exports.getAllUsersController = exports.createUserController = exports.authController = void 0;
const MySQLAdapter_1 = require("./adapters/MySQLAdapter");
const AuthService_1 = require("../application/AuthService");
const CreateUserUseCase_1 = require("../application/CreateUserUseCase");
const GetAllUsersUseCase_1 = require("../application/GetAllUsersUseCase");
const GetUserByIdUseCase_1 = require("../application/GetUserByIdUseCase");
const UpdateUserUseCase_1 = require("../application/UpdateUserUseCase");
const DeleteUserUseCase_1 = require("../application/DeleteUserUseCase");
const AuthController_1 = require("./controllers/AuthController");
const CreateUserController_1 = require("./controllers/CreateUserController");
const GetAllUsersController_1 = require("./controllers/GetAllUsersController");
const GetUserByIdController_1 = require("./controllers/GetUserByIdController");
const UpdateUserController_1 = require("./controllers/UpdateUserController");
const DeleteUserController_1 = require("./controllers/DeleteUserController");
// Repository
const userRepository = new MySQLAdapter_1.MySQLUserRepository();
// Use Cases
const authService = new AuthService_1.AuthService(userRepository);
const createUserUseCase = new CreateUserUseCase_1.CreateUserUseCase(userRepository);
const getAllUsersUseCase = new GetAllUsersUseCase_1.GetAllUsersUseCase(userRepository);
const getUserByIdUseCase = new GetUserByIdUseCase_1.GetUserByIdUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase_1.UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase_1.DeleteUserUseCase(userRepository);
// Controllers
exports.authController = new AuthController_1.AuthController(authService);
exports.createUserController = new CreateUserController_1.CreateUserController(createUserUseCase);
exports.getAllUsersController = new GetAllUsersController_1.GetAllUsersController(getAllUsersUseCase);
exports.getUserByIdController = new GetUserByIdController_1.GetUserByIdController(getUserByIdUseCase);
exports.updateUserController = new UpdateUserController_1.UpdateUserController(updateUserUseCase);
exports.deleteUserController = new DeleteUserController_1.DeleteUserController(deleteUserUseCase);
