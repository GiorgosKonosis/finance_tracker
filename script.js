"use strict";

const butInput = document.querySelector(".button");
const th1 = document.querySelector("#amount");
const th2 = document.querySelector("#date");
const th3 = document.querySelector("#category");
const th4 = document.querySelector("#description");
const tbody = document.querySelector(".transactions");
const income = document.querySelector("#total-income");
const expense = document.querySelector("#total-expenses");
const balance = document.querySelector("#balance");
const btnSort = document.querySelector(".sort");
let editIndex = null;
const user = {
  name: "Giorgos",
  locale: "en-EU",
  currency: "EUR",
};

// empty array to fill with transaction objects
const transactions = [];
const transactionList = () => {
  //creating new object based on the values user provided
  const amount = parseFloat(th1.value);
  const date = th2.value;
  const category = th3.value;
  const description = th4.value;

  if (amount != 0 && amount && date && category && description) {
    const newTransaction = {
      amount: amount,
      date: date,
      category: category,
      description: description,
    };
    if (editIndex) {
      transactions[editIndex] = newTransaction;
      editIndex = null;
    }
    //Adding a new object into transactions array
    else transactions.push(newTransaction);

    updateTotals();

    renderTransactions(transactions);

    th1.value = th2.value = th3.value = th4.value = "";
  }
};

const renderTransactions = (trans) => {
  //clear existing rows
  tbody.innerHTML = "";
  //adding a rows
  trans.forEach((transaction, i) => {
    const html = `
      <tr class="transactions">
         <td class="td1" >${currencyConversion(transaction.amount)}</td>
         <td class="td2">${transaction.date}</td>
         <td class="td3">${transaction.category}</td>
         <td class="td4">${transaction.description}</td>
         <td class="td5">
                   <button class="edit" data-index=${i}>Edit</button>
                  <button class="delete" data-index=${i}>Delete</button>
         </td>
       </tr>`;

    tbody.insertAdjacentHTML("beforeend", html);
    document
      .querySelectorAll(".edit")
      .forEach((button) => button.addEventListener("click", editFunction));
    document
      .querySelectorAll(".delete")
      .forEach((button) => button.addEventListener("click", deleteFunction));
  });
};

const deleteFunction = (e) => {
  const index = e.target.dataset.index;
  transactions.splice(index, 1);
  updateTotals();
  renderTransactions(transactions);
};

const editFunction = (e) => {
  const index = e.target.dataset.index;
  const transaction = transactions[index];

  th1.value = transaction.amount;
  th2.value = transaction.date;
  th3.value = transaction.category;
  th4.value = transaction.description;

  editIndex = index;
};

const updateTotals = () => {
  //adding totals and balance
  const totalIncome = calcTotalIncome(transactions);
  const totalExpenses = calcTotalExpenses(transactions);
  const balanceAmount = calcBalance(totalIncome, totalExpenses);

  income.textContent = currencyConversion(totalIncome);
  expense.textContent = currencyConversion(totalExpenses);
  balance.textContent = currencyConversion(balanceAmount);
};

butInput.addEventListener("click", (e) => {
  e.preventDefault();
  transactionList();
});
// Adding currency on the amounts
const currencyConversion = (value) => {
  return new Intl.NumberFormat(user.locale, {
    style: "currency",
    currency: user.currency,
  }).format(value);
};

// functions to calculate total income/expenses and balance
const calcTotalIncome = (trans) => {
  return trans.reduce(
    (total, trans) =>
      trans.category === "income" ? total + trans.amount : total,
    0
  );
};

const calcTotalExpenses = (trans) => {
  return trans.reduce(
    (total, trans) =>
      trans.category != "income" ? total + trans.amount : total,
    0
  );
};

const calcBalance = (income, expenses) => income - expenses;
// sort the Transaction List
let sorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  sorted = !sorted;

  const sortedTransactions = transactions
    .slice()
    .sort((a, b) => a.amount - b.amount);
  if (!sorted) {
    sortedTransactions.reverse();
  }
  renderTransactions(sortedTransactions);
});
