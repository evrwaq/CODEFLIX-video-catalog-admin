import { Entity } from '../../../../domain/entity'
import { SearchParams } from '../../../../domain/repository/search-params'
import { SearchResult } from '../../../../domain/repository/search-result'
import { Uuid } from '../../../../domain/value-objects/uuid.vo'
import { InMemorySearchableRepository } from '../in-memory.repository'

type StubEntityConstructorProps = {
  entity_id?: Uuid
  name: string
  price: number
}

class StubEntity extends Entity {
  entity_id: Uuid
  name: string
  price: number

  constructor(props: StubEntityConstructorProps) {
    super()
    this.entity_id = props.entity_id ?? new Uuid()
    this.name = props.name
    this.price = +props.price
  }

  toJSON(): { id: string } & StubEntityConstructorProps {
    return {
      id: this.entity_id.id,
      name: this.name,
      price: this.price,
    }
  }
}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<
  StubEntity,
  Uuid
> {
  sortableFields: string[] = ['name']

  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity
  }

  protected async applyFilter(
    items: StubEntity[],
    filter: string | null
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items
    }

    return items.filter((i) => {
      return (
        i.name.toLowerCase().includes(filter.toLocaleLowerCase()) ||
        i.price.toString() === filter
      )
    })
  }
}

describe('InMemorySearchableRepository Unit Tests', () => {
  let repository: StubInMemorySearchableRepository

  beforeEach(() => {
    repository = new StubInMemorySearchableRepository()
  })

  describe('applyFilter method', () => {
    it('should not filter items when filter param is null', async () => {
      const items = [new StubEntity({ name: 'name value', price: 5 })]
      const spyFilterMethod = jest.spyOn(items, 'filter')
      const itemsFiltered = await repository['applyFilter'](items, null)
      expect(itemsFiltered).toEqual(items)
      expect(spyFilterMethod).not.toHaveBeenCalled()
    })

    it('should filter when using a filter param', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 5 }),
        new StubEntity({ name: 'TEST', price: 5 }),
        new StubEntity({ name: 'fake', price: 0 }),
      ]
      const spyFilterMethod = jest.spyOn(items, 'filter')
      let itemsFiltered = await repository['applyFilter'](items, 'TEST')

      expect(itemsFiltered).toEqual([items[0], items[1]])
      expect(spyFilterMethod).toHaveBeenCalledTimes(1)

      itemsFiltered = await repository['applyFilter'](items, '5')
      expect(itemsFiltered).toEqual([items[0], items[1]])
      expect(spyFilterMethod).toHaveBeenCalledTimes(2)

      itemsFiltered = await repository['applyFilter'](items, 'no-filter')
      expect(itemsFiltered).toHaveLength(0)
      expect(spyFilterMethod).toHaveBeenCalledTimes(3)
    })
  })

  describe('applySort method', () => {
    it('should not sort items when sort param is null', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 5 }),
        new StubEntity({ name: 'a', price: 5 }),
      ]

      let itemsSorted = repository['applySort'](items, null, null)
      expect(itemsSorted).toEqual(items)

      itemsSorted = repository['applySort'](items, 'price', 'asc')
      expect(itemsSorted).toEqual(items)
    })

    it('should sort items when using a sort param', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 5 }),
        new StubEntity({ name: 'a', price: 5 }),
        new StubEntity({ name: 'c', price: 5 }),
      ]

      let itemsSorted = repository['applySort'](items, 'name', 'asc')
      expect(itemsSorted).toEqual([items[1], items[0], items[2]])

      itemsSorted = repository['applySort'](items, 'name', 'desc')
      expect(itemsSorted).toEqual([items[2], items[0], items[1]])
    })
  })

  describe('applyPaginate method', () => {
    it('should paginate items', async () => {
      const items = [
        new StubEntity({ name: 'a', price: 5 }),
        new StubEntity({ name: 'b', price: 5 }),
        new StubEntity({ name: 'c', price: 5 }),
        new StubEntity({ name: 'd', price: 5 }),
        new StubEntity({ name: 'e', price: 5 }),
      ]

      let itemsPaginated = repository['applyPagination'](items, 1, 2)
      expect(itemsPaginated).toEqual([items[0], items[1]])

      itemsPaginated = repository['applyPagination'](items, 2, 2)
      expect(itemsPaginated).toEqual([items[2], items[3]])

      itemsPaginated = repository['applyPagination'](items, 3, 2)
      expect(itemsPaginated).toEqual([items[4]])

      itemsPaginated = repository['applyPagination'](items, 4, 2)
      expect(itemsPaginated).toEqual([])
    })
  })

  describe('search method', () => {
    it('should apply only pagination when other params are null', async () => {
      const entity = new StubEntity({ name: 'a', price: 5 })
      const items = Array(16).fill(entity)
      repository.items = items

      const result = await repository.search(new SearchParams())
      expect(result).toEqual(
        new SearchResult({
          items: Array(15).fill(entity),
          total: 16,
          current_page: 1,
          per_page: 15,
        })
      )
    })

    it('should apply pagination and filter', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 5 }),
        new StubEntity({ name: 'a', price: 5 }),
        new StubEntity({ name: 'TEST', price: 5 }),
        new StubEntity({ name: 'TeSt', price: 5 }),
      ]
      repository.items = items

      let result = await repository.search(
        new SearchParams({ page: 1, per_page: 2, filter: 'TEST' })
      )
      expect(result).toEqual(
        new SearchResult({
          items: [items[0], items[2]],
          total: 3,
          current_page: 1,
          per_page: 2,
        })
      )

      result = await repository.search(
        new SearchParams({ page: 2, per_page: 2, filter: 'TEST' })
      )
      expect(result).toEqual(
        new SearchResult({
          items: [items[3]],
          total: 3,
          current_page: 2,
          per_page: 2,
        })
      )
    })
  })
})
