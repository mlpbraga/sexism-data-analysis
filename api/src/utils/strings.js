function ucFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Execute sanitizing and normalizing query processing
 *
 * @param {!string} query - string from req.query
 * @returns {string}
 */
function sanitizeQuery(query) {
  // TODO: add utf8 encode, if necessary
  try {
    return decodeURIComponent(query);
  } catch (e) {
    return query;
  }
}

/**
 * Remove accents from string.
 *
 * normalize()ing to NFD Unicode normal form decomposes
 * combined graphemes into the combination of simple ones.
 * The è of Crème ends up expressed as e + ̀`.
 *
 * Using a regex character class to match the U+0300 → U+036F
 * range, it is now trivial to globally get rid of the diacritics,
 * which the Unicode standard conveniently groups as the
 * Combining Diacritical Marks Unicode block
 *
 * @param {!string} string - string with accents or not.
 * @returns {string} a string, without accents.
 */
function removeAccents(string) {
  return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Normalize string to lower case removing whitespaces, accents
 * and special characters: '"`,.
 *
 * @param {string} string
 * @return {string}
 */
function normalize(string) {
  return removeAccents(string.trim()).toLowerCase().replace(/['"`,.]/g, '');
}

module.exports = {
  ucFirst,
  sanitizeQuery,
  removeAccents,
  normalize,
};
