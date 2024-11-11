import { Entity } from '../../domain/entity'
import { ValueObject } from '../../domain/value-object'
import { Uuid } from '../../domain/value-objects/uuid.vo'
import { InMemoryRepository } from './in-memory.repository'

type StubEntityConstructor = {
  entity_id?: Uuid
  name: string
  price: number
}

class StubEntity extends Entity {
  entity_id: Uuid
  name: string
  price: number

  constructor(props: StubEntityConstructor) {
    super()
    this.entity_id = props.entity_id || new Uuid()
    this.price = props.price
  }

  toJSON() {
    throw new Error('Method not implemented.')
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity
  }
}

describe('InMemoryRepository Unit Tests', () => {
  let repository: StubInMemoryRepository

  beforeEach(() => {
    repository = new StubInMemoryRepository()
  })

  test('Should insert a new entity', async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: 'Test',
      price: 100,
    })

    await repository.insert(entity)

    expect(repository.items.length).toBe(1)
    expect(repository.items[0]).toBe(entity)
  })
})
