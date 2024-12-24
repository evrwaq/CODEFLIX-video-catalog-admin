import { Category } from '../../domain/category.entity'
import { CategoryInMemoryRepository } from './category-in-memory.repository'

describe('CategoryInMemoryRepository', () => {
  let repository: CategoryInMemoryRepository

  beforeEach(() => {
    repository = new CategoryInMemoryRepository()
  })

  it('should not filter items when filter is null', async () => {
    const items = [Category.fake().category().build()]
    const filterSpy = jest.spyOn(items, 'filter')

    const itemsFiltered = await repository['applyFilter'](items, null)

    expect(filterSpy).not.toHaveBeenCalled()
    expect(itemsFiltered).toEqual(items)
  })

  it('should filter items when using filter parameter', async () => {
    const items = [
      Category.fake().category().withName('test').build(),
      Category.fake().category().withName('TEST').build(),
      Category.fake().category().withName('fake').build(),
    ]
    const filterSpy = jest.spyOn(items, 'filter')

    const itemsFiltered = await repository['applyFilter'](items, 'TEST')

    expect(filterSpy).toHaveBeenCalledTimes(1)
    expect(itemsFiltered).toEqual([items[0], items[1]])
  })

  it('should sort by created_at when sort param is null', async () => {
    const created_at = new Date()
    const items = [
      Category.fake()
        .category()
        .withName('test')
        .withCreatedAt(created_at)
        .build(),
      Category.fake()
        .category()
        .withName('TEST')
        .withCreatedAt(new Date(created_at.getTime() + 100))
        .build(),
      Category.fake()
        .category()
        .withName('fake')
        .withCreatedAt(new Date(created_at.getTime() + 200))
        .build(),
    ]

    const itemsSorted = repository['applySort'](items, null, null)

    expect(itemsSorted).toEqual([items[2], items[1], items[0]])
  })

  it('should sort by name', async () => {
    const items = [
      Category.fake().category().withName('c').build(),
      Category.fake().category().withName('b').build(),
      Category.fake().category().withName('a').build(),
    ]

    let itemsSorted = repository['applySort'](items, 'name', 'asc')
    expect(itemsSorted).toEqual([items[2], items[1], items[0]])

    itemsSorted = repository['applySort'](items, 'name', 'desc')
    expect(itemsSorted).toEqual([items[0], items[1], items[2]])
  })
})
