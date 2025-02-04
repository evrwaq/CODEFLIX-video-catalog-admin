import { Sequelize } from 'sequelize-typescript'
import { CategoryModel } from '../category.model'
import { CategorySequelizeRepository } from '../category-sequelize.repository'
import { Category } from '../../../../domain/category.entity'
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo'
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error'

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
})
