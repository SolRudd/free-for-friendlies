export type FormState = {
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  values?: Record<string, string>;
};

export const EMPTY_FORM_STATE: FormState = {
  message: "",
  fieldErrors: {},
  values: {},
};
