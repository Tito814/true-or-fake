function checkNews() {
  const text = document.getElementById("newsInput").value.toLowerCase();
  const resultBox = document.getElementById("result");
  const newsType = document.getElementById("newsType");
  const confidence = document.getElementById("confidence");
  const reasonsList = document.getElementById("reasons");

  if (text.trim() === "") {
    alert("من فضلك أدخل نص الخبر");
    return;
  }

  let score = 50;
  let reasons = [];

  // كلمات تزيد المصداقية
  const positiveWords = [
    "official", "according to", "sources", "government",
    "statement", "report", "confirmed", "statistics"
  ];

  // كلمات تقلل المصداقية
  const negativeWords = [
    "shocking", "breaking", "you won’t believe",
    "rumor", "leaked", "secret", "viral"
  ];

  positiveWords.forEach(word => {
    if (text.includes(word)) {
      score += 5;
      reasons.push("احتوى على مصدر رسمي: " + word);
    }
  });

  negativeWords.forEach(word => {
    if (text.includes(word)) {
      score -= 7;
      reasons.push("احتوى على كلمة مثيرة للشك: " + word);
    }
  });

  score = Math.max(0, Math.min(100, score));

  let type = score >= 60 ? "خبر موثوق ✅" : "خبر مشكوك فيه ❌";

  resultBox.classList.remove("hidden", "real", "fake");
  resultBox.classList.add(score >= 60 ? "real" : "fake");

  newsType.innerText = " النوع: " + type;
  confidence.innerText = " درجة الثقة: " + score + "%";

  reasonsList.innerHTML = "";
  reasons.forEach(r => {
    const li = document.createElement("li");
    li.innerText = r;
    reasonsList.appendChild(li);
  });
}
