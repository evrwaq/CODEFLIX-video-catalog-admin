import { NotFoundError } from '../../../../shared/domain/errors/not-found.error'
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo'
import { setupSequelize } from '../../../../shared/infra/testing/helpers'
import { Category } from '../../../domain/category.entity'
import { CategoryInMemoryRepository } from '../../../infra/db/in-memory/category-in-memory.repository'
import { CategoryModel } from '../../../infra/db/sequelize/category.model'
import { CreateCategoryUseCase } from '../../create-category.use-case'
import { UpdateCategoryUseCase } from '../../update-category.use-case'

describe('UpdateCategoryUseCase Integration Tests', () => {
  let useCase: UpdateCategoryUseCase
  let repository: CategoryInMemoryRepository

  setupSequelize({ models: [CategoryModel] })

  beforeEach(() => {
    repository = new CategoryInMemoryRepository()
    useCase = new UpdateCategoryUseCase(repository)
  })

  it('should throws error when entity not found', async () => {
    const uuid = new Uuid()
    await expect(() =>
      useCase.execute({ id: uuid.id, name: 'fake' })
    ).rejects.toThrow(new NotFoundError(uuid.id, Category))
  })
})
