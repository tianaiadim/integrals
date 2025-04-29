// Function to initialize flashcards
function initializeFlashcards(flashcardsData) {
  const container = document.getElementById("flashcardsContainer")

  container.innerHTML = ""

  flashcardsData.forEach((data, index) => {
    const flashcard = document.createElement("div")
    flashcard.className = "flashcard"
    flashcard.innerHTML = `
      <div class="flashcard-inner">
        <div class="flashcard-front">
          <p>${data.question}</p>
        </div>
        <div class="flashcard-back">
          <p>${data.answer}</p>
        </div>
      </div>
    `

    flashcard.addEventListener("click", () => {
      flashcard.classList.toggle("flipped")
    })

    container.appendChild(flashcard)
  })

  // Save flashcards data to localStorage for persistence
  localStorage.setItem("currentFlashcardsData", JSON.stringify(flashcardsData))
}

function trackProgress() {
  const flashcards = document.querySelectorAll(".flashcard")

  flashcards.forEach((card, index) => {
    card.addEventListener("click", () => {
      const progress = JSON.parse(localStorage.getItem("flashcardProgress") || "[]")

      if (!progress.includes(index)) {
        progress.push(index)
        localStorage.setItem("flashcardProgress", JSON.stringify(progress))
      }

      updateProgressUI()
    })
  })
}

function updateProgressUI() {
  const progress = JSON.parse(localStorage.getItem("flashcardProgress") || "[]")
  const flashcards = document.querySelectorAll(".flashcard")

  flashcards.forEach((card, index) => {
    if (progress.includes(index)) {
      card.classList.add("viewed")
    }
  })

  const progressIndicator = document.getElementById("progressIndicator")
  if (progressIndicator) {
    const percentage = Math.round((progress.length / flashcards.length) * 100)
    progressIndicator.textContent = `Progress: ${percentage}%`
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("flashcardsContainer")) {
    const savedData = localStorage.getItem("currentFlashcardsData")

    let flashcardsData

    if (savedData) {
      if (typeof flashcardsData === "undefined") {
        flashcardsData = JSON.parse(savedData) 
        initializeFlashcards(flashcardsData)
      }
    }

    setTimeout(trackProgress, 500)
    setTimeout(updateProgressUI, 600)
  }
})


const siteData = {
  topics: [
    {
      id: "topic1",
      title: "Topic 1",
      description: "Description for Topic 1",
      explanation: "<p>Explanation for Topic 1</p>",
      flashcards: [
        { question: "Question 1", answer: "Answer 1" },
        { question: "Question 2", answer: "Answer 2" },
      ],
    },
    {
      id: "topic2",
      title: "Topic 2",
      description: "Description for Topic 2",
      explanation: "<p>Explanation for Topic 2</p>",
      flashcards: [
        { question: "Question 3", answer: "Answer 3" },
        { question: "Question 4", answer: "Answer 4" },
      ],
    },
  ],
}

const isHomePage =
  window.location.pathname.endsWith("index.html") ||
  window.location.pathname.endsWith("/") ||
  window.location.pathname === ""

function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(name)
}

function navigateToPage(url) {
  const transition = document.querySelector(".page-transition")
  transition.classList.add("active")

  setTimeout(() => {
    window.location.href = url
  }, 500) // Half the animation duration
}

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("a")

  links.forEach((link) => {
    if (link.hostname !== window.location.hostname && link.hostname !== "") {
      return
    }

    link.addEventListener("click", (e) => {
      e.preventDefault()
      const transition = document.querySelector(".page-transition")
      transition.classList.add("active")

      setTimeout(() => {
        window.location.href = link.href
      }, 500) // Half the animation duration
    })
  })

  initializeFlashcardsPage()
})

function initializeFlashcardsPage() {
  const flashcards = document.querySelectorAll(".flashcard")

  if (flashcards.length === 0) return

  const topicId = getCurrentTopicId()

  flashcards.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("flipped")

      setTimeout(() => {
        if (!card.classList.contains("viewed")) {
          card.classList.add("viewed")
          updateProgress()
        }
      }, 300)
    })
  })

  loadProgress()

  updateProgress()
}

function getCurrentTopicId() {
  const path = window.location.pathname
  const filename = path.split("/").pop()

  if (filename) {
    return filename.replace(".html", "")
  }

  return null
}

function loadProgress() {
  const topicId = getCurrentTopicId()
  if (!topicId) return

  const flashcards = document.querySelectorAll(".flashcard")
  const savedProgress = JSON.parse(localStorage.getItem("flashcardProgress") || "{}")

  if (savedProgress[topicId]) {
    flashcards.forEach((card, index) => {
      if (savedProgress[topicId].includes(index)) {
        card.classList.add("viewed")
      }
    })
  }
}

