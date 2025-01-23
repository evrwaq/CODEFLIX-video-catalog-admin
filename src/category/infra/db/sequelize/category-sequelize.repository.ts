import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo'
import { Category } from '../../../domain/category.entity'
import { ICategoryRepository } from '../../../domain/category.repository'
import { CategoryModel } from './category.model'

export class CategorySequelizeRepository implements ICategoryRepository {
  sortableFields: string[] = ['name', 'created_at']

  constructor(private categoryModel: typeof CategoryModel) {}

  async insert(entity: Category): Promise<void> {
    await this.categoryModel.create({
      category_id: entity.category_id.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    })
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    await this.categoryModel.bulkCreate(
      entities.map((entity) => ({
        category_id: entity.category_id.id,
        name: entity.name,
        description: entity.description,
        is_active: entity.is_active,
        created_at: entity.created_at,
      }))
    )
  }

  async update(entity: Category): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async delete(category_id: Uuid): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findById(entity_id: Uuid): Promise<Category | null> {
    const model = await this.categoryModel.findByPk(entity_id.id)
    const category = new Category({
      category_id: new Uuid(model.category_id),
      name: model.name,
      description: model.description,
      is_active: model.is_active,
      created_at: model.created_at,
    })
    return category
  }

  async findAll(): Promise<Category[]> {
    throw new Error('Method not implemented.')
  }

  async search(props: CategorySearchParams): Promise<CategorySearchResult> {
    throw new Error('Method not implemented.')
  }

  private formatSort(sort: string, sort_dir: SortDirection) {}

  getEntity(): new (...args: any[]) => Category {
    throw new Error('Method not implemented.')
  }
}
