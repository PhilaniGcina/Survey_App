const pool = require('../db/pool'); // Import the database pool

const surveyController = {
    // Controller for submitting a new survey
    submitSurvey: async (req, res) => {
        const {
            fullName,
            email,
            dob, 
            contactNumber,
            favoriteFood, 
            moviesRating,
            radioRating,
            eatOutRating,
            tvRating
        } = req.body;

        // Basic server-side validation
        if (!fullName || !email || !dob || !contactNumber ||
            !moviesRating || !radioRating || !eatOutRating || !tvRating ||
            !favoriteFood || favoriteFood.length === 0 
            ) {
            return res.status(400).json({ message: 'All personal details, favorite foods, and ratings are required.' });
        }

        // Age validation
        const dateOfBirthObject = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - dateOfBirthObject.getFullYear();
        const m = today.getMonth() - dateOfBirthObject.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dateOfBirthObject.getDate())) {
            age--;
        }
        if (age < 5 || age > 120) {
            return res.status(400).json({ message: 'Age must be between 5 and 120.' });
        }

        try {
            
            const result = await pool.query(
                `INSERT INTO surveys (full_names, email, date_of_birth, contact_number, favorite_foods, movies_rating, radio_rating, eat_out_rating, tv_rating)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
                [fullName, email, dob, contactNumber, favoriteFood,
                 parseInt(moviesRating), parseInt(radioRating), parseInt(eatOutRating), parseInt(tvRating)]
            );
            res.status(201).json({ message: 'Survey submitted successfully!', surveyId: result.rows[0].id });
        
        } catch (error) {
            console.error('Error submitting survey:', error.message);
            res.status(500).json({ message: 'Error submitting survey', error: error.message });
        }
    },

    // Controller for fetching survey results
    getSurveyResults: async (req, res) => {
        try {
            const totalSurveysResult = await pool.query('SELECT COUNT(*) FROM surveys');
            const totalSurveys = parseInt(totalSurveysResult.rows[0].count);

            if (totalSurveys === 0) {
                return res.json({
                    totalSurveys: 0,
                    averageAge: 0, 
                    oldestAge: 0,
                    youngestAge: 0,
                    pizzaPercentage: 0,
                    pastaPercentage: 0,
                    papWorsPercentage: 0,
                    moviesAvgRating: 0,
                    radioAvgRating: 0,
                    eatOutAvgRating: 0,
                    tvAvgRating: 0,
                    message: "No Surveys Available."
                });
            }

        
            const ageResults = await pool.query(`
                SELECT
                    TRUNC(AVG(EXTRACT(YEAR FROM AGE(NOW(), date_of_birth)))::numeric, 1) AS average_age,
                    MAX(EXTRACT(YEAR FROM AGE(NOW(), date_of_birth))) AS oldest_age,
                    MIN(EXTRACT(YEAR FROM AGE(NOW(), date_of_birth))) AS youngest_age
                FROM surveys;
            `);
            const { average_age, oldest_age, youngest_age } = ageResults.rows[0];

            const foodPercentages = await pool.query(`
                SELECT
                    TRUNC((COUNT(*) FILTER (WHERE 'Pizza' = ANY(favorite_foods))::numeric * 100 / ${totalSurveys}), 1) AS pizza_percentage,
                    TRUNC((COUNT(*) FILTER (WHERE 'Pasta' = ANY(favorite_foods))::numeric * 100 / ${totalSurveys}), 1) AS pasta_percentage,
                    TRUNC((COUNT(*) FILTER (WHERE 'Pap and Wors' = ANY(favorite_foods))::numeric * 100 / ${totalSurveys}), 1) AS pap_wors_percentage
                FROM surveys;
            `);
            // Add default to 0 if no results for food percentages
            const { pizza_percentage, pasta_percentage, pap_wors_percentage } = foodPercentages.rows[0] || {};


            const ratingsResults = await pool.query(`
                SELECT
                    TRUNC(AVG(movies_rating)::numeric, 1) AS movies_avg_rating,
                    TRUNC(AVG(radio_rating)::numeric, 1) AS radio_avg_rating,
                    TRUNC(AVG(eat_out_rating)::numeric, 1) AS eat_out_avg_rating,
                    TRUNC(AVG(tv_rating)::numeric, 1) AS tv_avg_rating
                FROM surveys;
            `);
            // Add default to 0 if no results for ratings
            const { movies_avg_rating, radio_avg_rating, eat_out_avg_rating, tv_avg_rating } = ratingsResults.rows[0] || {};

            res.json({
                totalSurveys: totalSurveys,
                averageAge: parseFloat(average_age || 0), 
                oldestAge: parseInt(oldest_age || 0),     
                youngestAge: parseInt(youngest_age || 0), 
                pizzaPercentage: parseFloat(pizza_percentage || 0),
                pastaPercentage: parseFloat(pasta_percentage || 0),
                papWorsPercentage: parseFloat(pap_wors_percentage || 0),
                moviesAvgRating: parseFloat(movies_avg_rating || 0),
                radioAvgRating: parseFloat(radio_avg_rating || 0),
                eatOutAvgRating: parseFloat(eat_out_avg_rating || 0),
                tvAvgRating: parseFloat(tv_avg_rating || 0)
            });

        } catch (error) {
            console.error('Error fetching survey results:', error.message);
            res.status(500).json({ message: 'Error fetching survey results', error: error.message });
        }
    }
};

module.exports = surveyController;