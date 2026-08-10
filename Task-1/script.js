/* =========================
   TASK DATA
========================= */

let tasks =
    JSON.parse(
        localStorage.getItem("taskifyTasks")
    ) || [];


/* =========================
   ELEMENTS
========================= */

const taskInput =
    document.getElementById("taskInput");

const categoryInput =
    document.getElementById("categoryInput");

const priorityInput =
    document.getElementById("priorityInput");

const dateInput =
    document.getElementById("dateInput");

const addTaskBtn =
    document.getElementById("addTaskBtn");

const tasksContainer =
    document.getElementById("tasksContainer");

const emptyState =
    document.getElementById("emptyState");

const errorMessage =
    document.getElementById("errorMessage");

const searchInput =
    document.getElementById("searchInput");

const filterCategory =
    document.getElementById("filterCategory");

const filterPriority =
    document.getElementById("filterPriority");

const statusFilter =
    document.getElementById("statusFilter");


/* =========================
   SAVE TASKS
========================= */

function saveTasks() {

    localStorage.setItem(
        "taskifyTasks",
        JSON.stringify(tasks)
    );

}


/* =========================
   ADD TASK
========================= */

addTaskBtn.addEventListener(
    "click",
    addTask
);


taskInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


function addTask() {

    const title =
        taskInput.value.trim();


    if (!title) {

        errorMessage.textContent =
            "⚠️ Please enter a task.";

        taskInput.focus();

        return;

    }


    errorMessage.textContent = "";


    const newTask = {

        id: Date.now(),

        title: title,

        category:
            categoryInput.value ||
            "Personal",

        priority:
            priorityInput.value ||
            "Medium",

        date:
            dateInput.value ||
            "",

        completed: false

    };


    tasks.push(newTask);


    saveTasks();


    clearInputs();


    renderTasks();

}


/* =========================
   CLEAR INPUTS
========================= */

function clearInputs() {

    taskInput.value = "";

    categoryInput.value = "";

    priorityInput.value = "";

    dateInput.value = "";

}


/* =========================
   RENDER TASKS
========================= */

function renderTasks() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    let filteredTasks =
        tasks.filter(task => {

            const matchesSearch =
                task.title
                    .toLowerCase()
                    .includes(search);


            const matchesCategory =
                filterCategory.value === "all" ||
                task.category ===
                    filterCategory.value;


            const matchesPriority =
                filterPriority.value === "all" ||
                task.priority ===
                    filterPriority.value;


            const matchesStatus =
                statusFilter.value === "all" ||

                (
                    statusFilter.value ===
                    "completed" &&
                    task.completed
                ) ||

                (
                    statusFilter.value ===
                    "pending" &&
                    !task.completed
                );


            return (
                matchesSearch &&
                matchesCategory &&
                matchesPriority &&
                matchesStatus
            );

        });


    tasksContainer.innerHTML = "";


    if (filteredTasks.length === 0) {

        emptyState.style.display =
            "block";

    } else {

        emptyState.style.display =
            "none";

    }


    filteredTasks.forEach(
        task => {

            const taskElement =
                createTaskElement(task);

            tasksContainer.appendChild(
                taskElement
            );

        }
    );


    updateStatistics();

}


/* =========================
   CREATE TASK ELEMENT
========================= */

function createTaskElement(task) {

    const div =
        document.createElement("div");


    div.className =
        "task-item";


    if (task.completed) {

        div.classList.add(
            "completed"
        );

    }


    const priorityClass =

        task.priority === "High"

            ? "priority-high"

            : task.priority === "Low"

                ? "priority-low"

                : "priority-medium";


    const formattedDate =
        task.date
            ? formatDate(task.date)
            : "No due date";


    div.innerHTML = `

        <button
            class="check-task"
            onclick="toggleTask(${task.id})"
        >
            ${task.completed ? "✓" : ""}
        </button>


        <div class="task-info">

            <h3>
                ${escapeHTML(task.title)}
            </h3>


            <div class="task-meta">

                <span class="badge category-badge">

                    ${escapeHTML(task.category)}

                </span>


                <span class="badge ${priorityClass}">

                    ${task.priority}

                </span>


                <span class="task-date">

                    📅 ${formattedDate}

                </span>

            </div>

        </div>


        <div class="task-actions">

            <button
                class="edit-btn"
                onclick="editTask(${task.id})"
                title="Edit"
            >
                ✏️
            </button>


            <button
                class="delete-btn"
                onclick="deleteTask(${task.id})"
                title="Delete"
            >
                🗑️
            </button>

        </div>

    `;


    return div;

}


/* =========================
   COMPLETE / PENDING
========================= */

function toggleTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) return;


    task.completed =
        !task.completed;


    saveTasks();

    renderTasks();

}


/* =========================
   DELETE
========================= */

function deleteTask(id) {

    const confirmDelete =
        confirm(
            "Do you want to delete this task?"
        );


    if (!confirmDelete) return;


    tasks =
        tasks.filter(
            task => task.id !== id
        );


    saveTasks();

    renderTasks();

}


