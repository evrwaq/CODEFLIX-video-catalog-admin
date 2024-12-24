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

  it('should sort by created_at when sort param is null', async () => {
    const created_at = new Date()
    const items = [
      new Category({ name: 'test', created_at }),
      new Category({
        name: 'TEST',
        created_at: new Date(created_at.getTime() + 100),
      }),
      new Category({
        name: 'fake',
        created_at: new Date(created_at.getTime() + 200),
      }),
    ]

    const itemsSorted = repository['applySort'](items, null, null)

    expect(itemsSorted).toEqual([items[2], items[1], items[0]])
  })
})
