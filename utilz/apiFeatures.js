class APIFeatures {
  constructor(query, totalDocQuery, queryString) {
    (this.query = query),
      (this.queryString = queryString),
      (this.totalDocQuery = totalDocQuery.countDocuments());
  }
  sanitize() {
    const allowedQueries = ["language", "search", "topic", "category", "page"];
    Object.keys(this.queryString).forEach((query) => {
      if (!allowedQueries.includes(query)) {
        delete this.queryString[query];
      }
    });
    return this;
  }
  search() {
    if (this.queryString.search) {
      const { search } = this.queryString;
      const query = {
        title: { $regex: `${search}`, $options: "i" },
      };
      this.query = this.query.find(query);
      this.totalDocQuery = this.totalDocQuery.countDocuments(query);
    }
    return this;
  }
  filter() {
    if (Object.keys(this.queryString).length) {
      const { category, topic, language } = this.queryString;
      const queries = { category, topic, language };
      Object.keys(queries).forEach((query) => {
        if (!queries[query]) {
          delete queries[query];
        }
      });
      this.query = this.query.find(queries);
      this.totalDocQuery = this.totalDocQuery.countDocuments(queries);
    }
    return this;
  }
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query.skip(skip).limit(limit);
    return this;
  }
}

export default APIFeatures;
