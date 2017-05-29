// eslint-disable-next-line import/prefer-default-export
export const removeMetaFromNewsHtml = string => string.replace(/(\[\[(.*?)\]\])/ig, '');
