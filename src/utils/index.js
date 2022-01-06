import Customer from "./Customer";
import moment from "moment";
import { MAXDAILYLIMIT, MAXDAILYTRANSACTIONS, MAXWEEKLYLIMIT } from "../config";

// REFER TO YOUTUBE VIDEO WHERE I EXPLAIN EACH OF THESE IN DETAILS

// Function to clean the uploaded data
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

// Algorithm 1
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

// Algorithm 2
export function runTransactions2(objList) {
  var custData = {};
  var ts_history = [];

  for (let i = 0; i < objList.length; i++) {
    var obj = objList[i];

    const { id, customer_id, load_amount, time } = obj;

    var accepted = true;

    if (load_amount > MAXDAILYLIMIT) {
      accepted = false;
    }

    const date = moment.utc(time);

    var daily_ts_amount = load_amount;
    var weekly_ts_amount = load_amount;
    var daily_ts_count = 1;

    if (custData.hasOwnProperty(customer_id)) {
      const last_day = custData[customer_id]["ts_date"];

      if (date.isSame(last_day, "day")) {
        daily_ts_amount += custData[customer_id]["daily_ts_amount"];
        daily_ts_count = custData[customer_id]["daily_ts_count"] + 1;
      }

      if (date.week() == last_day.week()) {
        weekly_ts_amount += custData[customer_id]["weekly_ts_amount"];
      }

      if (
        daily_ts_amount <= MAXDAILYLIMIT &&
        daily_ts_count <= MAXDAILYTRANSACTIONS &&
        weekly_ts_amount <= MAXWEEKLYLIMIT
      ) {
        custData[customer_id] = {
          id,
          ts_date: date,
          daily_ts_amount,
          daily_ts_count,
          weekly_ts_amount,
        };
      } else {
        accepted = false;
      }
    } else {
      if (load_amount <= MAXDAILYLIMIT) {
        custData[customer_id] = {
          id,
          ts_date: date,
          daily_ts_amount: load_amount,
          daily_ts_count: 1,
          weekly_ts_amount: load_amount,
        };
      } else {
        accepted = false;
      }
    }
    var ts = { id, customer_id, accepted };

    ts_history.push(ts);
  }

  return ts_history;
}

// Sort column data
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
