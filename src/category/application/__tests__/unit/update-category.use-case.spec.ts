import { NotFoundError } from '../../../../shared/domain/errors/not-found.error'
import {
  InvalidUuidError,
  Uuid,
} from '../../../../shared/domain/value-objects/uuid.vo'
import { Category } from '../../../domain/category.entity'
import { CategoryInMemoryRepository } from '../../../infra/db/in-memory/category-in-memory.repository'
import { UpdateCategoryUseCase } from '../../update-category.use-case'

describe('UpdateCategoryUseCase Unit Tests', () => {
  let useCase: UpdateCategoryUseCase
  let repository: CategoryInMemoryRepository

  beforeEach(() => {
    repository = new CategoryInMemoryRepository()
    useCase = new UpdateCategoryUseCase(repository)
  })

  it('should throws error when entity not found', async () => {
    await expect(() =>
      useCase.execute({ id: 'fake id', name: 'fake' })
    ).rejects.toThrow(new InvalidUuidError())

    const uuid = new Uuid()

    await expect(() =>
      useCase.execute({ id: uuid.id, name: 'fake' })
    ).rejects.toThrow(new NotFoundError(uuid.id, Category))
  })
})
