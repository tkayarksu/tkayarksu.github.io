// quiz.js – HTTP Evolution Quiz Logic
// Only shows correct answers if the user attempts at least one question
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quizForm');
  const resultDiv = document.getElementById('result');
  const resetBtn = document.getElementById('resetBtn');

  // Define correct answers (normalized)
  const correctAnswers = {
    q1: '3',
    q2: '1.1',
    q3: 'latency',
    q4: 'quic',
    q5: ['multiplexing', 'server_push', 'binary_protocol']
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get user inputs
    const q1Val = document.getElementById('q1').value.trim();
    const q2Checked = document.querySelector('input[name="q2"]:checked');
    const q3Checked = document.querySelector('input[name="q3"]:checked');
    const q4Checked = document.querySelector('input[name="q4"]:checked');
    const q5Checked = document.querySelectorAll('input[name="q5"]:checked').length > 0;

    const hasAnyInput = q1Val || q2Checked || q3Checked || q4Checked || q5Checked;

    let score = 0;
    const total = 5;
    const results = {};

    // Q1
    const q1Normalized = q1Val.toLowerCase().replace(/[^0-9a-z]/g, '');
    const q1Correct = q1Normalized === '3';
    results.q1 = { correct: q1Correct, user: q1Val || '(empty)', correctAnswer: '3' };
    if (q1Correct) score++;

    // Q2
    const q2Val = q2Checked?.value || '';
    const q2Correct = q2Val === '1.1';
    results.q2 = { correct: q2Correct, user: q2Val || '(not selected)', correctAnswer: '1.1' };
    if (q2Correct) score++;

    // Q3
    const q3Val = q3Checked?.value || '';
    const q3Correct = q3Val === 'latency';
    results.q3 = { correct: q3Correct, user: q3Val || '(not selected)', correctAnswer: 'latency' };
    if (q3Correct) score++;

    // Q4
    const q4Val = q4Checked?.value || '';
    const q4Correct = q4Val === 'quic';
    results.q4 = { correct: q4Correct, user: q4Val || '(not selected)', correctAnswer: 'quic' };
    if (q4Correct) score++;

    // Q5
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

    // Show overall result (always)
    const overallEl = document.getElementById('overall');
    if (hasAnyInput) {
      overallEl.textContent = passed 
        ? '🎉 Congratulations! You passed!' 
        : '❌ You did not pass. Review and try again.';
      overallEl.className = passed ? 'pass' : 'fail';
    } else {
      overallEl.textContent = '⚠️ You did not answer any questions.';
      overallEl.className = 'fail';
    }

    // Show score (always)
    document.getElementById('scoreDisplay').textContent = `Your Score: ${percent}% (${score}/${total})`;

    // Show question breakdown ONLY if user attempted at least one question
    let detailsHTML = '';
    if (hasAnyInput) {
      detailsHTML = '<h3>Question Breakdown:</h3>';
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
    } else {
      detailsHTML = '<p>Answer at least one question to see feedback.</p>';
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
