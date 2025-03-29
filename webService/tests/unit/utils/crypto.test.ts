import { encrypt, decrypt, generateSalt, encryptPassword, comparePassword } from '../../../src/utils/crypto';

describe('Crypto Utils', () => {
  const testText = '测试文本';
  const testPassword = 'test_password';
  
  describe('encrypt & decrypt', () => {
    it('should encrypt and decrypt text correctly', () => {
      const { encrypted, salt } = encrypt(testText);
      expect(encrypted).not.toBe(testText);
      
      const decrypted = decrypt(encrypted, salt);
      expect(decrypted).toBe(testText);
    });
    
    it('should handle empty string', () => {
      const { encrypted, salt } = encrypt('');
      const decrypted = decrypt(encrypted, salt);
      expect(decrypted).toBe('');
    });
  });
  
  describe('generateSalt', () => {
    it('should generate a salt with default length', () => {
      const salt = generateSalt();
      expect(salt).toBeDefined();
      expect(typeof salt).toBe('string');
      expect(salt.length).toBeGreaterThan(0);
    });
    
    it('should generate a salt with specified length', () => {
      const length = 20;
      const salt = generateSalt(length);
      // 因为generateSalt返回的是十六进制字符串，每个字节对应两个十六进制字符
      expect(salt.length).toBe(length * 2);
    });
  });
  
  describe('encryptPassword & comparePassword', () => {
    it('should encrypt password and verify it correctly', () => {
      const { hash, salt } = encryptPassword(testPassword);
      
      expect(hash).toBeDefined();
      expect(salt).toBeDefined();
      expect(hash).not.toBe(testPassword);
      
      const isMatch = comparePassword(testPassword, hash, salt);
      expect(isMatch).toBe(true);
    });
    
    it('should return false when comparing with wrong password', () => {
      const { hash, salt } = encryptPassword(testPassword);
      const isMatch = comparePassword('wrong_password', hash, salt);
      expect(isMatch).toBe(false);
    });
  });
}); 