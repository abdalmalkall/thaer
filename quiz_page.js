// استخراج معرف الاختبار من رابط الصفحة
const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get('quizid');

// محاولة استرجاع بيانات الاختبار من localStorage
let storedData = localStorage.getItem(quizId);
if (!storedData) {
  alert("لا توجد بيانات للاختبار. تأكد من الرابط.");
} else {
  var { quizData, showAnswers } = JSON.parse(storedData);
}

// إنشاء واجهة الاختبار لصديقك
function generateQuizForFriend() {
  const container = document.getElementById('quiz-questions-container');
  container.innerHTML = '';
  quizData.forEach((item, index) => {
    const qCard = document.createElement('div');
    qCard.classList.add('question-card');
    qCard.innerHTML = `
      <p><strong>السؤال ${index + 1}:</strong> ${item.question}</p>
      <input type="text" placeholder="أدخل إجابتك" class="friend-answer" data-index="${index}" required>
      ${showAnswers ? `<p class="correct-answer" style="display:none;">الإجابة الصحيحة: ${item.answer}</p>` : ''}
    `;
    container.appendChild(qCard);
  });
}

// التعامل مع إجابات الصديق وحساب النتيجة
document.getElementById('submit-answers-btn').addEventListener('click', function() {
  const friendAnswers = document.querySelectorAll('.friend-answer');
  let score = 0;
  friendAnswers.forEach(input => {
    const idx = input.getAttribute('data-index');
    if (input.value.trim().toLowerCase() === quizData[idx].answer.trim().toLowerCase()) {
      score++;
    }
  });
  displayResult(score);
  showScreen('result-screen');
});

// عرض النتيجة مع الإجابات الصحيحة إذا تم اختيار ذلك
function displayResult(score) {
  const resultDisplay = document.getElementById('result-display');
  resultDisplay.innerHTML = `<p>لقد حصلت على ${score} نقطة من ${quizData.length}.</p>`;
  if (showAnswers) {
    let answersHtml = '<h3>الإجابات الصحيحة:</h3>';
    quizData.forEach((item, index) => {
      answersHtml += `<p>السؤال ${index + 1}: ${item.question}<br>الإجابة: ${item.answer}</p>`;
    });
    resultDisplay.innerHTML += answersHtml;
  }
}

// دالة لتبديل الشاشات داخل صفحة الاختبار
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
}

// تهيئة الاختبار عند تحميل الصفحة
if (storedData) {
  generateQuizForFriend();
}

// وظيفة زر نسخ الرابط إلى الحافظة
document.getElementById('copy-link-btn').addEventListener('click', function() {
  navigator.clipboard.writeText(window.location.href)
    .then(() => alert("تم نسخ الرابط!"))
    .catch(err => alert("حدث خطأ أثناء نسخ الرابط."));
});

// وظيفة زر الرجوع للمصمم
document.getElementById('back-btn').addEventListener('click', function() {
  window.history.back();
});

// إعادة التشغيل: العودة للصفحة الرئيسية
document.getElementById('restart-btn').addEventListener('click', function() {
  window.location = "index.html";
});
