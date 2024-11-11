import { Entity } from '../../domain/entity'
import { NotFoundError } from '../../domain/errors/not-found.error'
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
    return {
      entity_id: this.entity_id.id,
      name: this.name,
      price: this.price,
    }
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

  test('Should bulk insert entities', async () => {
    const entities = [
      new StubEntity({
        entity_id: new Uuid(),
        name: 'Test',
        price: 100,
      }),
      new StubEntity({
        entity_id: new Uuid(),
        name: 'Test',
        price: 100,
      }),
    ]

    await repository.bulkInsert(entities)

    expect(repository.items.length).toBe(2)
    expect(repository.items[0]).toBe(entities[0])
    expect(repository.items[1]).toBe(entities[1])
  })

  test('Should return all entities', async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: 'Test',
      price: 100,
    })
    await repository.insert(entity)

    const entities = await repository.findAll()

    expect(entities).toEqual([entity])
  })

  test('Should throws error on update when entity not found', async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: 'Test',
      price: 100,
    })

    expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.entity_id, StubEntity)
    )
  })

  test('Should updates an entity', async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: 'Test',
      price: 100,
    })
    await repository.insert(entity)

    const entityUpdated = new StubEntity({
      entity_id: entity.entity_id,
      name: 'Updated',
      price: 1,
    })
    await repository.update(entityUpdated)

    expect(entityUpdated.toJSON()).toEqual(repository.items[0].toJSON())
  })

  test('Should throws error on delete when entity not found', async () => {
    const uuid = new Uuid()
    await expect(repository.delete(uuid)).rejects.toThrow(
      new NotFoundError(uuid.id, StubEntity)
    )
  })

  test('Should delete an entity', async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: 'Test',
      price: 100,
    })
    await repository.insert(entity)

    await repository.delete(entity.entity_id)

    expect(repository.items).toHaveLength(0)
  })
})
