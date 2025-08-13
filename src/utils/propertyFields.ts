export interface PropertyField {
  name: string;
  type: string;
  maxLength?: number;
  precision?: number;
  required: boolean;
  searchable: boolean;
  description: string;
}

export async function getPropertyFields(): Promise<PropertyField[]> {
  const response = await fetch('/api/properties/fields');
  const data = await response.json();
  return data.fields;
}

export function buildSelectString(fields: string[]): string {
  return fields.join(',');
}

export function buildFilterString(filters: Record<string, any>): string {
  const filterParts = Object.entries(filters)
    .filter(([_, value]) => value !== undefined && value !== '')
    .map(([field, value]) => {
      if (typeof value === 'string') {
        return `${field} eq '${value}'`;
      }
      return `${field} eq ${value}`;
    });

  return filterParts.join(' and ');
} 