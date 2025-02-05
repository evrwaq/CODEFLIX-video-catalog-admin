import { Sequelize } from 'sequelize-typescript'
import { CategoryModel } from '../category.model'
import { CategorySequelizeRepository } from '../category-sequelize.repository'
import { Category } from '../../../../domain/category.entity'
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo'
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error'
import { CategoryModelMapper } from '../category-model-mapper'
import {
  CategorySearchParams,
  CategorySearchResult,
} from '../../../../domain/category.repository'

describe('CategorySequelizeRepository Integration Test', () => {
  let sequelize
  let repository: CategorySequelizeRepository

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory',
      models: [CategoryModel],
      logging: false,
    })
    await sequelize.sync({ force: true })
    repository = new CategorySequelizeRepository(CategoryModel)
  })

  it('should insert a new category', async () => {
    const category = Category.fake().category().build()
    await repository.insert(category)
    const entity = await repository.findById(category.category_id)
    expect(entity.toJSON()).toStrictEqual(category.toJSON())
  })

  it('should find a category by id', async () => {
    let categoryFound = await repository.findById(new Uuid())
    expect(categoryFound).toBeNull()

    const category = Category.fake().category().build()
    await repository.insert(category)
    categoryFound = await repository.findById(category.category_id)
    expect(category.toJSON()).toStrictEqual(categoryFound.toJSON())
  })

  it('should return all categories', async () => {
    const category = Category.fake().category().build()
    await repository.insert(category)
    const categories = await repository.findAll()
    expect(categories).toHaveLength(1)
    expect(JSON.stringify(categories)).toBe(JSON.stringify([category]))
  })

  it('should throw error on update when a entity is not found', async () => {
    const category = Category.fake().category().build()
    await expect(repository.update(category)).rejects.toThrow(
      new NotFoundError(category.category_id.id, Category)
    )
  })

  it('should update a entity', async () => {
    const category = Category.fake().category().build()
    await repository.insert(category)

    category.changeName('Movie updated')
    await repository.update(category)

    const categoryFound = await repository.findById(category.category_id)
    expect(category.toJSON()).toStrictEqual(categoryFound.toJSON())
  })

  it('should throw error on delete when a entity is not found', async () => {
    const categoryId = new Uuid()
    await expect(repository.delete(categoryId)).rejects.toThrow(
      new NotFoundError(categoryId.id, Category)
    )
  })

  it('should delete a entity', async () => {
    const category = Category.fake().category().build()
    await repository.insert(category)

    await repository.delete(category.category_id)

    await expect(repository.findById(category.category_id)).resolves.toBeNull()
  })

  describe('Search method tests', () => {
    it('should only apply paginate when other params are null', async () => {
      const created_at = new Date()
      const categories = Category.fake()
        .categories(16)
        .withName('Movie')
        .withDescription(null)
        .withCreatedAt(created_at)
        .build()
      await repository.bulkInsert(categories)
      const spyToEntity = jest.spyOn(CategoryModelMapper, 'toEntity')

      const searchOutput = await repository.search(new CategorySearchParams())
      expect(searchOutput).toBeInstanceOf(CategorySearchResult)
      expect(spyToEntity).toHaveBeenCalledTimes(15)
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
      })
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(Category)
        expect(item.category_id).toBeDefined()
      })
      const items = searchOutput.items.map((item) => item.toJSON())
      expect(items).toMatchObject(
        new Array(15).fill({
          name: 'Movie',
          description: null,
          is_active: true,
          created_at,
        })
      )
    })

    it('should order by created_at DESC when search params are null', async () => {
      const created_at = new Date()
      const categories = Category.fake()
        .categories(16)
        .withName((index) => `Movie ${index}`)
        .withDescription(null)
        .withCreatedAt((index) => new Date(created_at.getTime() + index))
        .build()
      const searchOutput = await repository.search(new CategorySearchParams())
      const items = searchOutput.items
      ;[...items].reverse().forEach((_item, index) => {
        expect(`Movie ${index}`).toBe(`${categories[index + 1].name}`)
      })
    })
  })
})
