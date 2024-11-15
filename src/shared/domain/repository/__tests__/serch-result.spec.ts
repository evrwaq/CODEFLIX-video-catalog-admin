import { SearchResult } from '../search-result'

describe('SearchResult Unit Tests', () => {
  test('constructor props', () => {
    const result = new SearchResult({
      items: ['entity1', 'entity2'] as any,
      total: 4,
      current_page: 1,
      per_page: 2,
    })

    expect(result.toJSON()).toEqual({
      items: ['entity1', 'entity2'] as any,
      total: 4,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    })
  })
})
