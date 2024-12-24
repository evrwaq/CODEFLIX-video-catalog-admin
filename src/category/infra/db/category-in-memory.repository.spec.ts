import { Category } from '../../domain/category.entity'
import { CategoryInMemoryRepository } from './category-in-memory.repository'

describe('CategoryInMemoryRepository', () => {
  let repository: CategoryInMemoryRepository

  beforeEach(() => {
    repository = new CategoryInMemoryRepository()
  })

  it('should not filter items when filter is null', async () => {
    const items = [Category.create({ name: 'test' })]
    const filterSpy = jest.spyOn(items, 'filter')

    const itemsFiltered = await repository['applyFilter'](items, null)

    expect(filterSpy).not.toHaveBeenCalled()
    expect(itemsFiltered).toEqual(items)
  })

  it('should filter items when using filter parameter', async () => {
    const items = [
      new Category({ name: 'test' }),
      new Category({ name: 'TEST' }),
      new Category({ name: 'fake' }),
    ]
    const filterSpy = jest.spyOn(items, 'filter')

    const itemsFiltered = await repository['applyFilter'](items, 'TEST')

    expect(filterSpy).toHaveBeenCalledTimes(1)
    expect(itemsFiltered).toEqual([items[0], items[1]])
  })
})
