import { InvalidUuidError, Uuid } from "../uuid.vo"

describe('Uuid Unit Tests', () => {
  test('Should throw error when uuid is invalid', () => {
    expect(() => {
      new Uuid('invalid-uuid');
    }).toThrowError(new InvalidUuidError())
  })
})
