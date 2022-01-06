import Customer from "./Customer";

export const cleanData = (file, callback) => {
  const reader = new FileReader();

  let textObj = null;

  reader.onload = async (e) => {
    const text = e.target.result;

    textObj = text.split("\n").reduce((acc, item) => {
      if (!item.length) return acc;

      const _item = JSON.parse(item);

      const load_amount = parseFloat(_item.load_amount.replace("$", ""));

      return [...acc, { ..._item, load_amount }];
    }, []);
    callback?.(textObj);
  };
  reader.readAsText(file);
};

export const runTransactions = (data) => {
  const customer_ids = {};
  const customers = {};

  console.log(data.length);

  const final_output = [];

  data?.map((item) => {
    const { id, customer_id, load_amount, time } = item;

    if (!customer_ids[customer_id]) {
      customer_ids[customer_id] = new Set();
    }

    let customer = null;
    if (!customer_ids[customer_id].has(id)) {
      customer_ids[customer_id].add(id);

      if (!customers[customer_id]) {
        customer = new Customer(customer_id);
        customers[customer_id] = customer;
      } else {
        customer = customers[customer_id];
      }

      const output = { id, customer_id };
      if (customer.updateTransaction(load_amount, time)) {
        output["accepted"] = true;
      } else {
        output["accepted"] = false;
      }

      final_output.push(output);
    }
  });

  return final_output;
};

export const sortData = (data, params) => {
  const column = params[0];
  const order = params[1];
  const type = params[2];

  const _sorted = data.sort((a, b) => {
    const _a = type === "string" ? parseInt(a[column]) : a[column].toString();
    const _b = type === "string" ? parseInt(b[column]) : b[column].toString();

    if (_a > _b) return order ? 1 : -1;
    else return order ? -1 : 1;
  });

  return _sorted;
};
