import { NotFoundError } from '../../../../shared/domain/errors/not-found.error'
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo'
import { setupSequelize } from '../../../../shared/infra/testing/helpers'
import { Category } from '../../../domain/category.entity'
import { CategoryInMemoryRepository } from '../../../infra/db/in-memory/category-in-memory.repository'
import { CategorySequelizeRepository } from '../../../infra/db/sequelize/category-sequelize.repository'
import { CategoryModel } from '../../../infra/db/sequelize/category.model'
import { GetCategoryUseCase } from '../../get-category.use-case'

describe('GetCategoryUseCase Integration Tests', () => {
  let useCase: GetCategoryUseCase
  let repository: CategorySequelizeRepository

  setupSequelize({ models: [CategoryModel] })

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel)
    useCase = new GetCategoryUseCase(repository)
  })

  it('should throws error when category not found', async () => {
    const uuid = new Uuid()
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Category)
    )
  })
})
