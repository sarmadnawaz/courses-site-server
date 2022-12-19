class APIFeatures {
  constructor(query, queryString) {
    (this.query = query), (this.queryString = queryString);
  }
  search() {
    if (this.queryString.search) {
      const { search } = this.queryString;
      const query = {
        title: { $regex: `${search}`, $options: "i" },
      };
      this.query = this.query.find(query);
    }
    return this;
  }
  filter() {
    if (this.queryString.category) {
      const { category } = this.queryString;
      const query = { category };
      this.query.find(query);
    }
    return this;
  }
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.page * 1 || 10;
    const skip = (page - 1) * limit;
    this.query.skip(skip).limit(limit);
    return this;
  }
}

export default APIFeatures;
