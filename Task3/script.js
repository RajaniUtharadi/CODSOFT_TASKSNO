/* =========================================
   NOVABLOG - JAVASCRIPT
========================================= */


/* =========================================
   MOBILE MENU
========================================= */

const menuButton =
    document.getElementById("menuButton");

const navLinks =
    document.querySelector(".nav-links");


menuButton.addEventListener("click", () => {

    navLinks.classList.toggle("active");

});


/* Close mobile menu when a link is clicked */

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

    });

});



/* =========================================
   DARK MODE
========================================= */

const themeButton =
    document.getElementById("themeButton");


themeButton.addEventListener("click", () => {

    document.body.classList.toggle("dark");


    if (document.body.classList.contains("dark")) {

        themeButton.textContent = "☀️";

        localStorage.setItem(
            "blogTheme",
            "dark"
        );

    } else {

        themeButton.textContent = "🌙";

        localStorage.setItem(
            "blogTheme",
            "light"
        );

    }

});


/* Remember theme after refresh */

const savedTheme =
    localStorage.getItem("blogTheme");


if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeButton.textContent = "☀️";

}



/* =========================================
   CATEGORY FILTER
========================================= */

const categoryButtons =
    document.querySelectorAll(".category-btn");

const blogCards =
    document.querySelectorAll(".blog-card");


categoryButtons.forEach(button => {

    button.addEventListener("click", () => {


        /* Remove active class */

        categoryButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        /* Add active class */

        button.classList.add("active");


        const selectedCategory =
            button.dataset.category;


        blogCards.forEach(card => {

            const cardCategory =
                card.dataset.category;


            if (
                selectedCategory === "all" ||
                cardCategory === selectedCategory
            ) {

                card.style.display = "block";

            } else {

                card.style.display = "none";

            }

        });

    });

});



/* =========================================
   SEARCH ARTICLES
========================================= */

const searchInput =
    document.getElementById("searchInput");


searchInput.addEventListener("input", () => {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    let foundArticles = 0;


    blogCards.forEach(card => {

        const cardText =
            card.textContent.toLowerCase();


        if (
            cardText.includes(searchText)
        ) {

            card.style.display = "block";

            foundArticles++;

        } else {

            card.style.display = "none";

        }

    });


    /* No results message */

    const existingMessage =
        document.querySelector(".no-results");


    if (existingMessage) {

        existingMessage.remove();

    }


    if (
        searchText !== "" &&
        foundArticles === 0
    ) {

        const message =
            document.createElement("div");


        message.className =
            "no-results";


        message.innerHTML = `
            🔍
            <h3>No articles found</h3>
            <p>Try searching for another topic.</p>
        `;


        document
            .getElementById("blogGrid")
            .appendChild(message);

    }

});



/* =========================================
   LOAD MORE
========================================= */

const loadMoreButton =
    document.getElementById("loadMoreButton");


/*
   We already have 6 articles.
   This button demonstrates
   "Load More" functionality.
*/

loadMoreButton.addEventListener("click", () => {


    const newArticles = [

        {
            category: "technology",

            emoji: "🌐",

            title:
                "Why Responsive Design Matters",

            description:
                "Learn how responsive design helps websites work beautifully on every device.",

            date:
                "Aug 2, 2026"

        },

        {
            category: "programming",

            emoji: "💻",

            title:
                "Simple Coding Habits That Help",

            description:
                "Small programming habits can make your code cleaner and easier to understand.",

            date:
                "Aug 1, 2026"

        }

    ];


    const blogGrid =
        document.getElementById("blogGrid");


    newArticles.forEach(article => {


        const card =
            document.createElement("article");


        card.className =
            "blog-card";


        card.dataset.category =
            article.category;


        card.innerHTML = `

            <div class="blog-image technology-image">

                ${article.emoji}

            </div>


            <div class="blog-content">

                <span class="post-category">

                    ${article.category}

                </span>


                <h3>

                    ${article.title}

                </h3>


                <p>

                    ${article.description}

                </p>


                <div class="card-footer">

                    <span>

                        📅 ${article.date}

                    </span>


                    <button
                        onclick="alert('Full article coming soon!')"
                    >

                        Read →

                    </button>

                </div>

            </div>

        `;


        blogGrid.appendChild(card);

    });


    loadMoreButton.textContent =
        "All Articles Loaded";

    loadMoreButton.disabled =
        true;

    loadMoreButton.style.opacity =
        "0.6";

});



/* =========================================
   SEARCH BUTTON
========================================= */

const searchButton =
    document.getElementById("searchButton");


searchButton.addEventListener("click", () => {

    document
        .getElementById("articles")
        .scrollIntoView({
            behavior: "smooth"
        });


    setTimeout(() => {

        searchInput.focus();

    }, 600);

});



/* =========================================
   BLOG DETAILS
========================================= */

