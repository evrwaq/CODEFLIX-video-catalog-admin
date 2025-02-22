import { NotFoundError } from '../../../../shared/domain/errors/not-found.error'
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo'
import { setupSequelize } from '../../../../shared/infra/testing/helpers'
import { Category } from '../../../domain/category.entity'
import { CategoryInMemoryRepository } from '../../../infra/db/in-memory/category-in-memory.repository'
import { CategoryModel } from '../../../infra/db/sequelize/category.model'
import { DeleteCategoryUseCase } from '../../delete-category.use-case'

describe('DeleteCategoryUseCase Integration Tests', () => {
  let useCase: DeleteCategoryUseCase
  let repository: CategoryInMemoryRepository

  setupSequelize({ models: [CategoryModel] })

  beforeEach(() => {
    repository = new CategoryInMemoryRepository()
    useCase = new DeleteCategoryUseCase(repository)
  })

  it('should throws error when entity not found', async () => {
    const uuid = new Uuid()
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Category)
    )
  })

  it('should delete a category', async () => {
    const category = Category.fake().category().build()
    await repository.insert(category)
    await useCase.execute({
      id: category.category_id.id,
    })
    await expect(repository.findById(category.category_id)).resolves.toBeNull()
  })
})
