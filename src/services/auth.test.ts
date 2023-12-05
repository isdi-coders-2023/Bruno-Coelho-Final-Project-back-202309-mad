import { Auth } from './auth.js';
import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('bcrypt'); // Todas las funciones mockeadas devuelven undefined

describe('Given Auth abstract class', () => {
  describe('When se use its methods', () => {
    test('Then hash should ...', () => {
      // Arrange
      (hash as jest.Mock).mockReturnValue('test');
      const mockValue = '';
      // Act
      const result = Auth.hash(mockValue);
      // Assert
      expect(hash).toHaveBeenCalled();
      expect(result).toBe('test');
    });

    test('Then compare should ...', () => {
      (compare as jest.Mock).mockReturnValue(true);
      const mockValue = '';
      const result = Auth.compare(mockValue, mockValue);
      expect(compare).toHaveBeenCalled();
      expect(result).toBe(true);
    });
    test('Then verifyAndGetPayload should ...', () => {
      jwt.verify = jest.fn().mockReturnValue({});
      const result = Auth.verifyAndGetPayload('');
      expect(jwt.verify).toHaveBeenCalled();
      expect(result).toStrictEqual({});
    });

    test('Then verifyAndGetPayload should throw an error', () => {
      jwt.verify = jest.fn().mockReturnValue('');
      expect(() => Auth.verifyAndGetPayload('')).toThrow();
      expect(jwt.verify).toHaveBeenCalled();
    });
  });
});
