import sanitizeHtml from 'sanitize-html';

const getPlainText = (html, maxlength = 50) => {
  const plainText = sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {},
  });

  return plainText.length > maxlength ? plainText.slice(0, maxlength) + '...' : plainText;
}

export default getPlainText;