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

  test('per_page prop', () => {
    const params = new SearchParams()
    expect(params.per_page).toBe(15)

    const arrange = [
      { per_page: null, expected: 15 },
      { per_page: undefined, expected: 15 },
      { per_page: '', expected: 15 },
      { per_page: 'fake', expected: 15 },
      { per_page: 0, expected: 15 },
      { per_page: -1, expected: 15 },
      { per_page: 5.5, expected: 15 },
      { per_page: true, expected: 15 },
      { per_page: false, expected: 15 },
      { per_page: {}, expected: 15 },
      { per_page: 1, expected: 1 },
      { per_page: 2, expected: 2 },
      { per_page: 10, expected: 10 },
    ]

    arrange.forEach((index) => {
      expect(
        new SearchParams({ per_page: index.per_page as any }).per_page
      ).toBe(index.expected)
    })
  })
})
