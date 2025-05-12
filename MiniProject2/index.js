
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const scoreScreen = document.getElementById('score-screen');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const scoreEl = document.getElementById('score');
const reviewEl = document.getElementById('review');


const quizData = [
  {
      question: "Name a player who has scored a Century at Wankhede Stadium as a captain",
      options: ["Rohit Sharma","Adam Gilchrist","MS Dhoni","Gautam Gambhir"],
      answer: "Rohit Sharma"
  },
  {
    question: "Which of these bowlers did not take a three-for in the 2019 men’s ODI World Cup final?",
    options: ["Liam Plunkett","Jofra Archer","Lockie Ferguson","James Neesham"],
    answer: "Jofra Archer"
  },
  {
    question: "Who was at the non-striker’s end when Grant Elliott took New Zealand to their first men’s World Cup final by sealing a win over South Africa with a penultimate-ball six in the 2015 semi-final?",
    options: ["Luke Ronchi","Daniel Vettori","Tim Southee","Matt Henry"],
    answer: "Daniel Vettori"
  },
  {
    question: "Who completed the first Test century of 2024 in Cape Town in January, even though his team lost to India inside two days?",
    options: ["Aiden Markram","Temba Bavuma","Kyle Verreynne","David Bedingham"],
    answer: "Aiden Markram"
  },
  {
    question: "Who had identical figures of 6 for 52 in each innings of India's first Test win in Australia?",
    options: ["Kapil Dev","Bishan Bedi","Bhagwath Chandrasekhar","Karsan Ghavri"],
    answer: "Bhagwath Chandrasekhar"
  },
  {
    question: "The first 88 entries for the youngest to play a men’s T20I are currently cricketers from Associate nations. Who is the youngest from a Full-Member nation to debut in the format?",
    options: ["Rashid Khan","Mujeeb Ur Rahman","Mohammad Amir","Josh Little"],
    answer: "Mujeeb Ur Rahman"
  },
  {
    question: "Sydney Thunder were in the news after being bowled out for 15 in one match this BBL season. Who were their opponents?",
    options: ["Melbourne Renegades","Sydney Sixers","Adelaide Strikers","Perth Scorchers"],
    answer: "Adelaide Strikers"
  },
  {
    question: "Who won the IPL in 2008 as a player and then in 2009 as coach?",
    options: ["Stephen Fleming","Shane Warne","Darren Lehmann","Rahul Dravid"],
    answer: "Darren Lehmann"
  }
];

let currentQuestion = 0;
let score = 0;
let userAnswers = [];

startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', () => {
  score = 0;
  currentQuestion = 0;
  userAnswers = [];
  showScreen(startScreen);
});

function startQuiz() {
  showScreen(quizScreen);
  showQuestion();
}

function showScreen(screen) {
  startScreen.classList.add('hidden');
  quizScreen.classList.add('hidden');
  scoreScreen.classList.add('hidden');
  screen.classList.remove('hidden');
}

function showQuestion() {
  const current = quizData[currentQuestion];
  questionEl.textContent = current.question;
  optionsEl.innerHTML = '';

  current.options.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.onclick = () => {
      userAnswers.push({
        question: current.question,
        selected: option,
        correct: current.answer
      });

      if (option === current.answer) score++;
      currentQuestion++;
      if (currentQuestion < quizData.length) {
        showQuestion();
      } else {
        showScore();
      }
    };
    optionsEl.appendChild(btn);
  });
}

function showScore() {
  scoreEl.textContent = `${score} / ${quizData.length}`;
  showReview();
  showScreen(scoreScreen);
}

function showReview() {
  reviewEl.innerHTML = '<h3>Review Answers:</h3>';
  userAnswers.forEach((entry, index) => {
    const div = document.createElement('div');
    div.className = 'review-item';
    div.innerHTML = `
      <p><strong>Q${index + 1}:</strong> ${entry.question}</p>
      <p>Your Answer: <span style="color: ${entry.selected === entry.correct ? 'green' : 'red'}">${entry.selected}</span></p>
      ${entry.selected !== entry.correct ? `<p>Correct Answer: <strong>${entry.correct}</strong></p>` : ''}
      <hr>
    `;
    reviewEl.appendChild(div);
  });
}















