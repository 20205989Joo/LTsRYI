let score = 0;
let timer;
let seconds = 0;
let currentPhraseIndex = 0;
let highlightColorIndex = 0;
const highlightColors = ['teal', 'violet', 'orange'];

const phrases = [
    "traditional methods",
    "digital tools",
    "international markets",
    "sustainable practices",
    "physical activity"
];

const texts = [
    {
        question: "Although many people believe that traditional methods are outdated, several studies have shown that they still hold significant value in contemporary society.",
        translation: "많은 사람들이 전통적인 방법이 구식이라고 생각하지만, 여러 연구에서 그것들이 현대 사회에서 여전히 중요한 가치를 지니고 있음을 보여주었다.",
        groups: [
            ["Although", ","],
            ["many", "people", "believe"],
            ["that"],
            ["traditional", "methods", "are", "outdated"]
        ]
    },
    {
        question: "As technology continues to advance, educators are increasingly incorporating digital tools into their teaching methods to enhance student engagement and learning outcomes.",
        translation: "기술이 계속 발전함에 따라, 교육자들은 학생들의 참여와 학습 성과를 향상시키기 위해 점점 더 디지털 도구를 교육 방법에 통합하고 있다.",
        groups: []
    },
    {
        question: "Given the rapid changes in the global economy, it is crucial for students to develop a deep understanding of international markets and the factors that influence them.",
        translation: "글로벌 경제에서의 급격한 변화를 고려할 때, 학생들이 국제 시장과 그것을 영향을 미치는 요인들에 대한 깊은 이해를 개발하는 것이 매우 중요하다.",
        groups: []
    },
    {
        question: "Despite the increasing awareness of environmental issues, many corporations continue to prioritize short-term profits over sustainable practices.",
        translation: "환경 문제에 대한 인식이 높아지고 있음에도 불구하고, 많은 기업들은 지속 가능한 관행보다는 단기 이익을 우선시 계속하고 있다.",
        groups: []
    },
    {
        question: "Researchers have discovered that engaging in regular physical activity can significantly reduce the risk of developing chronic diseases such as diabetes and heart disease.",
        translation: "연구자들은 정기적인 신체 활동에 참여하는 것이 당뇨병과 심장병과 같은 만성 질환의 발병 위험을 상당히 줄일 수 있다는 것을 발견했다.",
        groups: []
    }
];

function checkAnswer() {
    const userAnswer = document.getElementById('answer').value.toLowerCase().trim();
    const feedback = document.getElementById('feedback');
    const results = document.getElementById('results');
    let isCorrect = false;

    if (userAnswer === phrases[currentPhraseIndex].toLowerCase()) {
        isCorrect = true;
    }

    if (isCorrect) {
        feedback.textContent = "Correct!";
        feedback.className = "correct";
        score++;
        document.getElementById('score').textContent = score;
    } else {
        feedback.textContent = "Wrong! Try again.";
        feedback.className = "wrong";
    }

    const resultItem = document.createElement('li');
    resultItem.textContent = `You answered: ${userAnswer} - ${isCorrect ? "Correct" : "Wrong"}`;
    results.appendChild(resultItem);
}

function nextPhrase() {
    currentPhraseIndex = (currentPhraseIndex + 1) % texts.length;
    updatePhrase();
}

function updatePhrase() {
    const questionElement = document.getElementById('question');
    const translationElement = document.getElementById('translation');
    questionElement.innerHTML = '';
    translationElement.textContent = texts[currentPhraseIndex].translation;

    const words = texts[currentPhraseIndex].question.match(/[\w']+|[.,!?;]/g);
    words.forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        span.dataset.index = index;
        span.addEventListener('click', handleWordClick);
        questionElement.appendChild(span);
    });

    document.getElementById('answer').value = '';
    document.getElementById('feedback').textContent = '';
}

function startTimer() {
    timer = setInterval(() => {
        seconds++;
        document.getElementById('stopwatch').textContent = new Date(seconds * 1000).toISOString().substr(14, 5);
    }, 1000);
}

function indexWords(sentence) {
    let words = sentence.match(/[\w']+|[.,!?;]/g); // Split by word boundaries and include punctuation as separate tokens
    let indexedWords = {};

    words.forEach((word, index) => {
        indexedWords[word] = index;
    });

    return indexedWords;
}

function groupWords(sentence, groups) {
    let words = sentence.match(/[\w']+|[.,!?;]/g);
    let indexedGroups = groups.map(group => {
        return group.map(word => words.indexOf(word));
    });
    return indexedGroups;
}

function handleWordClick(event) {
    const word = event.target.textContent.trim();
    const groups = texts[currentPhraseIndex].groups;
    groups.forEach(group => {
        if (group.includes(word)) {
            toggleHighlightGroup(group, event.target);
        }
    });
}

function toggleHighlightGroup(group, target) {
    const words = document.querySelectorAll('#question span');
    // Check if the clicked word is highlighted
    const isHighlighted = target.classList.contains('highlighted');
    // Check if any word in the group is highlighted
    const anyHighlighted = group.some(word => {
        const span = [...words].find(w => w.textContent.trim() === word);
        return span.classList.contains('highlighted');
    });

    if (anyHighlighted && !isHighlighted) {
        // If any word in the group is highlighted but the clicked word isn't, do nothing
        return;
    }

    group.forEach(word => {
        const span = [...words].find(w => w.textContent.trim() === word);
        if (anyHighlighted) {
            // If any word is highlighted, remove all colors and 'highlighted' class
            span.classList.remove('teal', 'violet', 'orange', 'highlighted');
        } else {
            // If no word is highlighted, add the next color and 'highlighted' class
            const color = highlightColors[highlightColorIndex % highlightColors.length];
            span.classList.add(color, 'highlighted');
        }
    });

    // Only increment the color index if we are adding colors
    if (!anyHighlighted) {
        highlightColorIndex++;
    }
}


window.onload = function() {
    startTimer();
    updatePhrase();
};