/* =========================
   EDIT
========================= */

function editTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) return;


    const newTitle =
        prompt(
            "Edit your task:",
            task.title
        );


    if (
        newTitle === null
    ) {

        return;

    }


    const cleanTitle =
        newTitle.trim();


    if (!cleanTitle) {

        alert(
            "Task cannot be empty."
        );

        return;

    }


    task.title =
        cleanTitle;


    saveTasks();

    renderTasks();

}


/* =========================
   DATE FORMAT
========================= */

function formatDate(date) {

    const parts =
        date.split("-");


    return `${parts[2]}-${parts[1]}-${parts[0]}`;

}


/* =========================
   SEARCH
========================= */

searchInput.addEventListener(
    "input",
    renderTasks
);


/* =========================
   FILTERS
========================= */

filterCategory.addEventListener(
    "change",
    renderTasks
);


filterPriority.addEventListener(
    "change",
    renderTasks
);


statusFilter.addEventListener(
    "change",
    renderTasks
);


/* =========================
   STATISTICS
========================= */

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const pending =
        total - completed;


    const progress =
        total === 0

            ? 0

            : Math.round(
                (completed / total) *
                100
            );


    document.getElementById(
        "totalCount"
    ).textContent = total;


    document.getElementById(
        "completedCount"
    ).textContent = completed;


    document.getElementById(
        "pendingCount"
    ).textContent = pending;


    document.getElementById(
        "progressCount"
    ).textContent =
        progress + "%";


    document.getElementById(
        "allCount"
    ).textContent = total;


    document.getElementById(
        "pendingSideCount"
    ).textContent = pending;


    document.getElementById(
        "completedSideCount"
    ).textContent = completed;


    const important =
        tasks.filter(
            task =>
                task.priority === "High"
        ).length;


    document.getElementById(
        "importantCount"
    ).textContent = important;


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const todayTasks =
        tasks.filter(
            task =>
                task.date === today
        ).length;


    document.getElementById(
        "todayCount"
    ).textContent = todayTasks;

}


/* =========================
   SIDEBAR FILTER
========================= */

document
    .querySelectorAll(".nav-item")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".nav-item"
                    )
                    .forEach(
                        item =>
                            item.classList
                                .remove("active")
                    );


                button.classList.add(
                    "active"
                );


                const filter =
                    button.dataset.filter;


                if (filter === "all") {

                    statusFilter.value =
                        "all";

                    filterCategory.value =
                        "all";

                }


                if (
                    filter ===
                    "pending"
                ) {

                    statusFilter.value =
                        "pending";

                }


                if (
                    filter ===
                    "completed"
                ) {

                    statusFilter.value =
                        "completed";

                }


                if (
                    filter ===
                    "important"
                ) {

                    filterPriority.value =
                        "High";

                }


                if (
                    filter ===
                    "today"
                ) {

                    const today =
                        new Date()
                            .toISOString()
                            .split("T")[0];


                    tasksContainer.innerHTML =
                        "";


                    const todayTasks =
                        tasks.filter(
                            task =>
                                task.date ===
                                today
                        );


                    if (
                        todayTasks.length ===
                        0
                    ) {

                        emptyState.style.display =
                            "block";

                    } else {

                        emptyState.style.display =
                            "none";


                        todayTasks.forEach(
                            task => {

                                tasksContainer
                                    .appendChild(
                                        createTaskElement(
                                            task
                                        )
                                    );

                            }
                        );

                    }

                    return;

                }


                renderTasks();

            }
        );

    });


/* =========================
   CATEGORY BUTTONS
========================= */

document
    .querySelectorAll(
        ".category-item"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                filterCategory.value =
                    button.dataset.category;

                renderTasks();

            }
        );

    });


/* =========================
   DARK MODE
========================= */

function toggleDarkMode() {

    document.body.classList.toggle(
        "dark"
    );


    const isDark =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        "taskifyDarkMode",
        isDark
    );


    document.getElementById(
        "themeToggle"
    ).querySelector(
        "span"
    ).textContent =
        isDark ? "Light Mode" : "Dark Mode";


    document.getElementById(
        "headerTheme"
    ).textContent =
        isDark ? "🌙" : "☀️";

}


document.getElementById(
    "themeToggle"
).addEventListener(
    "click",
    toggleDarkMode
);


document.getElementById(
    "headerTheme"
).addEventListener(
    "click",
    toggleDarkMode
);


/* =========================
   MOBILE MENU
========================= */

document.getElementById(
    "mobileMenu"
).addEventListener(
    "click",
    () => {

        document
            .querySelector(".sidebar")
            .classList.toggle("open");

    }
);


/* =========================
   HTML SECURITY
========================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================
   LOAD DARK MODE
========================= */

const savedDarkMode =
    localStorage.getItem(
        "taskifyDarkMode"
    );


if (savedDarkMode === "true") {

    document.body.classList.add(
        "dark"
    );

    document.getElementById(
        "headerTheme"
    ).textContent = "🌙";

}


/* =========================
   INITIAL LOAD
========================= */

renderTasks();