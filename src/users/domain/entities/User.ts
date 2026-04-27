export interface User {
  id: number;
  name: string;
  secondname: string | null;
  lastname: string | null;
  secondlastname: string | null;
  email: string;
  password: string;
  profile_picture: string | null;
  createdAt: Date;
}