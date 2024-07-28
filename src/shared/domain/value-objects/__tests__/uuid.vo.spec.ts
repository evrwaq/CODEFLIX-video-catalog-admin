import { InvalidUuidError, Uuid } from "../uuid.vo"

describe('Uuid Unit Tests', () => {
  test('Should throw error when uuid is invalid', () => {
    expect(() => {
      new Uuid('invalid-uuid');
    }).toThrowError(new InvalidUuidError())
  })
  
  test('Should accept a valid uuid', () => {
    const uuid = new Uuid('e20fb940-3f29-4eca-b0b4-e065594b2b9d');
    expect(uuid.id).toBe('e20fb940-3f29-4eca-b0b4-e065594b2b9d');
  })
})
