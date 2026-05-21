// Greatest Common Divisor — Euclidean algorithm
function gcd(a, b) {
  a = Math.abs(Math.round(a))
  b = Math.abs(Math.round(b))
  while (b) {
    const temp = b
    b = a % b
    a = temp
  }
  return a
}

// Convert decimal to fraction string
// e.g. 0.75 → "3/4", 1.5 → "1 1/2", 3 → "3"
export function decimalToFraction(decimal) {
  if (!decimal || decimal === 0) return '0'

  const isNegative = decimal < 0
  decimal = Math.abs(decimal)

  const wholePart = Math.floor(decimal)
  const decimalPart = decimal - wholePart

  // No fraction needed
  if (decimalPart < 0.01) {
    return isNegative ? `-${wholePart}` : `${wholePart}`
  }

  // Convert decimal to fraction using 64 as denominator precision
  const precision = 64
  const numerator = Math.round(decimalPart * precision)
  const denominator = precision

  const divisor = gcd(numerator, denominator)
  const simplifiedNum = numerator / divisor
  const simplifiedDen = denominator / divisor

  const fractionStr = `${simplifiedNum}/${simplifiedDen}`

  if (wholePart === 0) {
    return isNegative ? `-${fractionStr}` : fractionStr
  }

  return isNegative
    ? `-${wholePart} ${fractionStr}`
    : `${wholePart} ${fractionStr}`
}

// Scale an ingredient amount
// e.g. scaleAmount(2, 4, 6) → "3"
//      scaleAmount(1, 4, 6) → "1 1/2"
export function scaleAmount(originalAmount, originalServings, newServings) {
  if (!originalAmount) return null

  const scaledDecimal = originalAmount * (newServings / originalServings)

  // Round to avoid floating point errors like 1.9999999
  const rounded = Math.round(scaledDecimal * 64) / 64

  return decimalToFraction(rounded)
}

// Scale all ingredients in a recipe
export function scaleIngredients(ingredients, originalServings, newServings) {
  if (originalServings === newServings) return ingredients

  return ingredients.map((ingredient) => ({
    ...ingredient,
    scaledAmount: scaleAmount(ingredient.amount, originalServings, newServings),
  }))
}