function openPost(postName) {


    const posts = {

        "ai-future": {

            title:
                "How Artificial Intelligence Is Changing Our Future",

            category:
                "AI & ML",

            text:
                "Artificial Intelligence is transforming many areas of modern life. From education and healthcare to business and entertainment, AI is helping people solve problems faster and make better decisions."

        },


        "web-development": {

            title:
                "The Future of Web Development",

            category:
                "Technology",

            text:
                "Modern web development is evolving rapidly. Responsive design, JavaScript frameworks, cloud platforms, and AI-powered tools are changing the way developers create digital experiences."

        },


        "python": {

            title:
                "Why Python Is Great for Beginners",

            category:
                "Programming",

            text:
                "Python is known for its simple syntax and readability. It is widely used in web development, automation, data science, artificial intelligence, and machine learning."

        },


        "machine-learning": {

            title:
                "Understanding Machine Learning",

            category:
                "AI & ML",

            text:
                "Machine learning allows computers to learn patterns from data and make predictions. It is one of the most important areas of modern artificial intelligence."

        },


        "portfolio": {

            title:
                "Building Your First Tech Portfolio",

            category:
                "Career",

            text:
                "A good technology portfolio can showcase your skills, projects, achievements, and learning journey. Students can use portfolios to demonstrate practical knowledge to recruiters."

        },


        "productivity": {

            title:
                "How to Stay Productive While Studying",

            category:
                "Lifestyle",

            text:
                "Good time management, clear goals, regular breaks, and consistent practice can help students stay productive and make steady progress."

        },


        "technologies": {

            title:
                "Technologies Students Should Learn",

            category:
                "Technology",

            text:
                "Students interested in technology can explore programming, web development, databases, cloud computing, artificial intelligence, and other modern technologies."

        }

    };


    const post =
        posts[postName];


    if (!post) {

        return;

    }


    /* Create article modal */

    const modal =
        document.createElement("div");


    modal.className =
        "article-modal";


    modal.innerHTML = `

        <div class="article-box">

            <button
                class="close-article"
            >

                ×

            </button>


            <span class="post-category">

                ${post.category}

            </span>


            <h1>

                ${post.title}

            </h1>


            <p class="article-date">

                📅 Published on NovaBlog

            </p>


            <div class="article-line"></div>


            <p>

                ${post.text}

            </p>


            <p>

                This article is part of the
                NovaBlog collection. More
                detailed content can be added
                here as your blog grows.

            </p>


            <button
                class="primary-button close-button"
            >

                ← Back to Articles

            </button>

        </div>

    `;


    document.body.appendChild(modal);


    /* Close button */

    modal
        .querySelector(".close-article")
        .addEventListener("click", () => {

            modal.remove();

        });


    modal
        .querySelector(".close-button")
        .addEventListener("click", () => {

            modal.remove();

        });


    /* Close when clicking outside */

    modal.addEventListener("click", event => {

        if (event.target === modal) {

            modal.remove();

        }

    });

}



/* =========================================
   ADD MODAL STYLES
========================================= */

const modalStyle =
    document.createElement("style");


modalStyle.textContent = `

    .article-modal {

        position: fixed;

        inset: 0;

        z-index: 9999;

        display: flex;

        align-items: center;

        justify-content: center;

        padding: 20px;

        background:
            rgba(15, 10, 30, 0.75);

        backdrop-filter:
            blur(8px);

    }


    .article-box {

        width: min(700px, 100%);

        max-height: 85vh;

        overflow-y: auto;

        position: relative;

        padding: 45px;

        border-radius: 25px;

        background: white;

        box-shadow:
            0 30px 80px
            rgba(0,0,0,0.3);

        animation:
            modalOpen 0.3s ease;

    }


    .article-box h1 {

        font-size: 34px;

        line-height: 1.2;

        color: #211b38;

        margin-bottom: 10px;

    }


    .article-box p {

        color: #716b82;

        font-size: 14px;

        line-height: 1.9;

        margin-top: 20px;

    }


    .article-date {

        font-size: 11px !important;

        color: #9992a5 !important;

    }


    .article-line {

        height: 1px;

        background: #ebe7f2;

        margin-top: 25px;

    }


    .close-article {

        position: absolute;

        right: 20px;

        top: 18px;

        width: 38px;

        height: 38px;

        border: none;

        border-radius: 50%;

        background: #f3f0f8;

        color: #4b445b;

        font-size: 25px;

    }


    .close-button {

        margin-top: 25px;

    }


    @keyframes modalOpen {

        from {

            opacity: 0;

            transform:
                translateY(20px)
                scale(0.96);

        }

        to {

            opacity: 1;

            transform:
                translateY(0)
                scale(1);

        }

    }


    body.dark .article-box {

        background: #1c1829;

    }


    body.dark .article-box h1 {

        color: white;

    }


    body.dark .article-box p {

        color: #aaa3b8;

    }


    body.dark .article-line {

        background: #302a40;

    }


    body.dark .close-article {

        background: #302a40;

        color: white;

    }


    @media (max-width: 600px) {

        .article-box {

            padding: 30px 22px;

        }


        .article-box h1 {

            font-size: 25px;

        }

    }

`;


document.head.appendChild(modalStyle);



/* =========================================
   PAGE LOAD ANIMATION
========================================= */

window.addEventListener("load", () => {

    document.body.style.opacity = "0";


    setTimeout(() => {

        document.body.style.transition =
            "opacity 0.5s ease";

        document.body.style.opacity =
            "1";

    }, 100);

});