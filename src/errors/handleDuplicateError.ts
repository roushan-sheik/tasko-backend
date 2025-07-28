import GlobalErrorObj from "../utils/GlobalErrorObj";

type TMongoDuplicateError = {
  code?: number;
  keyValue?: Record<string, string>;
};

const handleDuplicateError = (err: TMongoDuplicateError) => {
  const keyValue = err?.keyValue;
  if (keyValue) {
    const fields = Object.keys(keyValue);
    const errorSources = fields.map((field: string) => {
      return {
        path: field,
        message: `${keyValue[field]} is already exists!`,
      };
    });
    return new GlobalErrorObj(400, "Duplicate Error", errorSources);
  }
};
export default handleDuplicateError;
