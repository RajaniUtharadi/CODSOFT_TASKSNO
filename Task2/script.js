/* =========================================
   EXPENSE TRACKER - JAVASCRIPT
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const transactionForm =
    document.getElementById("transactionForm");

const transactionType =
    document.getElementById("transactionType");

const amountInput =
    document.getElementById("amount");

const categoryInput =
    document.getElementById("category");

const dateInput =
    document.getElementById("date");

const descriptionInput =
    document.getElementById("description");

const transactionList =
    document.getElementById("transactionList");

const emptyState =
    document.getElementById("emptyState");

const totalIncome =
    document.getElementById("totalIncome");

const totalExpense =
    document.getElementById("totalExpense");

const currentBalance =
    document.getElementById("currentBalance");

const monthlySavings =
    document.getElementById("monthlySavings");

const searchInput =
    document.getElementById("searchTransaction");

const filterCategory =
    document.getElementById("filterCategory");

const filterType =
    document.getElementById("filterType");

const categoryLegend =
    document.getElementById("categoryLegend");

const chartTotal =
    document.getElementById("chartTotal");

const averageExpense =
    document.getElementById("averageExpense");

const highestExpense =
    document.getElementById("highestExpense");

const lowestExpense =
    document.getElementById("lowestExpense");

const darkMode =
    document.getElementById("darkMode");


/* =========================================
   LOCAL STORAGE
========================================= */

let transactions =
    JSON.parse(
        localStorage.getItem(
            "expenseTransactions"
        )
    ) || [];


/* =========================================
   DEFAULT DATE
========================================= */

const today =
    new Date()
        .toISOString()
        .split("T")[0];

dateInput.value = today;


/* =========================================
   CURRENCY FORMAT
========================================= */

function formatCurrency(amount) {

    return "₹" +
        Number(amount).toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 2
            }
        );
}


/* =========================================
   SAVE TRANSACTIONS
========================================= */

function saveTransactions() {

    localStorage.setItem(
        "expenseTransactions",
        JSON.stringify(transactions)
    );

}


/* =========================================
   ADD TRANSACTION
========================================= */

transactionForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const type =
            transactionType.value;

        const amount =
            Number(amountInput.value);

        const category =
            categoryInput.value;

        const date =
            dateInput.value;

        const description =
            descriptionInput.value.trim();


        /* VALIDATION */

        if (!amount || amount <= 0) {

            alert(
                "Please enter a valid amount."
            );

            amountInput.focus();

            return;
        }


        if (!category) {

            alert(
                "Please select a category."
            );

            categoryInput.focus();

            return;
        }


        if (!date) {

            alert(
                "Please select a date."
            );

            dateInput.focus();

            return;
        }


        /* CREATE TRANSACTION */

        const transaction = {

            id:
                Date.now(),

            type:
                type,

            amount:
                amount,

            category:
                category,

            date:
                date,

            description:
                description ||
                category

        };


        /* ADD TO ARRAY */

        transactions.unshift(
            transaction
        );


        /* SAVE */

        saveTransactions();


        /* RESET FORM */

        transactionForm.reset();

        dateInput.value = today;


        /* UPDATE SCREEN */

        updateApplication();


        alert(
            "Transaction added successfully! 🎉"
        );

    }
);


/* =========================================
   CATEGORY ICONS
========================================= */

function getCategoryIcon(category) {

    const icons = {

        "Salary": "💼",

        "Food & Dining": "🍔",

        "Transport": "🚌",

        "Shopping": "🛍️",

        "Bills & Utilities": "💡",

        "Entertainment": "🎬",

        "Health": "🏥",

        "Education": "🎓",

        "Other": "📌"

    };

    return icons[category] || "💰";
}


/* =========================================
   CATEGORY COLORS
========================================= */

function getCategoryColor(category) {

    const colors = {

        "Salary": "#dcfce7",

        "Food & Dining": "#fee2e2",

        "Transport": "#dbeafe",

        "Shopping": "#fce7f3",

        "Bills & Utilities": "#fef3c7",

        "Entertainment": "#ede9fe",

        "Health": "#cffafe",

        "Education": "#e0e7ff",

        "Other": "#f3f4f6"

    };

    return colors[category] ||
        "#f3f4f6";
}


/* =========================================
   DISPLAY TRANSACTIONS
========================================= */

