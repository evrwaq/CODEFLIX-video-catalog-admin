import { Chance } from 'chance'
import { CategoryFakeBuilder } from '../category-fake.builder'
import { Uuid } from '../../../shared/domain/value-objects/uuid.vo'

describe('CategoryFakeBuilder Unit Tests', () => {
  describe('category_id prop', () => {
    const faker = CategoryFakeBuilder.category()

    test('should throw error when any with methods has called', () => {
      expect(() => faker.category_id).toThrowError(
        new Error("Property category_id not have a factory, use 'with' methods")
      )
    })
  })
})
