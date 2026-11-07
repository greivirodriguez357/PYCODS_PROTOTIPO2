export interface Avatar { id: string; name: string; icon: string; }

export const AVATARS: Avatar[] = [
  { id: 'avatar1', name: 'Monstruo Azul', icon: '🤖' },
  { id: 'avatar2', name: 'Guerrero', icon: '⚔️' },
  { id: 'avatar3', name: 'Princesa', icon: '👑' },
  { id: 'avatar4', name: 'Dragón Sabio', icon: '🐉' }
];

export function avatarIcon(id: string | null | undefined): string {
  return AVATARS.find(a => a.id === id)?.icon ?? '🤖';
}