function displayTransactions() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();

    const selectedCategory =
        filterCategory.value;

    const selectedType =
        filterType.value;


    const filtered =
        transactions.filter(
            transaction => {

                const matchesSearch =

                    transaction.category
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    transaction.description
                        .toLowerCase()
                        .includes(searchText);


                const matchesCategory =

                    selectedCategory === "all"
                    ||
                    transaction.category ===
                    selectedCategory;


                const matchesType =

                    selectedType === "all"
                    ||
                    transaction.type ===
                    selectedType;


                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesType
                );

            }
        );


    transactionList.innerHTML = "";


    if (filtered.length === 0) {

        emptyState.style.display =
            "block";

        return;

    }


    emptyState.style.display =
        "none";


    filtered.forEach(
        transaction => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "transaction-item";


            const icon =
                getCategoryIcon(
                    transaction.category
                );


            const iconColor =
                getCategoryColor(
                    transaction.category
                );


            const amountClass =
                transaction.type === "income"
                    ? "income-amount"
                    : "expense-amount";


            const sign =
                transaction.type === "income"
                    ? "+"
                    : "-";


            const formattedDate =
                new Date(
                    transaction.date +
                    "T00:00:00"
                ).toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );


            item.innerHTML = `

                <div class="transaction-left">

                    <div
                        class="transaction-icon"
                        style="
                            background:
                            ${iconColor};
                        "
                    >
                        ${icon}
                    </div>


                    <div class="transaction-details">

                        <h4>
                            ${escapeHTML(
                                transaction.description
                            )}
                        </h4>

                        <p>
                            ${transaction.category}
                        </p>

                    </div>

                </div>


                <div class="transaction-date">

                    ${formattedDate}

                </div>


                <div class="transaction-right">

                    <div
                        class="
                            transaction-amount
                            ${amountClass}
                        "
                    >

                        ${sign}
                        ${formatCurrency(
                            transaction.amount
                        )}

                    </div>


                    <div
                        class="
                            transaction-actions
                        "
                    >

                        <button
                            class="edit-btn"
                            onclick="
                                editTransaction(
                                    ${transaction.id}
                                )
                            "
                            title="Edit"
                        >
                            ✏️
                        </button>


                        <button
                            class="delete-btn"
                            onclick="
                                deleteTransaction(
                                    ${transaction.id}
                                )
                            "
                            title="Delete"
                        >
                            🗑️
                        </button>

                    </div>

                </div>

            `;


            transactionList.appendChild(
                item
            );

        }
    );

}


/* =========================================
   PREVENT HTML INJECTION
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;
}


/* =========================================
   CALCULATE TOTALS
========================================= */

function updateTotals() {

    let income = 0;

    let expense = 0;


    transactions.forEach(
        transaction => {

            if (
                transaction.type ===
                "income"
            ) {

                income +=
                    transaction.amount;

            } else {

                expense +=
                    transaction.amount;

            }

        }
    );


    const balance =
        income - expense;


    totalIncome.textContent =
        formatCurrency(income);


    totalExpense.textContent =
        formatCurrency(expense);


    currentBalance.textContent =
        formatCurrency(balance);


    monthlySavings.textContent =
        formatCurrency(balance);


    chartTotal.textContent =
        formatCurrency(expense);

}


/* =========================================
   CATEGORY CHART LEGEND
========================================= */

function updateCategoryChart() {

    const expenseTransactions =
        transactions.filter(
            transaction =>
                transaction.type ===
                "expense"
        );


    const categoryTotals = {};


    expenseTransactions.forEach(
        transaction => {

            if (
                !categoryTotals[
                    transaction.category
                ]
            ) {

                categoryTotals[
                    transaction.category
                ] = 0;

            }


            categoryTotals[
                transaction.category
            ] +=
                transaction.amount;

        }
    );


    categoryLegend.innerHTML = "";


    const entries =
        Object.entries(
            categoryTotals
        );


    if (entries.length === 0) {

        categoryLegend.innerHTML = `

            <div
                style="
                    color: var(--muted);
                    font-size: 11px;
                "
            >
                No expense data yet.
            </div>

        `;

        return;

    }


    const colors = [
        "#7c3aed",
        "#ec4899",
        "#3b82f6",
        "#f59e0b",
        "#22c55e",
        "#06b6d4",
        "#ef4444",
        "#8b5cf6"
    ];


    entries.forEach(
        ([category, amount], index) => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "legend-item";


            item.innerHTML = `

                <div
                    class="legend-name"
                >

                    <span
                        class="legend-dot"
                        style="
                            background:
                            ${colors[
                                index %
                                colors.length
                            ]};
                        "
                    ></span>

                    ${category}

                </div>


                <strong>
                    ${formatCurrency(amount)}
                </strong>

            `;


            categoryLegend.appendChild(
                item
            );

        }
    );

}


