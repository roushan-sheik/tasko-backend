import { FilterQuery, Query } from "mongoose";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  private query: Record<string, unknown>;
  private readonly DEFAULT_LIMIT = 10;
  private readonly DEFAULT_SEARCHABLE_FIELDS = ["title"];
  private readonly EXCLUDE_FIELDS = [
    "searchTerm",
    "limit",
    "page",
    "sortBy",
    "fields",
  ];

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.query = query;
    this.modelQuery = modelQuery;
  }

  //* Search Method
  public search(searchableFields: string[] = this.DEFAULT_SEARCHABLE_FIELDS) {
    const searchTerm = (this.query.searchTerm as string) || "";

    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field: string) => ({
          [field]: { $regex: searchTerm, $options: "is" },
        })) as FilterQuery<T>[],
      });
    }
    return this;
  }

  //* Pagination Method
  public paginate() {
    const limit = Number(this.query.limit) || this.DEFAULT_LIMIT;
    const page = Number(this.query.page) || 1;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  //* Sorting Method
  public sort() {
    const sortBy = (this.query.sortBy as string) || "";
    this.modelQuery = this.modelQuery.sort(sortBy);
    return this;
  }

  //* Field Selection Method
  public fields() {
    const fields = (this.query.fields as string)?.split(",").join(" ");
    if (fields) {
      this.modelQuery = this.modelQuery.select(fields);
    }
    return this;
  }

  //* Filter Method
  public filter(excludeFields: string[] = this.EXCLUDE_FIELDS) {
    const filteredQuery = { ...this.query };
    excludeFields.forEach((field) => delete filteredQuery[field]);
    this.modelQuery = this.modelQuery.find(filteredQuery as FilterQuery<T>);
    return this;
  }
}

// ব্যবহার উদাহরণ:
// const queryBuilder = new QueryBuilder(Movie.find({}), query);
// queryBuilder.search(['title', 'genre']).paginate().sort().fields().filter();
