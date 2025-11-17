// quiz.js – HTTP Evolution Quiz Logic
// Only reveals correct answers if the user attempts at least one question
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quizForm');
  const resultDiv = document.getElementById('result');
  const resetBtn = document.getElementById('resetBtn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Check if any input was provided
    const q1 = document.getElementById('q1').value.trim();
    const q2 = document.querySelector('input[name="q2"]:checked');
    const q3 = document.querySelector('input[name="q3"]:checked');
    const q4 = document.querySelector('input[name="q4"]:checked');
    const q5 = document.querySelectorAll('input[name="q5"]:checked').length > 0;
    const hasInput = q1 || q2 || q3 || q4 || q5;

    let score = 0;
    const total = 5;
    const results = {};

    // Q1: Fill-in-the-blank – accept "3", "HTTP/3", etc.
    const q1Norm = q1.toLowerCase().replace(/[^0-9a-z]/g, '');
    const q1Correct = q1Norm === '3';
    results.q1 = { correct: q1Correct, user: q1 || '(empty)', correctAnswer: '3' };
    if (q1Correct) score++;

    // Q2–Q4: Radio buttons
    const q2Val = q2?.value || '';
    const q2Correct = q2Val === '1.1';
    results.q2 = { correct: q2Correct, user: q2Val || '(not selected)', correctAnswer: '1.1' };
    if (q2Correct) score++;

    const q3Val = q3?.value || '';
    const q3Correct = q3Val === 'latency';
    results.q3 = { correct: q3Correct, user: q3Val || '(not selected)', correctAnswer: 'latency' };
    if (q3Correct) score++;

    const q4Val = q4?.value || '';
    const q4Correct = q4Val === 'quic';
    results.q4 = { correct: q4Correct, user: q4Val || '(not selected)', correctAnswer: 'quic' };
    if (q4Correct) score++;

    // Q5: Multi-select
    const q5Selected = Array.from(document.querySelectorAll('input[name="q5"]:checked')).map(cb => cb.value);
    const q5Correct = q5Selected.length === 3 &&
                      q5Selected.includes('multiplexing') &&
                      q5Selected.includes('server_push') &&
                      q5Selected.includes('binary_protocol');
    results.q5 = {
      correct: q5Correct,
      user: q5Selected.length ? q5Selected.join(', ') : '(none selected)',
      correctAnswer: 'multiplexing, server_push, binary_protocol'
    };
    if (q5Correct) score++;

    const percent = Math.round((score / total) * 100);
    const passed = percent >= 60;

    // Overall message
    const overallEl = document.getElementById('overall');
    if (hasInput) {
      overallEl.textContent = passed
        ? '🎉 Congratulations! You passed!'
        : '❌ You did not pass. Review and try again.';
      overallEl.className = passed ? 'pass' : 'fail';
    } else {
      overallEl.textContent = '⚠️ You did not answer any questions.';
      overallEl.className = 'fail';
    }

    // Always show score
    document.getElementById('scoreDisplay').textContent = `Your Score: ${percent}% (${score}/${total})`;

    // Show detailed feedback ONLY if user attempted at least one question
    let detailsHTML = '';
    if (hasInput) {
      detailsHTML = '<h3>Question Breakdown:</h3>';
      for (let i = 1; i <= 5; i++) {
        const q = results[`q${i}`];
        const cls = q.correct ? 'correct' : 'incorrect';
        detailsHTML += `
          <p>
            <strong>Q${i}:</strong> <span class="${cls}">${q.correct ? '✅ Correct' : '❌ Incorrect'}</span><br>
            Your answer: <em>${q.user}</em><br>
            Correct answer: <strong>${q.correctAnswer}</strong>
          </p>
        `;
      }
    } else {
      detailsHTML = '<p>Please answer at least one question to see feedback.</p>';
    }

    document.getElementById('details').innerHTML = detailsHTML;
    resultDiv.style.display = 'block';
  });

  // Reset quiz
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      resultDiv.style.display = 'none';
    });
  }
});
