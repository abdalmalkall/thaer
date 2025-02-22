/* تخزين بيانات المستخدم والأسئلة */
let userData = {};
let quizData = [];
let showAnswers = true;

/* دالة لتبديل الشاشات */
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });
  document.getElementById(screenId).classList.add("active");

  // التحكم في ظهور زر الرجوع في صفحات index (لا يظهر في شاشة تسجيل الدخول)
  const backBtn = document.querySelector(".back-button");
  if (screenId === "login-screen") {
    backBtn.style.display = "none";
  } else {
    backBtn.style.display = "block";
  }
}

/* التعامل مع نموذج تسجيل الدخول */
document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();
  userData.name = document.getElementById("userName").value;
  userData.email = document.getElementById("userEmail").value;
  userData.gender = document.querySelector('input[name="gender"]:checked').value;

  // إذا كان المستخدم أنثى، إضافة كلاس لتغيير الخلفية إلى تأثير خاص
  if (userData.gender === "female") {
    document.body.classList.add("female-background");
  }

  // الانتقال لشاشة التعليمات بعد التسجيل
  showScreen("instructions-screen");
});

/* زر الرجوع في صفحات index */
document.querySelector(".back-button").addEventListener("click", function () {
  let activeScreen = document.querySelector(".screen.active").id;
  if (activeScreen === "instructions-screen") {
    showScreen("login-screen");
  } else if (activeScreen === "quiz-setup-screen") {
    showScreen("instructions-screen");
  } else if (activeScreen === "quiz-create-screen") {
    showScreen("quiz-setup-screen");
  }
});

/* الانتقال من شاشة التعليمات إلى إعداد عدد الأسئلة */
document.getElementById("start-quiz-btn").addEventListener("click", function () {
  showScreen("quiz-setup-screen");
});

/* إنشاء بطاقات الأسئلة بناءً على العدد المدخل */
document.getElementById("generate-cards-btn").addEventListener("click", function () {
  const num = parseInt(document.getElementById("numQuestions").value);
  if (num > 0) {
    const cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = ""; // مسح المحتوى السابق
    quizData = [];
    // إنشاء البطاقات المطلوبة
    for (let i = 0; i < num; i++) {
      const card = document.createElement("div");
      card.classList.add("card");
      // تغيير تصميم البطاقة بناءً على جنس المستخدم
      card.classList.add(userData.gender === "male" ? "male" : "female");
      card.innerHTML = `
        <input type="text" placeholder="السؤال ${i + 1}" class="question-input" required>
        <input type="text" placeholder="الإجابة الصحيحة للسؤال ${i + 1}" class="answer-input" required>
      `;
      cardsContainer.appendChild(card);
    }
    showScreen("quiz-create-screen");
  } else {
    alert("الرجاء إدخال عدد صحيح أكبر من 0");
  }
});

/* دالة توليد معرف فريد للاختبار */
function generateUniqueId() {
  return "quiz-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
}

/* حفظ الأسئلة وإنشاء رابط الاختبار في صفحة جديدة */
document.getElementById("submit-quiz-btn").addEventListener("click", function () {
  showAnswers = document.getElementById("showAnswersOption").value === "yes";
  const questionInputs = document.querySelectorAll(".question-input");
  const answerInputs = document.querySelectorAll(".answer-input");
  quizData = [];
  for (let i = 0; i < questionInputs.length; i++) {
    quizData.push({
      question: questionInputs[i].value,
      answer: answerInputs[i].value,
    });
  }
  // تخزين بيانات الاختبار في localStorage مع معرف فريد
  var uniqueId = generateUniqueId();
  localStorage.setItem(
    uniqueId,
    JSON.stringify({ quizData: quizData, showAnswers: showAnswers })
  );
  // توليد رابط الاختبار
  var quizLink =
    window.location.origin +
    window.location.pathname.replace("index.html", "") +
    "quiz.html?quizid=" +
    uniqueId;
  alert("تم إنشاء رابط الاختبار الخاص بك. قم بمشاركته مع صديقك.");
  window.open(quizLink, "_blank");
});
