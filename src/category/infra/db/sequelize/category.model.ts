import { Column, DataType, Model, PrimaryKey } from 'sequelize-typescript'

export class CategoryModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare category_id: string

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string

  @Column({ allowNull: true, type: DataType.TEXT })
  declare description: string

  @Column({ allowNull: false, type: DataType.BOOLEAN })
  declare is_active: boolean

  @Column({ allowNull: false, type: DataType.DATE(3) })
  declare created_at: Date
}
