// quiz.js – Quiz logic for HTTP evolution assessment

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quizForm');
  const resultDiv = document.getElementById('result');
  const resetBtn = document.getElementById('resetBtn');

  // Correct answers
  const correctAnswers = {
    q1: '3',
    q2: '1.1',
    q3: 'latency',
    q4: 'quic',
    q5: ['multiplexing', 'server_push', 'binary_protocol'] // encryption is NOT mandatory in HTTP/2
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let score = 0;
    const total = 5;
    const results = {};

    // Q1: Fill-in-the-blank (case-insensitive, trimmed)
    const q1Val = document.getElementById('q1').value.trim().toLowerCase();
    const q1Correct = q1Val === correctAnswers.q1;
    results.q1 = { correct: q1Correct, user: q1Val || '(empty)', correctAnswer: '3' };
    if (q1Correct) score++;

    // Q2–Q4: Radio buttons
    const q2Val = document.querySelector('input[name="q2"]:checked')?.value || '';
    const q2Correct = q2Val === correctAnswers.q2;
    results.q2 = { correct: q2Correct, user: q2Val || '(not selected)', correctAnswer: '1.1' };
    if (q2Correct) score++;

    const q3Val = document.querySelector('input[name="q3"]:checked')?.value || '';
    const q3Correct = q3Val === correctAnswers.q3;
    results.q3 = { correct: q3Correct, user: q3Val || '(not selected)', correctAnswer: 'latency' };
    if (q3Correct) score++;

    const q4Val = document.querySelector('input[name="q4"]:checked')?.value || '';
    const q4Correct = q4Val === correctAnswers.q4;
    results.q4 = { correct: q4Correct, user: q4Val || '(not selected)', correctAnswer: 'quic' };
    if (q4Correct) score++;

    // Q5: Checkboxes
    const q5Selected = Array.from(document.querySelectorAll('input[name="q5"]:checked')).map(cb => cb.value);
    const expected = correctAnswers.q5;
    const q5Correct = q5Selected.length === expected.length && 
                      q5Selected.every(val => expected.includes(val));
    results.q5 = {
      correct: q5Correct,
      user: q5Selected.length ? q5Selected.join(', ') : '(none selected)',
      correctAnswer: 'multiplexing, server_push, binary_protocol'
    };
    if (q5Correct) score++;

    // Calculate and display
    const percent = Math.round((score / total) * 100);
    const passed = percent >= 60;

    // Overall message
    const overallEl = document.getElementById('overall');
    overallEl.textContent = passed ? '🎉 Congratulations! You passed!' : '❌ You did not pass. Review and try again.';
    overallEl.className = passed ? 'pass' : 'fail';

    // Score
    document.getElementById('scoreDisplay').textContent = `Your Score: ${percent}% (${score}/${total})`;

    // Detailed feedback
    let detailsHTML = '<h3>Question Breakdown:</h3>';
    for (let i = 1; i <= 5; i++) {
      const q = results[`q${i}`];
      const statusClass = q.correct ? 'correct' : 'incorrect';
      detailsHTML += `
        <p>
          <strong>Q${i}:</strong> <span class="${statusClass}">${q.correct ? '✅ Correct' : '❌ Incorrect'}</span><br>
          Your answer: <em>${q.user}</em><br>
          Correct answer: <strong>${q.correctAnswer}</strong>
        </p>
      `;
    }
    document.getElementById('details').innerHTML = detailsHTML;

    resultDiv.style.display = 'block';
  });

  // Reset functionality
  resetBtn?.addEventListener('click', () => {
    form.reset();
    resultDiv.style.display = 'none';
  });
});
