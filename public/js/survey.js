
document.addEventListener('DOMContentLoaded', () => {
    const surveyForm = document.getElementById('surveyForm');

    const messageBoxOverlay = document.getElementById('messageBoxOverlay');
    const messageBox = document.getElementById('messageBox');
    const messageBoxText = document.getElementById('messageBoxText');
    const messageBoxClose = document.getElementById('messageBoxClose');

    // displaying custom message box
    function showMessageBox(message) {
        messageBoxText.textContent = message;
        messageBoxOverlay.style.display = 'block';
        messageBox.style.display = 'flex'; 
    }

    // hiding custom message box
    function hideMessageBox() {
        messageBoxOverlay.style.display = 'none';
        messageBox.style.display = 'none';
    }

    // Close button for message box
    if (messageBoxClose) {
        messageBoxClose.addEventListener('click', hideMessageBox);
        messageBoxOverlay.addEventListener('click', hideMessageBox);
    }

    // Form Submission Handler
    if (surveyForm) { 
        surveyForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (validateSurveyForm()) {
                await submitSurvey(); // Send data to index.js backend
            }
        });
    }

    
    function validateSurveyForm() {
    
        const requiredTextFields = [
            'fullName',
            'email',
            'dob', 
            'contactNumber'
        ];

        for (const fieldId of requiredTextFields) {
            const input = document.getElementById(fieldId);
            if (!input.value.trim()) {
                showMessageBox(`Please fill out the ${fieldId} field.`);
                input.focus();
                return false;
            }
        }

        // Validate Age
        const dobInput = document.getElementById('dob');
        const dob = new Date(dobInput.value);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        if (age < 5 || age > 120) {
            showMessageBox("Age must be between 5 and 120.");
            dobInput.focus();
            return false;
        }

        // Validate favorite food selection at least one checkbox must be checked
        const favoriteFoodCheckboxes = document.querySelectorAll('input[name="favoriteFood"]:checked');
        if (favoriteFoodCheckboxes.length === 0) {
            showMessageBox("Please select at least one favorite food.");
            return false;
        }


        // Ensure a rating is selected 
        const ratingGroups = [
            'moviesRating',
            'radioRating',
            'eatOutRating',
            'tvRating'
        ];
        for (const groupName of ratingGroups) {
            const selectedRating = document.querySelector(`input[name="${groupName}"]:checked`);

            if (!selectedRating) {
                let questionText = document.querySelector(`input[name="${groupName}"]`).closest('tr')?.querySelector('td')?.textContent;
                showMessageBox(`Please select a rating for "${questionText || groupName.replace('Rating', ' ').trim()}"`);
                return false;
            }
        }

        return true;
    }


    // Backend Interaction

    async function submitSurvey() {
        
        const favoriteFoodSelected = Array.from(document.querySelectorAll('input[name="favoriteFood"]:checked')).map(cb => cb.value);

        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            dob: document.getElementById('dob').value, 
            contactNumber: document.getElementById('contactNumber').value,
            favoriteFood: favoriteFoodSelected, 
            moviesRating: document.querySelector('input[name="moviesRating"]:checked')?.value,
            radioRating: document.querySelector('input[name="radioRating"]:checked')?.value,
            eatOutRating: document.querySelector('input[name="eatOutRating"]:checked')?.value,
            tvRating: document.querySelector('input[name="tvRating"]:checked')?.value,
        };

        // Based on the routes/survey.js and index.js, the endpoint is /api/submit
        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            // Handle potential non-JSON responses 
            if (!response.headers.get('Content-Type')?.includes('application/json')) {
                const textError = await response.text();
                console.error('Server responded with non-JSON error:', textError);
                showMessageBox(`Failed to submit survey. Server error: ${response.status} ${response.statusText}`);
                return;
            }

            const data = await response.json();

            if (response.ok) { // Check if the response status is 2xx
                showMessageBox('Survey submitted successfully!');
                surveyForm.reset();

                //  click OK on the message box before redirecting
                messageBoxClose.addEventListener('click', () => {
                    hideMessageBox();
                    window.location.href = '/view-results'; 
                }, { once: true }); 

                messageBoxOverlay.addEventListener('click', () => {
                    hideMessageBox();
                    window.location.href = '/view-results'; 
                }, { once: true });


            } else {
                showMessageBox(`Failed to submit survey: ${data.message || 'Unknown error'}`);
                console.error('Error submitting survey:', data.error || data.message || data);
            }
        } catch (error) {
            console.error('Network or parsing error during survey submission:', error);
            showMessageBox('A network error occurred or server response could not be processed. Please try again.');
        }
    }
});