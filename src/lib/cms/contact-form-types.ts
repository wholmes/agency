export type ContactFormLabels = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budgetRange: string;
  message: string;
};

export type ContactFormPlaceholders = {
  name: string;
  email: string;
  company: string;
  message: string;
};

export type ContactFormValidation = {
  nameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  messageRequired: string;
};

export type ContactFormSubmit = {
  send: string;
  sending: string;
};

export type ContactFormSuccess = {
  title: string;
  body: string;
};

export type ContactFormError = {
  generic: string;
};

export type ContactFormConfigParsed = {
  heading: string;
  budgetOptions: string[];
  projectOptions: string[];
  labels: ContactFormLabels;
  placeholders: ContactFormPlaceholders;
  selectPlaceholder: string;
  validation: ContactFormValidation;
  submit: ContactFormSubmit;
  success: ContactFormSuccess;
  error: ContactFormError;
  footerNote: string;
};