function updateProgress() {
  const topicId = getCurrentTopicId()
  if (!topicId) return

  const flashcards = document.querySelectorAll(".flashcard")
  const viewedCards = document.querySelectorAll(".flashcard.viewed")

  const percentage = Math.round((viewedCards.length / flashcards.length) * 100)

  const progressBar = document.getElementById("progressBar")
  if (progressBar) {
    progressBar.style.width = `${percentage}%`
  }

  const progressIndicator = document.getElementById("progressIndicator")
  if (progressIndicator) {
    progressIndicator.textContent = `Progress: ${percentage}%`

    // Add animation effect
    progressIndicator.style.animation = "pulse 0.5s ease"
    setTimeout(() => {
      progressIndicator.style.animation = ""
    }, 500)
  }

  saveProgress(viewedCards)
}

function saveProgress(viewedCards) {
  const topicId = getCurrentTopicId()
  if (!topicId) return

  const savedProgress = JSON.parse(localStorage.getItem("flashcardProgress") || "{}")

  if (!savedProgress[topicId]) {
    savedProgress[topicId] = []
  }

  viewedCards.forEach((card) => {
    const index = Number.parseInt(card.getAttribute("data-index"))
    if (!savedProgress[topicId].includes(index)) {
      savedProgress[topicId].push(index)
    }
  })

  localStorage.setItem("flashcardProgress", JSON.stringify(savedProgress))
}

document.addEventListener("DOMContentLoaded", () => {
  const topicCards = document.querySelectorAll(".topic-card")

  if (topicCards.length > 0) {
    topicCards.forEach((card, index) => {
      card.style.animationDelay = `${0.1 * index}s`
    })
  }
})

function initializeHomePage() {
  const topicsGrid = document.getElementById("topicsGrid")

  topicsGrid.innerHTML = ""

  siteData.topics.forEach((topic) => {
    const topicCard = document.createElement("a")
    topicCard.className = "topic-card"
    topicCard.href = `topic.html?id=${topic.id}`

    topicCard.innerHTML = `
      <h3>${topic.title}</h3>
      <p>${topic.description}</p>
    `

    topicsGrid.appendChild(topicCard)
  })
}

// Initialize the topic page
function initializeTopicPage() {
  const topicId = getUrlParameter("id")

  if (!topicId) {
    // Redirect to home if no topic ID is provided
    window.location.href = "index.html"
    return
  }

  // Find the topic data
  const topic = siteData.topics.find((t) => t.id === topicId)

  if (!topic) {
    // Redirect to home if topic is not found
    window.location.href = "index.html"
    return
  }

  // Update the page title
  document.title = `${topic.title} | Integral Flashcards`

  // Update the header
  const topicTitle = document.getElementById("topicTitle")
  topicTitle.textContent = topic.title

  // Update the explanation section
  const topicExplanation = document.getElementById("topicExplanation")
  topicExplanation.innerHTML = topic.explanation

  // Initialize flashcards
  initializeFlashcardsWithAnimation(topic.flashcards)
}

// Function to initialize flashcards with animation
function initializeFlashcardsWithAnimation(flashcardsData) {
  const container = document.getElementById("flashcardsContainer")

  // Clear any existing flashcards
  container.innerHTML = ""

  // Create flashcards from data
  flashcardsData.forEach((data, index) => {
    const flashcard = document.createElement("div")
    flashcard.className = "flashcard"
    flashcard.style.animationDelay = `${0.1 * index}s`

    flashcard.innerHTML = `
      <div class="flashcard-inner">
        <div class="flashcard-front">
          <p>${data.question}</p>
        </div>
        <div class="flashcard-back">
          <p>${data.answer}</p>
        </div>
      </div>
    `

    // Add click event to flip the card
    flashcard.addEventListener("click", () => {
      flashcard.classList.toggle("flipped")
    })

    container.appendChild(flashcard)
  })

  // Save progress to localStorage
  trackTopicProgress()
}

// Function to track user progress for topic
function trackTopicProgress() {
  const flashcards = document.querySelectorAll(".flashcard")
  const topicId = getUrlParameter("id")

  if (!topicId) return

  // Get existing progress or initialize empty object
  const allProgress = JSON.parse(localStorage.getItem("flashcardProgress") || "{}")

  // Initialize topic progress if it doesn't exist
  if (!allProgress[topicId]) {
    allProgress[topicId] = []
  }

  flashcards.forEach((card, index) => {
    // Mark card as viewed if in progress
    if (allProgress[topicId].includes(index)) {
      card.classList.add("viewed")
    }

    card.addEventListener("click", () => {
      // Add this card's index to progress if not already there
      if (!allProgress[topicId].includes(index)) {
        allProgress[topicId].push(index)
        localStorage.setItem("flashcardProgress", JSON.stringify(allProgress))
        card.classList.add("viewed")
      }
    })
  })
}
