import { describe, it, expect } from 'vitest'
import { decimalToFraction } from '../lib/scaler'

describe('decimalToFraction edge cases', () => {
  it('handles very small decimals as whole numbers', () => {
    expect(decimalToFraction(0.005)).toBe('0')
  })

  it('handles large whole numbers', () => {
    expect(decimalToFraction(10)).toBe('10')
    expect(decimalToFraction(100)).toBe('100')
  })

  it('handles eighths correctly', () => {
    expect(decimalToFraction(0.125)).toBe('1/8')
    expect(decimalToFraction(0.375)).toBe('3/8')
  })
})
