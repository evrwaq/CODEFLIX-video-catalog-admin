import { Sequelize } from 'sequelize-typescript'
import { CategoryModel } from '../category.model'
import { CategorySequelizeRepository } from '../category-sequelize.repository'
import { Category } from '../../../../domain/category.entity'
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo'
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error'
import { CategoryModelMapper } from '../category-model-mapper'
import {
  CategorySearchParams,
  CategorySearchResult,
} from '../../../../domain/category.repository'
import { setupSequelize } from '../../../../../shared/infra/testing/helpers'

describe('CategorySequelizeRepository Integration Test', () => {
  let repository: CategorySequelizeRepository
  setupSequelize({ models: [CategoryModel] })

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel)
  })

  it('should insert a new category', async () => {
    const category = Category.fake().category().build()
    await repository.insert(category)
    const entity = await repository.findById(category.category_id)
    expect(entity.toJSON()).toStrictEqual(category.toJSON())
  })

  it('should find a category by id', async () => {
    let categoryFound = await repository.findById(new Uuid())
    expect(categoryFound).toBeNull()

    const category = Category.fake().category().build()
    await repository.insert(category)
    categoryFound = await repository.findById(category.category_id)
    expect(category.toJSON()).toStrictEqual(categoryFound.toJSON())
  })

  it('should return all categories', async () => {
    const category = Category.fake().category().build()
    await repository.insert(category)
    const categories = await repository.findAll()
    expect(categories).toHaveLength(1)
    expect(JSON.stringify(categories)).toBe(JSON.stringify([category]))
  })

  it('should throw error on update when a entity is not found', async () => {
    const category = Category.fake().category().build()
    await expect(repository.update(category)).rejects.toThrow(
      new NotFoundError(category.category_id.id, Category)
    )
  })

  it('should update a entity', async () => {
    const category = Category.fake().category().build()
    await repository.insert(category)

    category.changeName('Movie updated')
    await repository.update(category)

    const categoryFound = await repository.findById(category.category_id)
    expect(category.toJSON()).toStrictEqual(categoryFound.toJSON())
  })

  it('should throw error on delete when a entity is not found', async () => {
    const categoryId = new Uuid()
    await expect(repository.delete(categoryId)).rejects.toThrow(
      new NotFoundError(categoryId.id, Category)
    )
  })

  it('should delete a entity', async () => {
    const category = Category.fake().category().build()
    await repository.insert(category)

    await repository.delete(category.category_id)

    await expect(repository.findById(category.category_id)).resolves.toBeNull()
  })

  describe('Search method tests', () => {
    it('should only apply pagination when other params are null', async () => {
      const created_at = new Date()
      const categories = Category.fake()
        .categories(16)
        .withName('Movie')
        .withDescription(null)
        .withCreatedAt(created_at)
        .build()
      await repository.bulkInsert(categories)
      const spyToEntity = jest.spyOn(CategoryModelMapper, 'toEntity')

      const searchOutput = await repository.search(new CategorySearchParams())
      expect(searchOutput).toBeInstanceOf(CategorySearchResult)
      expect(spyToEntity).toHaveBeenCalledTimes(15)
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
      })
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(Category)
        expect(item.category_id).toBeDefined()
      })
      const items = searchOutput.items.map((item) => item.toJSON())
      expect(items).toMatchObject(
        new Array(15).fill({
          name: 'Movie',
          description: null,
          is_active: true,
          created_at,
        })
      )
    })

    it('should order by created_at DESC when search params are null', async () => {
      const created_at = new Date()
      const categories = Category.fake()
        .categories(16)
        .withName((index) => `Movie ${index}`)
        .withDescription(null)
        .withCreatedAt((index) => new Date(created_at.getTime() + index))
        .build()
      const searchOutput = await repository.search(new CategorySearchParams())
      const items = searchOutput.items
      ;[...items].reverse().forEach((_item, index) => {
        expect(`Movie ${index}`).toBe(`${categories[index + 1].name}`)
      })
    })

    it('should apply pagination and filter', async () => {
      const categories = [
        Category.fake()
          .category()
          .withName('test')
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
        Category.fake()
          .category()
          .withName('a')
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        Category.fake()
          .category()
          .withName('TEST')
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        Category.fake()
          .category()
          .withName('TeSt')
          .withCreatedAt(new Date(new Date().getTime() + 2000))
          .build(),
      ]

      await repository.bulkInsert(categories)

      let searchOutput = await repository.search(
        new CategorySearchParams({
          page: 1,
          per_page: 2,
          filter: 'TEST',
        })
      )
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategorySearchResult({
          items: [categories[0], categories[2]],
          total: 3,
          current_page: 1,
          per_page: 2,
        }).toJSON(true)
      )

      searchOutput = await repository.search(
        new CategorySearchParams({
          page: 2,
          per_page: 2,
          filter: 'TEST',
        })
      )
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategorySearchResult({
          items: [categories[3]],
          total: 3,
          current_page: 2,
          per_page: 2,
        }).toJSON(true)
      )
    })

    it('should apply pagination and sort', async () => {
      expect(repository.sortableFields).toStrictEqual(['name', 'created_at'])

      const categories = [
        Category.fake().category().withName('b').build(),
        Category.fake().category().withName('a').build(),
        Category.fake().category().withName('d').build(),
        Category.fake().category().withName('e').build(),
        Category.fake().category().withName('c').build(),
      ]
      await repository.bulkInsert(categories)

      const arrange = [
        {
          params: new CategorySearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
          }),
          result: new CategorySearchResult({
            items: [categories[1], categories[0]],
            total: 5,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          params: new CategorySearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
          }),
          result: new CategorySearchResult({
            items: [categories[4], categories[2]],
            total: 5,
            current_page: 2,
            per_page: 2,
          }),
        },
        {
          params: new CategorySearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
          }),
          result: new CategorySearchResult({
            items: [categories[3], categories[2]],
            total: 5,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          params: new CategorySearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
          }),
          result: new CategorySearchResult({
            items: [categories[4], categories[0]],
            total: 5,
            current_page: 2,
            per_page: 2,
          }),
        },
      ]

      for (const index of arrange) {
        const result = await repository.search(index.params)
        expect(result.toJSON(true)).toMatchObject(index.result.toJSON(true))
      }
    })

    describe('should search using filter, sort and pagination', () => {
      const categories = [
        Category.fake().category().withName('test').build(),
        Category.fake().category().withName('a').build(),
        Category.fake().category().withName('TEST').build(),
        Category.fake().category().withName('e').build(),
        Category.fake().category().withName('TeSt').build(),
      ]

      const arrange = [
        {
          search_params: new CategorySearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
            filter: 'TEST',
          }),
          search_result: new CategorySearchResult({
            items: [categories[2], categories[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          search_params: new CategorySearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            filter: 'TEST',
          }),
          search_result: new CategorySearchResult({
            items: [categories[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
          }),
        },
      ]

      beforeEach(async () => {
        await repository.bulkInsert(categories)
      })

      test.each(arrange)(
        'when value is $search_params',
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params)
          expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true))
        }
      )
    })
  })
})
