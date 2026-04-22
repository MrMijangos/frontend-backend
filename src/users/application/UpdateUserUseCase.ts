import { IUserRepository } from '../domain/IUserRepository';
import { User } from '../domain/entities/User';
import { UpdateUserRequest } from '../domain/dto/UserRequest';
import { isValidEmail } from '../domain/utils/EmailValidator';

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: number, updateRequest: UpdateUserRequest): Promise<User> {
    const existingUser = await this.userRepository.getByID(id);
    if (!existingUser) throw new Error('Usuario no encontrado');

    if (!updateRequest.name?.trim()) throw new Error('El nombre es obligatorio');
    if (!updateRequest.lastname?.trim()) throw new Error('El apellido es obligatorio');
    if (!updateRequest.email?.trim()) throw new Error('El email es obligatorio');
    if (!isValidEmail(updateRequest.email)) throw new Error('El email no es valido');

    const updatedUser: User = {
      ...existingUser,
      name: updateRequest.name.trim(),
      secondname: updateRequest.secondname?.trim() || null,
      lastname: updateRequest.lastname.trim(),
      secondlastname: updateRequest.secondlastname?.trim() || null,
      email: updateRequest.email.trim().toLowerCase(),
      profile_picture: updateRequest.profile_picture !== undefined
        ? updateRequest.profile_picture
        : existingUser.profile_picture,
    };

    await this.userRepository.update(updatedUser);
    return updatedUser;
  }
}