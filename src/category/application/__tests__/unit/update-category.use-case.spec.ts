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

  it('should update a category', async () => {
    const spyUpdate = jest.spyOn(repository, 'update')
    const category = new Category({ name: 'Movie' })
    repository.items = [category]

    let output = await useCase.execute({
      id: category.category_id.id,
      name: 'test',
    })

    expect(spyUpdate).toHaveBeenCalledTimes(1)
    expect(output).toStrictEqual({
      id: category.category_id.id,
      name: 'test',
      description: null,
      is_active: true,
      created_at: category.created_at,
    })

    type Arrange = {
      input: {
        id: string
        name: string
        description?: string | null
        is_active?: boolean
      }
      expected: {
        id: string
        name: string
        description: string | null
        is_active: boolean
        created_at: Date
      }
    }
    const arrange: Arrange[] = [
      {
        input: {
          id: category.category_id.id,
          name: 'test',
          description: 'some description',
        },
        expected: {
          id: category.category_id.id,
          name: 'test',
          description: 'some description',
          is_active: true,
          created_at: category.created_at,
        },
      },
      {
        input: {
          id: category.category_id.id,
          name: 'test',
          is_active: false,
        },
        expected: {
          id: category.category_id.id,
          name: 'test',
          description: 'some description',
          is_active: false,
          created_at: category.created_at,
        },
      },
      {
        input: {
          id: category.category_id.id,
          name: 'test',
        },
        expected: {
          id: category.category_id.id,
          name: 'test',
          description: 'some description',
          is_active: false,
          created_at: category.created_at,
        },
      },
      {
        input: {
          id: category.category_id.id,
          name: 'test',
          is_active: true,
        },
        expected: {
          id: category.category_id.id,
          name: 'test',
          description: 'some description',
          is_active: true,
          created_at: category.created_at,
        },
      },
      {
        input: {
          id: category.category_id.id,
          name: 'test',
          is_active: false,
        },
        expected: {
          id: category.category_id.id,
          name: 'test',
          description: 'some description',
          is_active: false,
          created_at: category.created_at,
        },
      },
    ]

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        ...('name' in i.input && { name: i.input.name }),
        ...('description' in i.input && { description: i.input.description }),
        ...('is_active' in i.input && { is_active: i.input.is_active }),
      })
      expect(output).toStrictEqual({
        id: category.category_id.id,
        name: i.expected.name,
        description: i.expected.description,
        is_active: i.expected.is_active,
        created_at: i.expected.created_at,
      })
    }
  })
})
