import { Sequelize } from 'sequelize-typescript'
import { CategoryModel } from '../category.model'
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo'
import { CategoryModelMapper } from '../category-model-mapper'
import { EntityValidationError } from '../../../../domain/validators/validation.error'

describe('CategoryModelMapper Integration Tests', () => {
  let sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory',
      models: [CategoryModel],
      logging: false,
    })
    await sequelize.sync({ force: true })
  })

  it('should throw error when category is invalid', () => {
    const model = CategoryModel.build({
      category_id: new Uuid().toString(),
    })
    try {
      CategoryModelMapper.toEntity(model)
      fail(
        'The category is valid, but it needs to throw a EntityValidationError'
      )
    } catch (error) {
      expect(error).toBeInstanceOf(EntityValidationError)
      expect((error as EntityValidationError).error).toMatchObject({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      })
    }
  })
})
