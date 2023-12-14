export interface Repository<X extends { id: unknown }> {
  getAll(): Promise<X[]>;
  getById(_id: X['id']): Promise<X>;
  search(_typeToSearch: string): Promise<X[]>;
  create(_newItem: Omit<X, 'id'>): Promise<X>;
  delete(_userID: string, _id: X['id']): Promise<void>;
  update(_id: X['id'], _updatedItem: Partial<X>): Promise<X>;
  getByPage(_typeToSearch: string, _page: string): Promise<X[]>;
}
