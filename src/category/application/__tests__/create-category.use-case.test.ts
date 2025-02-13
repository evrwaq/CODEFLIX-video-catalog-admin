import { Uuid } from '../../../shared/domain/value-objects/uuid.vo'
import { setupSequelize } from '../../../shared/infra/testing/helpers'
import { CategoryInMemoryRepository } from '../../infra/db/in-memory/category-in-memory.repository'
import { CategoryModel } from '../../infra/db/sequelize/category.model'
import { CreateCategoryUseCase } from '../create-category.use-case'

describe('CreateCategoryUseCase Integration Tests', () => {
  let useCase: CreateCategoryUseCase
  let repository: CategoryInMemoryRepository

  setupSequelize({ models: [CategoryModel] })

  beforeEach(() => {
    repository = new CategoryInMemoryRepository()
    useCase = new CreateCategoryUseCase(repository)
  })

  it('should create a category', async () => {
    let output = await useCase.execute({ name: 'test' })
    let entity = await repository.findById(new Uuid(output.id))

    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: 'test',
      description: null,
      is_active: true,
      created_at: entity.created_at,
    })

    output = await useCase.execute({
      name: 'test',
      description: 'some description',
    })
    entity = await repository.findById(new Uuid(output.id))

    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: 'test',
      description: 'some description',
      is_active: true,
      created_at: entity.created_at,
    })
  })
})
