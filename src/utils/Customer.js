import moment from "moment";
import { MAXDAILYLIMIT, MAXDAILYTRANSACTIONS, MAXWEEKLYLIMIT } from "../config";

class Customer {
  constructor(customer_id) {
    this.customerId = customer_id;
    this.dailyTransactionsCount = 0;
    this.dailyTransactionsAmount = 0;
    this.weeklyTransactionsAmount = 0;
    this.latestTransactionDate = moment.utc("1990-01-01");
  }

  updateTransaction(transactionAmount, transactionDate) {
    this.updateNewDay(transactionDate);

    if (
      !this.reachedDailyLimit(transactionAmount) &&
      !this.reachedWeeklyLimit(transactionAmount)
    ) {
      this.updateDailyTransactions(transactionAmount, transactionDate);
      this.updateWeeklyTransactions(transactionAmount, transactionDate);

      return true;
    }

    return false;
  }

  updateDailyTransactions(transactionAmount, transactionDate) {
    this.dailyTransactionsAmount += transactionAmount;
    this.dailyTransactionsCount += 1;
    this.latestTransactionDate = moment.utc(transactionDate);
  }

  updateWeeklyTransactions(transactionAmount, transactionDate) {
    this.weeklyTransactionsAmount += transactionAmount;
    this.latestTransactionDate = moment.utc(transactionDate);
  }

  updateNewDay(transactionDate) {
    const date = moment.utc(transactionDate);

    if (date.isAfter(this.latestTransactionDate, "day")) {
      this.dailyTransactionsCount = 0;
      this.dailyTransactionsAmount = 0;

      if (date.week() > this.latestTransactionDate.week()) {
        this.weeklyTransactionsAmount = 0;
      }
    }
  }

  reachedDailyLimit(transactionAmount) {
    if (
      transactionAmount > MAXDAILYLIMIT ||
      this.dailyTransactionsCount >= MAXDAILYTRANSACTIONS ||
      this.dailyTransactionsAmount > MAXDAILYLIMIT ||
      transactionAmount + this.dailyTransactionsAmount > MAXDAILYLIMIT
    ) {
      return true;
    }

    return false;
  }

  reachedWeeklyLimit(transactionAmount) {
    if (
      transactionAmount > MAXWEEKLYLIMIT ||
      this.weeklyTransactionsAmount > MAXWEEKLYLIMIT ||
      transactionAmount + this.weeklyTransactionsAmount > MAXWEEKLYLIMIT
    ) {
      return true;
    }

    return false;
  }
}

export default Customer;
