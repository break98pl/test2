export const isURLText = (textPart: string) => {
  return /^(http|https):\/\/[^\s/$.?#].[^\s]*$/.test(textPart);
};
