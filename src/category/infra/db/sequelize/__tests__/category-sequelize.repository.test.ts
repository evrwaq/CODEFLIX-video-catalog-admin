import { Sequelize } from 'sequelize-typescript'
import { CategoryModel } from '../category.model'
import { CategorySequelizeRepository } from '../category-sequelize.repository'
import { Category } from '../../../../domain/category.entity'

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
})
