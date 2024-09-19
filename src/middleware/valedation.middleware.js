// ? validation function used to valedate incoming requests using joi library as a parameter (schema)
// ? abort early false this ensures the validation will not stop on the first error 
// ? and validate all the request data
export const validation = (schema) => {
    return (req, res, next) => {
      const data = { ...req.body, ...req.params, ...req.query };
      const validationResult = schema.validate(data, { abotrEarly: false });
  
      if (validationResult.error) {
        const errorMessages = validationResult.error.details.map((err) => {
          return err.message;
        });
  
        return next(new Error(errorMessages));
      }
  
      return next();
    };
  };
  