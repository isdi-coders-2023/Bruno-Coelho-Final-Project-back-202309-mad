export interface Repository<X extends { id: unknown }> {
  getAll(): Promise<X[]>;
  getById(_id: X['id']): Promise<X>;

  search(_typeToSearch: string): Promise<X[]>;
  create(_newItem: Omit<X, 'id'>): Promise<X>;
  update(_id: X['id'], _updatedItem: Partial<X>): Promise<X>;
  delete(_userID: string, _id: X['id']): Promise<void>;
}
