import {
  PaginationOutput,
  PaginationOutputMapper,
} from '../../../shared/application/pagination-output'
import { IUseCase } from '../../../shared/application/use-case.interface'
import { SortDirection } from '../../../shared/domain/repository/search-params'
import {
  CategoryFilter,
  CategorySearchParams,
  CategorySearchResult,
  ICategoryRepository,
} from '../../domain/category.repository'
import { CategoryOutput, CategoryOutputMapper } from './common/category-output'

export class ListCategoriesUseCase
  implements IUseCase<ListCategoriesInput, ListCategoriesOutput>
{
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(input: ListCategoriesInput): Promise<ListCategoriesOutput> {
    const params = new CategorySearchParams(input)
    const searchResult = await this.categoryRepository.search(params)
    return this.toOutput(searchResult)
  }

  private toOutput(searchResult: CategorySearchResult): ListCategoriesOutput {
    const items = searchResult.items.map((item) => {
      return CategoryOutputMapper.toOutput(item)
    })
    return PaginationOutputMapper.toOutput(items, searchResult)
  }
}

export type ListCategoriesInput = {
  page?: number
  per_page?: number
  sort?: string | null
  sort_dir?: SortDirection | null
  filter?: CategoryFilter | null
}

export type ListCategoriesOutput = PaginationOutput<CategoryOutput>
