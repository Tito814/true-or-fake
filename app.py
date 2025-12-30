from flask import Flask, render_template, request

import pickle

app = Flask(__name__)


with open("fake_news_model.pkl", "rb") as model_file:
    model = pickle.load(model_file)

with open("vectorizer.pkl", "rb") as vec_file:
    vectorizer = pickle.load(vec_file)


# -----------------------------
# Routes
# -----------------------------
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/check", methods=["POST"])
def check_news():
    # Get input from the form
    news_text = request.form.get("news_input")

    if not news_text.strip():
        return render_template("index.html", result={"type": " لم يتم إدخال نص"})

    # Transform the input text using the vectorizer
    input_vector = vectorizer.transform([news_text])

    # Make prediction
    prediction = model.predict(input_vector)[0]

    # Optional: get prediction probability if available
    try:
        confidence = model.predict(input_vector).max() * 100
        confidence = f"{confidence:.2f}%"
    except:
        confidence = "N/A"

    # Interpret result
    if prediction == 'REAL':
        news_type = "حقيقي ✅"
    else:
        news_type = "خبر كاذب ❌"

    # Create result dictionary
    result = {
        "type": news_type,
        "confidence": confidence,
        "reasons": [
            "تم تحليل النص باستخدام نموذج تعلم آلي مدرّب.",
            "تم الاعتماد على الكلمات والسياق لتحديد المصداقية."
        ]
    }

    # Return to the same HTML page with result
    return render_template("index.html", result=result)


if __name__ == '__main__':
    app.run(debug=True)
