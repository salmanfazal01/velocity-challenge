import moment from "moment";
import { MAXDAILYLIMIT, MAXDAILYTRANSACTIONS, MAXWEEKLYLIMIT } from "../config";

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