/* =========================================
   QUICK SUMMARY
========================================= */

function updateQuickSummary() {

    const expenses =
        transactions
            .filter(
                transaction =>
                    transaction.type ===
                    "expense"
            )
            .map(
                transaction =>
                    transaction.amount
            );


    if (expenses.length === 0) {

        averageExpense.textContent =
            "₹0";

        highestExpense.textContent =
            "₹0";

        lowestExpense.textContent =
            "₹0";

        return;

    }


    const total =
        expenses.reduce(
            (sum, value) =>
                sum + value,
            0
        );


    const average =
        total / expenses.length;


    const highest =
        Math.max(...expenses);


    const lowest =
        Math.min(...expenses);


    averageExpense.textContent =
        formatCurrency(
            Math.round(average)
        );


    highestExpense.textContent =
        formatCurrency(highest);


    lowestExpense.textContent =
        formatCurrency(lowest);

}


/* =========================================
   EDIT TRANSACTION
========================================= */

function editTransaction(id) {

    const transaction =
        transactions.find(
            item =>
                item.id === id
        );


    if (!transaction) {
        return;
    }


    transactionType.value =
        transaction.type;


    amountInput.value =
        transaction.amount;


    categoryInput.value =
        transaction.category;


    dateInput.value =
        transaction.date;


    descriptionInput.value =
        transaction.description;


    transactions =
        transactions.filter(
            item =>
                item.id !== id
        );


    saveTransactions();


    updateApplication();


    amountInput.focus();


    alert(
        "Transaction loaded for editing. ✏️"
    );

}


/* =========================================
   DELETE TRANSACTION
========================================= */

function deleteTransaction(id) {

    const transaction =
        transactions.find(
            item =>
                item.id === id
        );


    if (!transaction) {
        return;
    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmDelete) {
        return;
    }


    transactions =
        transactions.filter(
            item =>
                item.id !== id
        );


    saveTransactions();


    updateApplication();

}


/* =========================================
   SEARCH
========================================= */

searchInput.addEventListener(
    "input",
    displayTransactions
);


/* =========================================
   CATEGORY FILTER
========================================= */

filterCategory.addEventListener(
    "change",
    displayTransactions
);


/* =========================================
   TYPE FILTER
========================================= */

filterType.addEventListener(
    "change",
    displayTransactions
);


/* =========================================
   DARK MODE
========================================= */

darkMode.addEventListener(
    "change",
    function () {

        document.body.classList.toggle(
            "dark",
            darkMode.checked
        );


        localStorage.setItem(
            "expenseDarkMode",
            darkMode.checked
        );

    }
);


/* =========================================
   LOAD DARK MODE
========================================= */

const savedDarkMode =
    localStorage.getItem(
        "expenseDarkMode"
    );


if (savedDarkMode === "true") {

    darkMode.checked =
        true;

    document.body.classList.add(
        "dark"
    );

}


/* =========================================
   UPDATE EVERYTHING
========================================= */

function updateApplication() {

    displayTransactions();

    updateTotals();

    updateCategoryChart();

    updateQuickSummary();

}


/* =========================================
   INITIAL LOAD
========================================= */

updateApplication();
/* =========================================
   SIDEBAR NAVIGATION
========================================= */

const sidebarButtons =
    document.querySelectorAll(".nav-item");

const addTransactionSection =
    document.querySelector(".add-transaction");

const transactionsSection =
    document.querySelector(".transactions");

const expenseOverviewSection =
    document.querySelector(".expense-overview");

const quickSummarySection =
    document.querySelector(".quick-summary");

const darkModeSection =
    document.querySelector(".dark-mode");


sidebarButtons.forEach((button, index) => {

    button.addEventListener("click", function () {

        /* Remove active from all buttons */

        sidebarButtons.forEach(item => {
            item.classList.remove("active");
        });


        /* Make clicked button active */

        button.classList.add("active");


        /* Dashboard */

        if (index === 0) {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }


        /* Transactions */

        else if (index === 1) {

            transactionsSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }


        /* Add Transaction */

        else if (index === 2) {

            addTransactionSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });


            setTimeout(() => {

                amountInput.focus();

            }, 600);

        }


        /* Categories */

        else if (index === 3) {

            expenseOverviewSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }


        /* Reports */

        else if (index === 4) {

            quickSummarySection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }


        /* Settings */

        else if (index === 5) {

            darkModeSection.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }

    });

});