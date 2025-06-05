
document.addEventListener('DOMContentLoaded', () => {
    
    const resultsContent = document.getElementById('resultsContent'); 
    const noSurveysMessage = document.getElementById('noSurveysMessage'); 

    async function fetchAndDisplaySurveyResults() {
        try {
            // Target the API endpoint based on routes/survey.js and index.js
            const response = await fetch('/api/results');

            // Handle potential non-JSON responses 
            if (!response.headers.get('Content-Type')?.includes('application/json')) {
                const textError = await response.text();
                console.error('Server responded with non-JSON error:', textError);
                if (resultsContent) {
                    resultsContent.innerHTML = '<p class="text-red-500">Error loading survey results due to unexpected server response.</p>';
                    resultsContent.classList.remove('hidden'); // results are visible
                }
                if (noSurveysMessage) {
                    noSurveysMessage.classList.add('hidden'); // Hide no surveys message
                }
                return;
            }

            const data = await response.json();

            if (data.totalSurveys === 0) {
               
                if (noSurveysMessage) noSurveysMessage.classList.remove('hidden');
                if (resultsContent) resultsContent.classList.add('hidden'); // Hide the main results container
            } else {
                
                if (noSurveysMessage) noSurveysMessage.classList.add('hidden');
                if (resultsContent) resultsContent.classList.remove('hidden'); // Ensure results content is visible

                const totalSurveysSpan = document.getElementById('totalSurveys');
                const averageAgeSpan = document.getElementById('averageAge');
                const oldestPersonAgeSpan = document.getElementById('oldestPersonAge');
                const youngestPersonAgeSpan = document.getElementById('youngestPersonAge');
                const pizzaPercentageSpan = document.getElementById('pizzaPercentage');
                const pastaPercentageSpan = document.getElementById('pastaPercentage');
                const papWorsPercentageSpan = document.getElementById('papWorsPercentage');
                const moviesRatingAvgSpan = document.getElementById('moviesRatingAvg');
                const radioRatingAvgSpan = document.getElementById('radioRatingAvg');
                const eatOutRatingAvgSpan = document.getElementById('eatOutRatingAvg');
                const tvRatingAvgSpan = document.getElementById('tvRatingAvg');

                if (totalSurveysSpan) totalSurveysSpan.textContent = data.totalSurveys;
                if (averageAgeSpan) averageAgeSpan.textContent = data.averageAge.toFixed(1);
                if (oldestPersonAgeSpan) oldestPersonAgeSpan.textContent = data.oldestAge;
                if (youngestPersonAgeSpan) youngestPersonAgeSpan.textContent = data.youngestAge;
                if (pizzaPercentageSpan) pizzaPercentageSpan.textContent = `${data.pizzaPercentage.toFixed(1)}%`;
                if (pastaPercentageSpan) pastaPercentageSpan.textContent = `${data.pastaPercentage.toFixed(1)}%`;
                if (papWorsPercentageSpan) papWorsPercentageSpan.textContent = `${data.papWorsPercentage.toFixed(1)}%`;
                if (moviesRatingAvgSpan) moviesRatingAvgSpan.textContent = data.moviesAvgRating.toFixed(1);
                if (radioRatingAvgSpan) radioRatingAvgSpan.textContent = data.radioAvgRating.toFixed(1);
                if (eatOutRatingAvgSpan) eatOutRatingAvgSpan.textContent = data.eatOutAvgRating.toFixed(1);
                if (tvRatingAvgSpan) tvRatingAvgSpan.textContent = data.tvAvgRating.toFixed(1);
            }
        } catch (error) {
            console.error('Error fetching or processing survey results:', error);
            
            if (resultsContent) {
                resultsContent.innerHTML = '<p class="text-red-500">Error loading survey results. Please try again later.</p>';
                resultsContent.classList.remove('hidden'); // Ensure results content is visible
            }
            if (noSurveysMessage) {
                noSurveysMessage.classList.add('hidden'); // Hide no surveys message
            }
        }
    }

    // Fetch and display results when the page loads
    fetchAndDisplaySurveyResults();
});