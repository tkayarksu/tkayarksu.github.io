form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Check if ANY input has been provided
  const q1Val = document.getElementById('q1').value.trim();
  const q2Checked = document.querySelector('input[name="q2"]:checked');
  const q3Checked = document.querySelector('input[name="q3"]:checked');
  const q4Checked = document.querySelector('input[name="q4"]:checked');
  const q5Checked = document.querySelectorAll('input[name="q5"]:checked').length > 0;

  const hasAnyAnswer = q1Val || q2Checked || q3Checked || q4Checked || q5Checked;

  let score = 0;
  const total = 5;
  const results = {};

  // Q1
  const q1Raw = q1Val || '';
  const q1Normalized = q1Raw.toLowerCase().replace(/[^0-9a-z]/g, '');
  const q1Correct = q1Normalized === '3';
  results.q1 = { correct: q1Correct, user: q1Raw || '(empty)', correctAnswer: '3' };
  if (q1Correct) score++;

  // Q2–Q4
  const q2Val = q2Checked?.value || '';
  const q2Correct = q2Val === '1.1';
  results.q2 = { correct: q2Correct, user: q2Val || '(not selected)', correctAnswer: '1.1' };
  if (q2Correct) score++;

  const q3Val = q3Checked?.value || '';
  const q3Correct = q3Val === 'latency';
  results.q3 = { correct: q3Correct, user: q3Val || '(not selected)', correctAnswer: 'latency' };
  if (q3Correct) score++;

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

  // Always show pass/fail and score (even if blank)
  const overallEl = document.getElementById('overall');
  overallEl.textContent = hasAnyAnswer 
    ? (passed ? '🎉 Congratulations! You passed!' : '❌ You did not pass. Review and try again.')
    : 'You didn’t answer any questions.';
  overallEl.className = hasAnyAnswer ? (passed ? 'pass' : 'fail') : 'fail';

  document.getElementById('scoreDisplay').textContent = `Your Score: ${percent}% (${score}/${total})`;

  // ONLY show question breakdown (with correct answers) if user attempted at least one question
  let detailsHTML = '';
  if (hasAnyAnswer) {
    detailsHTML = '<h3>Question Breakdown:</h3>';
    for (let i = 1; i <= 5; i++) {
      const q = results[`q${i}`];
      const statusClass = q.correct ? 'correct' : 'incorrect';
      detailsHTML += `
        <p>
          <strong>Q${i}:</strong> <span class="${statusClass}">${q.correct ? ' ✅ Correct' : ' ❌ Incorrect'}</span><br>
          Your answer: <em>${q.user}</em><br>
          Correct answer: <strong>${q.correctAnswer}</strong>
        </p>
      `;
    }
  } else {
    detailsHTML = '<p>Please answer the questions and submit to see feedback.</p>';
  }

  document.getElementById('details').innerHTML = detailsHTML;
  document.getElementById('result').style.display = 'block';
});
