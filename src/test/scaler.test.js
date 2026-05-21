import { describe, it, expect } from 'vitest'
import { decimalToFraction, scaleAmount, scaleIngredients } from '../lib/scaler'

describe('decimalToFraction', () => {
  it('converts whole numbers correctly', () => {
    expect(decimalToFraction(1)).toBe('1')
    expect(decimalToFraction(3)).toBe('3')
    expect(decimalToFraction(0)).toBe('0')
  })

  it('converts simple fractions', () => {
    expect(decimalToFraction(0.5)).toBe('1/2')
    expect(decimalToFraction(0.25)).toBe('1/4')
    expect(decimalToFraction(0.75)).toBe('3/4')
  })

  it('converts mixed numbers', () => {
    expect(decimalToFraction(1.5)).toBe('1 1/2')
    expect(decimalToFraction(2.25)).toBe('2 1/4')
    expect(decimalToFraction(3.75)).toBe('3 3/4')
  })

  it('handles common cooking measurements', () => {
    expect(decimalToFraction(0.125)).toBe('1/8')
    expect(decimalToFraction(0.5)).toBe('1/2')
    expect(decimalToFraction(0.25)).toBe('1/4')
  })
})

describe('scaleAmount', () => {
  it('scales up correctly', () => {
    expect(scaleAmount(2, 4, 6)).toBe('3')
  })

  it('scales down correctly', () => {
    expect(scaleAmount(2, 4, 2)).toBe('1')
  })

  it('produces fractions when scaling', () => {
    expect(scaleAmount(1, 4, 6)).toBe('1 1/2')
  })

  it('returns null for missing amounts', () => {
    expect(scaleAmount(null, 4, 6)).toBeNull()
    expect(scaleAmount(0, 4, 6)).toBeNull()
  })

  it('same servings returns same amount', () => {
    expect(scaleAmount(2, 4, 4)).toBe('2')
  })
})

describe('scaleIngredients', () => {
  const mockIngredients = [
    { id: '1', name: 'flour', amount: 2, unit: 'cups' },
    { id: '2', name: 'salt', amount: 1, unit: 'tsp' },
    { id: '3', name: 'vanilla extract', amount: null, unit: 'tsp' },
  ]

  it('returns same array when servings unchanged', () => {
    const result = scaleIngredients(mockIngredients, 4, 4)
    expect(result).toBe(mockIngredients)
  })

  it('adds scaledAmount to each ingredient', () => {
    const result = scaleIngredients(mockIngredients, 4, 8)
    expect(result[0].scaledAmount).toBe('4')
    expect(result[1].scaledAmount).toBe('2')
  })

  it('does not modify original ingredient data', () => {
    const result = scaleIngredients(mockIngredients, 4, 8)
    expect(result[0].amount).toBe(2)
    expect(result[0].name).toBe('flour')
  })

  it('handles ingredients with no amount', () => {
    const result = scaleIngredients(mockIngredients, 4, 8)
    expect(result[2].scaledAmount).toBeNull()
  })
})
