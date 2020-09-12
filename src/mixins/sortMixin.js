import { isArray, orderBy } from "lodash";

const gradeOrders = "一二三四五六七碩博";

export const sortMixin = {
  methods: {
    customOrderBy: (collection, iteratees = [], orders = []) => {
      if (!isArray(iteratees)) iteratees = [iteratees];
      if (iteratees.includes("name")) {
        const index = iteratees.indexOf("name");

        iteratees.splice(
          index,
          0,
          ({ name }) =>
            gradeOrders.indexOf(name[0]) * 10 + gradeOrders.indexOf(name[1])
        );
        iteratees.splice(index + 1, 1, ({ name }) => name.split("- ")[1]);

        if (isArray(orders)) orders.splice(index, 0, orders[index]);
        else orders = [orders, orders];
      }

      return orderBy(
        collection,
        iteratees,
        orders.map(order => (order ? "asc" : "desc"))
      );
    }
  }
};
