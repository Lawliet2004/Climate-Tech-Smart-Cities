/**
 * Embedded Chapter Quizzes logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initQuizzes();
});

function initQuizzes() {
    const quizContainers = document.querySelectorAll('.quiz-container');
    if (quizContainers.length === 0) return;

    quizContainers.forEach(container => {
        const checkBtn = container.querySelector('.check-answers-btn');
        const questions = container.querySelectorAll('.quiz-question');
        const feedbackDiv = container.querySelector('.quiz-feedback');

        if (!checkBtn) return;

        checkBtn.addEventListener('click', () => {
            let score = 0;
            const total = questions.length;
            let allAnswered = true;

            questions.forEach((question, index) => {
                const options = question.querySelectorAll('input[type="radio"]');
                const selected = Array.from(options).find(opt => opt.checked);
                const explanation = question.querySelector('.explanation');

                if (!selected) {
                    allAnswered = false;
                    return; // exit forEach loop early logic is handled outside
                }

                // Clear previous styles
                options.forEach(opt => {
                    opt.parentElement.classList.remove('correct', 'incorrect');
                });

                if (selected.value === 'true') {
                    score++;
                    selected.parentElement.classList.add('correct');
                    selected.parentElement.style.color = 'var(--color-primary-forest)';
                    selected.parentElement.style.fontWeight = 'bold';
                } else {
                    selected.parentElement.classList.add('incorrect');
                    selected.parentElement.style.color = 'var(--color-accent-coral)';
                    selected.parentElement.style.textDecoration = 'line-through';
                    
                    // Highlight the correct one
                    const correctChoice = Array.from(options).find(opt => opt.value === 'true');
                    if (correctChoice) {
                        correctChoice.parentElement.classList.add('correct');
                        correctChoice.parentElement.style.color = 'var(--color-primary-forest)';
                        correctChoice.parentElement.style.fontWeight = 'bold';
                    }
                }

                if (explanation) {
                    explanation.style.display = 'block';
                    explanation.style.marginTop = '1rem';
                    explanation.style.padding = '1rem';
                    explanation.style.backgroundColor = 'var(--color-bg-warm)';
                    explanation.style.borderRadius = '0.5rem';
                }
                
                // Disable options after checking
                options.forEach(opt => opt.disabled = true);
            });

            if (!allAnswered) {
                feedbackDiv.textContent = 'Please answer all questions before checking.';
                feedbackDiv.style.color = 'var(--color-accent-amber)';
                return;
            }

            feedbackDiv.innerHTML = `<strong>You scored ${score} out of ${total}!</strong>`;
            feedbackDiv.style.color = score === total ? 'var(--color-primary-forest)' : 'var(--color-text-main)';
            checkBtn.style.display = 'none'; // hide button after checking

            // Save score to local storage based on chapter
            const metaChapter = document.querySelector('meta[name="chapter"]');
            if (metaChapter) {
                const chapterScores = JSON.parse(localStorage.getItem('quizScores') || '{}');
                chapterScores[metaChapter.content] = { score, total };
                localStorage.setItem('quizScores', JSON.stringify(chapterScores));
            }
        });
    });
}
