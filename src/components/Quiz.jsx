import React, { useState } from "react";

/**
 * Quick check. questions: [{ q, options: [..], answer: index, explain }]
 * Calls onPass() once every question has been answered correctly.
 */
export default function Quiz({ questions, onPass, title = "Quick check" }) {
  const [picked, setPicked] = useState({}); // qIndex -> optionIndex
  const letters = "ABCDEF";

  function choose(qi, oi) {
    if (picked[qi] === questions[qi].answer) return; // already right; lock
    const next = { ...picked, [qi]: oi };
    setPicked(next);
    const allRight = questions.every((q, i) => next[i] === q.answer);
    if (allRight && onPass) onPass();
  }

  const score = questions.filter((q, i) => picked[i] === q.answer).length;

  return (
    <div className="quiz">
      <div className="quiz-count">
        {title} · {score} of {questions.length} correct
      </div>
      {questions.map((q, qi) => {
        const choice = picked[qi];
        const answered = choice !== undefined;
        const right = choice === q.answer;
        return (
          <div key={qi} style={{ marginBottom: qi < questions.length - 1 ? 22 : 0 }}>
            <p className="quiz-q">{q.q}</p>
            <div className="quiz-opts">
              {q.options.map((opt, oi) => {
                let cls = "quiz-opt";
                if (answered && oi === choice) cls += right ? " right" : " wrong";
                return (
                  <button key={oi} className={cls} onClick={() => choose(qi, oi)}>
                    <span className="letter">{letters[oi]}</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
            {answered && (
              <div className="quiz-feedback pop">
                {right ? <span className="ok">Correct. </span> : <span className="bad">Not quite, try another option. </span>}
                {right && q.explain}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
