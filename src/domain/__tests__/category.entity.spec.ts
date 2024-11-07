import { Uuid } from '../../shared/domain/value-objects/uuid.vo'
import { Category } from '../category.entity'

describe('Category Unit Tests', () => {
  let validateSpy: any

  beforeEach(() => {
    validateSpy = jest.spyOn(Category, 'validate')
  })

  describe('constructor', () => {
    test('Should create a category with default values', () => {
      const category = new Category({
        name: 'Movie',
      })
      expect(category.category_id).toBeInstanceOf(Uuid)
      expect(category.name).toBe('Movie')
      expect(category.description).toBeNull()
      expect(category.is_active).toBeTruthy()
      expect(category.created_at).toBeInstanceOf(Date)
    })

    test('Should create a category with all values', () => {
      const created_at = new Date()
      const category = new Category({
        name: 'Movie',
        description: 'Movie description',
        is_active: false,
        created_at,
      })
      expect(category.category_id).toBeInstanceOf(Uuid)
      expect(category.name).toBe('Movie')
      expect(category.description).toBe('Movie description')
      expect(category.is_active).toBeFalsy()
      expect(category.created_at).toBe(created_at)
    })

    test('Should create a category with name and description', () => {
      const category = new Category({
        name: 'Movie',
        description: 'Movie description',
      })
      expect(category.category_id).toBeInstanceOf(Uuid)
      expect(category.name).toBe('Movie')
      expect(category.description).toBe('Movie description')
      expect(category.is_active).toBeTruthy()
      expect(category.created_at).toBeInstanceOf(Date)
    })
  })

  describe('create command', () => {
    test('Should create a category', () => {
      const category = Category.create({
        name: 'Movie',
      })
      expect(category.category_id).toBeInstanceOf(Uuid)
      expect(category.name).toBe('Movie')
      expect(category.description).toBeNull()
      expect(category.is_active).toBe(true)
      expect(category.created_at).toBeInstanceOf(Date)
      expect(validateSpy).toHaveBeenCalledTimes(1)
    })

    test('Should create a category with description', () => {
      const category = Category.create({
        name: 'Movie',
        description: 'Movie description',
      })
      expect(category.category_id).toBeInstanceOf(Uuid)
      expect(category.name).toBe('Movie')
      expect(category.description).toBe('Movie description')
      expect(category.is_active).toBe(true)
      expect(category.created_at).toBeInstanceOf(Date)
      expect(validateSpy).toHaveBeenCalledTimes(1)
    })

    test('Should create a category with is_active', () => {
      const category = Category.create({
        name: 'Movie',
        is_active: false,
      })
      expect(category.category_id).toBeInstanceOf(Uuid)
      expect(category.name).toBe('Movie')
      expect(category.description).toBeNull()
      expect(category.is_active).toBe(false)
      expect(category.created_at).toBeInstanceOf(Date)
      expect(validateSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('category_id field', () => {
    const arrange = [
      { category_id: null },
      { category_id: undefined },
      { category_id: new Uuid() },
    ]
    test.each(arrange)('id = %j', ({ category_id }) => {
      const category = new Category({
        name: 'Movie',
        category_id: category_id as any,
      })
      expect(category.category_id).toBeInstanceOf(Uuid)
      if (category_id instanceof Uuid) {
        expect(category.category_id).toBe(category_id)
      }
    })
  })

  test('Should change name', () => {
    const category = Category.create({
      name: 'Movie',
    })
    category.changeName('Movie changed')
    expect(category.name).toBe('Movie changed')
    expect(validateSpy).toHaveBeenCalledTimes(2)
  })

  test('Should change description', () => {
    const category = Category.create({
      name: 'Movie',
      description: 'Movie description',
    })
    category.changeDescription('Movie description changed')
    expect(category.description).toBe('Movie description changed')
    expect(validateSpy).toHaveBeenCalledTimes(2)
  })

  test('Should activate a category', () => {
    const category = Category.create({
      name: 'Movie',
      is_active: false,
    })
    category.activate()
    expect(category.is_active).toBe(true)
  })

  test('Should deactivate a category', () => {
    const category = Category.create({
      name: 'Movie',
      is_active: true,
    })
    category.deactivate()
    expect(category.is_active).toBe(false)
  })
})

describe('Category Validator', () => {
  describe('create command', () => {
    test('should contain errors messages when category name is invalid', () => {
      expect(() => Category.create({ name: null })).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      })

      expect(() => Category.create({ name: '' })).containsErrorMessages({
        name: ['name should not be empty'],
      })

      expect(() => Category.create({ name: 5 as any })).containsErrorMessages({
        name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      })

      expect(() =>
        Category.create({ name: 't'.repeat(256) })
      ).containsErrorMessages({
        name: ['name must be shorter than or equal to 255 characters'],
      })
    })

    test('should contain errors messages when category description is invalid', () => {
      expect(() =>
        Category.create({ description: 5 } as any)
      ).containsErrorMessages({
        description: ['description must be a string'],
      })
    })
  })
})
