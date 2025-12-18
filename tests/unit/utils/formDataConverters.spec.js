import { describe, it, expect } from 'vitest'
import { toNumber } from '@/utils/formDataConverters'

/**
 * Tests unitaires pour formDataConverters
 *
 * Valide la conversion de données de formulaire vers des types stricts
 * utilisés par les stores TypeScript
 */

describe('formDataConverters', () => {
  describe('toNumber', () => {
    describe('Cas nominaux - Conversion réussie', () => {
      it('should convert string numbers to number', () => {
        expect(toNumber('100')).toBe(100)
        expect(toNumber('0')).toBe(0)
        expect(toNumber('1234')).toBe(1234)
      })

      it('should convert decimal strings to number', () => {
        expect(toNumber('10.5')).toBe(10.5)
        expect(toNumber('99.99')).toBe(99.99)
        expect(toNumber('0.1')).toBe(0.1)
      })

      it('should return number as-is if already a number', () => {
        expect(toNumber(100)).toBe(100)
        expect(toNumber(10.5)).toBe(10.5)
        expect(toNumber(0)).toBe(0)
        expect(toNumber(-10)).toBe(-10)
      })
    })

    describe('Cas de nettoyage - Gestion des formats', () => {
      it('should handle numbers with spaces', () => {
        // Note: parseFloat ignore les espaces au début, mais pas au milieu
        // "1 000" devient 1 car parseFloat s'arrête au premier espace
        expect(toNumber('1 000')).toBe(1) // Comportement de parseFloat
        expect(toNumber('  100  ')).toBe(100) // Espaces au début/fin ignorés
      })

      it('should replace comma with dot for decimal separator', () => {
        expect(toNumber('1,5')).toBe(1.5)
        expect(toNumber('10,50')).toBe(10.5)
        expect(toNumber('1000,99')).toBe(1000.99)
      })

      it('should handle mixed comma/dot separators (first separator wins)', () => {
        // Note: replace(',', '.') remplace seulement la première virgule
        // '1,200.50' devient '1.200.50', parseFloat s'arrête au premier point → 1.2
        // Pour les formats avec séparateurs de milliers, une logique plus complexe serait nécessaire
        expect(toNumber('1,200.50')).toBe(1.2) // Comportement actuel : première virgule remplacée
      })

      it('should handle negative numbers', () => {
        expect(toNumber('-100')).toBe(-100)
        expect(toNumber('-10.5')).toBe(-10.5)
        expect(toNumber(-50)).toBe(-50)
      })
    })

    describe('Cas limites - Valeurs vides ou invalides', () => {
      it('should return undefined for empty string', () => {
        expect(toNumber('')).toBeUndefined()
      })

      it('should return undefined for null', () => {
        expect(toNumber(null)).toBeUndefined()
      })

      it('should return undefined for undefined', () => {
        expect(toNumber(undefined)).toBeUndefined()
      })

      it('should return undefined for non-numeric strings', () => {
        expect(toNumber('abc')).toBeUndefined()
        expect(toNumber('hello')).toBeUndefined()
        expect(toNumber('abc123')).toBeUndefined() // Commence par des lettres → NaN
      })

      it('should extract number from strings starting with digits (parseFloat behavior)', () => {
        // parseFloat extrait le nombre du début de la chaîne
        // C'est le comportement standard de JavaScript
        expect(toNumber('12abc')).toBe(12) // parseFloat('12abc') = 12
        expect(toNumber('100px')).toBe(100) // parseFloat('100px') = 100
      })

      it('should handle boolean values (converts to 1/0 in JavaScript)', () => {
        // Note: Number(true) = 1, Number(false) = 0 en JavaScript
        // Dans un contexte de formulaire, ces cas ne devraient pas arriver
        // mais si c'est le cas, on laisse le comportement JavaScript standard
        expect(toNumber(true)).toBe(1)
        expect(toNumber(false)).toBe(0)
      })

      it('should handle array/object values (JavaScript behavior)', () => {
        // Note: Number([]) = 0, Number({}) = NaN, Number([1,2,3]) = NaN en JavaScript
        // Ces cas ne devraient pas arriver dans un formulaire réel
        expect(toNumber([])).toBe(0) // Number([]) = 0
        expect(toNumber({})).toBeUndefined() // Number({}) = NaN → undefined
        expect(toNumber([1, 2, 3])).toBeUndefined() // Number([1,2,3]) = NaN → undefined
      })

      it('should handle edge cases with mixed characters', () => {
        expect(toNumber('12.34.56')).toBe(12.34) // parseFloat s'arrête au deuxième point
        expect(toNumber('1e2')).toBe(100) // Notation scientifique valide
        expect(toNumber('0xFF')).toBe(0) // parseFloat ne parse pas hex, retourne 0
      })

      it('should trim strings before parsing', () => {
        expect(toNumber('  100  ')).toBe(100)
        expect(toNumber(' 10.5 ')).toBe(10.5)
        expect(toNumber('   ')).toBeUndefined() // String vide après trim
      })
    })

    describe("Cas d'usage réels - Données de formulaire typiques", () => {
      it('should handle rent values from form inputs', () => {
        expect(toNumber('1200')).toBe(1200)
        expect(toNumber(1200)).toBe(1200)
        expect(toNumber('1,200')).toBe(1.2) // Remplace la virgule par un point
        expect(toNumber('1200.50')).toBe(1200.5)
      })

      it('should handle surface values (m²)', () => {
        expect(toNumber('75')).toBe(75)
        expect(toNumber('45.5')).toBe(45.5)
        expect(toNumber('100')).toBe(100)
      })

      it('should handle pieces count', () => {
        expect(toNumber('3')).toBe(3)
        expect(toNumber('1')).toBe(1)
        expect(toNumber('10')).toBe(10)
      })

      it('should handle form values that might be null/undefined', () => {
        expect(toNumber(null)).toBeUndefined()
        expect(toNumber(undefined)).toBeUndefined()
        // Simule un champ non rempli
        expect(toNumber('')).toBeUndefined()
      })
    })
  })
})
