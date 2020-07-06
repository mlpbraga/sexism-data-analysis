import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string;
}
export const getValidationErrors = (errors: ValidationError): Errors => {
  console.log(errors);

  const validationErrors: Errors = {};
  errors.inner.forEach(error => {
    validationErrors[error.path] = error.message;
  });
  console.log(validationErrors);
  return validationErrors;
};
