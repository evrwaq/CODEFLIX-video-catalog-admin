import { Category } from '../../../../domain/category.entity'
import { CategorySearchResult } from '../../../../domain/category.repository'
import { CategoryInMemoryRepository } from '../../../../infra/db/in-memory/category-in-memory.repository'
import { CategoryOutputMapper } from '../../common/category-output'
import { ListCategoriesUseCase } from '../../list-categories.use-case'

describe('ListCategoriesUseCase Unit Tests', () => {
  let useCase: ListCategoriesUseCase
  let repository: CategoryInMemoryRepository

  beforeEach(() => {
    repository = new CategoryInMemoryRepository()
    useCase = new ListCategoriesUseCase(repository)
  })

  test('toOutput method', () => {
    let result = new CategorySearchResult({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
    })
    let output = useCase['toOutput'](result)
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    })

    const category = Category.create({ name: 'Movie' })
    result = new CategorySearchResult({
      items: [category],
      total: 1,
      current_page: 1,
      per_page: 2,
    })

    output = useCase['toOutput'](result)
    expect(output).toStrictEqual({
      items: [category].map(CategoryOutputMapper.toOutput),
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    })
  })
})
