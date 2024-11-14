import { SearchParams } from '../search-params'

describe('SearchParams Unit Tests', () => {
  test('page prop', () => {
    const params = new SearchParams()
    expect(params.page).toBe(1)

    const arrange = [
      { page: null, expected: 1 },
      { page: undefined, expected: 1 },
      { page: '', expected: 1 },
      { page: 'fake', expected: 1 },
      { page: 0, expected: 1 },
      { page: -1, expected: 1 },
      { page: 5.5, expected: 1 },
      { page: true, expected: 1 },
      { page: false, expected: 1 },
      { page: {}, expected: 1 },
      { page: 1, expected: 1 },
      { page: 2, expected: 2 },
    ]

    arrange.forEach((index) => {
      expect(new SearchParams({ page: index.page as any }).page).toBe(
        index.expected
      )
    })
  })
})
