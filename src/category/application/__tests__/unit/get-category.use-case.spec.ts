import { NotFoundError } from '../../../../shared/domain/errors/not-found.error'
import {
  InvalidUuidError,
  Uuid,
} from '../../../../shared/domain/value-objects/uuid.vo'
import { Category } from '../../../domain/category.entity'
import { CategoryInMemoryRepository } from '../../../infra/db/in-memory/category-in-memory.repository'
import { GetCategoryUseCase } from '../../get-category.use-case'

describe('GetCategoryUseCase Unit Tests', () => {
  let useCase: GetCategoryUseCase
  let repository: CategoryInMemoryRepository

  beforeEach(() => {
    repository = new CategoryInMemoryRepository()
    useCase = new GetCategoryUseCase(repository)
  })

  it('should throws error when category not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(
      new InvalidUuidError()
    )

    const uuid = new Uuid()
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Category)
    )
  })
})
