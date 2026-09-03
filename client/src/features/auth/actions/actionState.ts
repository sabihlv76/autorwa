export interface ActionState {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export const initialActionState: ActionState = { success: false };
