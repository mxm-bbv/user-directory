export type RoleKey = 'admin' | 'user' | string;

export const rolesMap: Record<RoleKey, string> = {
  admin: 'Администратор',
  user: 'Пользователь',
};

/**
 * Преобразует внутреннее значение роли в пользовательское.
 * @param key - Внутреннее значение роли.
 * @returns Отображаемое значение роли.
 */
export function getRoleDisplayName(key: RoleKey | undefined): string {
  return rolesMap[key as RoleKey] || "Неизвестная роль";
}

/**
 * Преобразует пользовательское значение роли во внутреннее.
 * @param displayName - Отображаемое значение роли.
 * @returns Внутреннее значение роли.
 */
export function getRoleInternalKey(displayName: string): RoleKey | null {
  const entry = Object.entries(rolesMap).find(([_, value]) => value === displayName);
  return entry ? (entry[0] as RoleKey) : null;
}
