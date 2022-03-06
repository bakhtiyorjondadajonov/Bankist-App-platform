"use strict";
console.log("Bismillahir Rohmanir Rohiym");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

const account1 = {
  owner: "Bakhtiyorjon Dadajonov",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "ko-KR", // de-DE
};

const account2 = {
  owner: "MuhammadMustafo Omonov",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2021-12-03T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".time");

const containerApp = document.querySelector(".main__app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".operations_btn--transfer");
const btnLoan = document.querySelector(".operations_btn--loan");
const btnClose = document.querySelector(".operations_btn--close");
const btnSort = document.querySelector(".btn_sort");

const inputLoginUsername = document.querySelector(".login__user--input");
const inputLoginPin = document.querySelector(".login__user--pin");
const inputTransferTo = document.querySelector(
  ".input_operations--transfer-ac"
);
const inputTransferAmount = document.querySelector(
  ".input_operations--transfer-amount"
);
const inputLoanAmount = document.querySelector(".form__input_numb--loan");
const inputCloseUsername = document.querySelector(
  ".input_operations--close-ac"
);
const inputClosePin = document.querySelector(".input_operations--close-pin");

/////////////////////////////////////////////////
// Functions
//----------FORMATTING DATES----------//
const timerLogOut = () => {
  let time = 100;
  const tick = () => {
    let min = String(Math.trunc(time / 60)).padStart(2, 0);
    let seconds = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${seconds}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }
    time--;
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
let intervalID;
const dateFormatting = function (account, index) {
  const date = Intl.DateTimeFormat(account.locale, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(account.movementsDates[index]));
  const diffrence = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000 / 60 / 60 / 24
  );
  let displayDate;
  if (diffrence === 0) {
    displayDate = "Today";
  } else if (diffrence === 1) {
    displayDate = "Yesterday";
  } else if (diffrence > 1 && diffrence < 7) {
    displayDate = `${diffrence + 1} days ago`;
  } else {
    displayDate = date;
  }
  return displayDate;
};
//---------NUMBERS DISPLAY---------//
const numberChangerFn = (account, number) => {
  const newNumber = Intl.NumberFormat(account.locale, {
    style: "currency",
    currency: account.currency,
  }).format(number.toFixed(2));
  return newNumber;
};

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = "";
  const movements = account.movements;
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    let displayDate = dateFormatting(account, i);
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${numberChangerFn(account, mov)}</div>
        </div>
      `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${numberChangerFn(acc, acc.balance)}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${numberChangerFn(acc, incomes)}`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${numberChangerFn(acc, Math.abs(out))}`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${numberChangerFn(acc, interest)}`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount;

btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    const newDate = Intl.DateTimeFormat(currentAccount.locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date());

    labelDate.textContent = `${newDate}`;
    const hour = new Date().getHours();
    console.log("hour: ", hour);
    if (hour > 6 && hour < 12) {
      labelWelcome.textContent = `Good Morning, ${
        currentAccount.owner.split(" ")[0]
      }`;
    } else if (hour > 12 && hour < 16) {
      labelWelcome.textContent = `Good Afternoon, ${
        currentAccount.owner.split(" ")[0]
      }`;
    } else if ((hour > 16 || hour >= 0) && hour < 24) {
      labelWelcome.textContent = `Good Evening, ${
        currentAccount.owner.split(" ")[0]
      }`;
    }
    containerApp.style.opacity = 1;
    if (intervalID) clearInterval(intervalID);
    intervalID = timerLogOut();

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  clearInterval(intervalID);
  intervalID = timerLogOut();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    const now = new Date().toISOString();
    currentAccount.movementsDates.push(now);
    receiverAcc.movementsDates.push(now);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  clearInterval(intervalID);
  intervalID = timerLogOut();
  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    // Add movement
    currentAccount.movements.push(amount);
    const now = new Date().toISOString();
    currentAccount.movementsDates.push(now);
    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  clearInterval(intervalID);

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
