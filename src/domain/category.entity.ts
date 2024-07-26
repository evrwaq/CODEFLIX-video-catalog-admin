export type CategoryConstructorProps = {
  category_id: string;
  name: string;
  description?: string | null;
  is_active?: boolean;
  created_at?: Date;
}

export class Category {
  category_id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;

  constructor(props: CategoryConstructorProps) {
    this.category_id = props.category_id;
    this.name = props.name;
    this.description = props.description ?? null;
    this.is_active = props.is_active ?? true;
    this.created_at = props.created_at ?? new Date();
  }
}
