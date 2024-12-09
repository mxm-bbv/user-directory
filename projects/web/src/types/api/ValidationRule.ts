export interface ValidationRule {
  rule: (value: string) => boolean;
  message: string;
}
