import { Entity } from '../../../../domain/entity'
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
  })
})
