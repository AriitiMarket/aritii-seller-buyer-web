export const getId = (value) => value?._id || value?.id || value;
export const isDefined = (value) => value !== null && value !== undefined;
