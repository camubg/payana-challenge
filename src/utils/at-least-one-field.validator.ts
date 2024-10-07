import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'atLeastOneField', async: false })
export class AtLeastOneFieldConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as any;
    const fields = args.constraints;

    return fields.some((field: string) => object[field] !== undefined);
  }

  defaultMessage(args: ValidationArguments) {
    const fields = args.constraints.join(', ');
    return `At least one field (${fields}) must be provided`;
  }
}

export function AtLeastOneField(
  fields: string[],
  validationOptions?: ValidationOptions,
) {
  return function (constructor: Function) {
    registerDecorator({
      propertyName: '',
      target: constructor,
      constraints: fields,
      options: validationOptions,
      validator: AtLeastOneFieldConstraint,
    });
  };
}
