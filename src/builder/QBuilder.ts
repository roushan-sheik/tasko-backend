import { Query } from "mongoose";

export class QBuilder<T> {
  public modelQuery: Query<T[], T>;
  private query: Record<string, unknown>;
  private readonly DEFAULT_LIMIT = 10;
  private readonly DEFAULT_SEARCHABLE_FIELDS = ["title"];
  private readonly EXCLUDE_FIELDS = [""];

  // search method
  public search() {}

  // pagination method
  public paginate() {}

  // sort method
  public sort() {}
}
