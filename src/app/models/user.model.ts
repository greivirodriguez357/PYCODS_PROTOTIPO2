export type Rol = 'admin' | 'docente' | 'estudiante' | 'invitado';

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
  avatar: string | null;
  nivel: number;
  xp: number;
  monedas: number;
  vidas: number;
  racha: number;
}
