import { Category } from '../../../domain/category.entity'

export class CategoryOutputMapper {
  static toOutput(entity: Category): CategoryOutput {
    const { category_id, ...otherProps } = entity.toJSON()
    return {
      id: entity.category_id.id,
      ...otherProps,
    }
  }
}

export type CategoryOutput = {
  id: string
  name: string
  description: string | null
  is_active: boolean
  created_at: Date
}
