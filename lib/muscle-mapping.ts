export const CATEGORIES = ['Chest', 'Back', 'Shoulders', 'Arms', 'Core', 'Legs'] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_COLORS: Record<string, string> = {
  Chest: '#e85050',
  Back: '#50c8e8',
  Shoulders: '#e8c850',
  Arms: '#e88050',
  Core: '#c850e8',
  Legs: '#50e870',
};

export const CATEGORY_SUBGROUPS: Record<string, string[]> = {
  Chest: ['Upper Pecs', 'Lower Pecs'],
  Back: ['Lats', 'Traps', 'Lower Back'],
  Shoulders: ['Front Delts', 'Side Delts', 'Rear Delts'],
  Arms: ['Biceps', 'Triceps', 'Forearms'],
  Core: ['Upper Abs', 'Lower Abs', 'Obliques'],
  Legs: ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
};

export function getSubGroups(category: string): string[] {
  return CATEGORY_SUBGROUPS[category] || [];
}
