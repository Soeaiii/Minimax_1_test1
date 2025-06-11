import { CustomFieldsManager } from './CustomFieldsManager';

interface CustomFieldDefinition {
  name: string;
  type: 'text' | 'number' | 'select';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface CustomFieldsManagerWrapperProps {
  competitionId: string;
  initialFields: CustomFieldDefinition[];
}

export function CustomFieldsManagerWrapper({
  competitionId,
  initialFields
}: CustomFieldsManagerWrapperProps) {
  return (
    <CustomFieldsManager
      competitionId={competitionId}
      initialFields={initialFields}
    />
  );
} 