
// //server.js
// const express = require("express");
// const { Pool } = require("pg");
// const crypto = require("crypto");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// app.use(express.json());
// app.use(cors());

// // Create database pool
// const pool = new Pool({
//   connectionString: process.env.DB_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// const formatArrayForPostgres = (input) => {
//   // If input is null, undefined, or empty array
//   if (!input || (Array.isArray(input) && input.length === 0)) {
//     return "{}";
//   }

//   // If input is a string
//   if (typeof input === "string") {
//     // Return empty array if input is "Nothing"
//     if (input.toLowerCase() === "nothing") {
//       return "{}";
//     }

//     const items = input
//       .split(",")
//       .map((item) => item.trim())
//       .filter((item) => item && item.toLowerCase() !== "nothing")
//       .map((item) => `"${item.replace(/"/g, '""')}"`);

//     return items.length ? `{${items.join(",")}}` : "{}";
//   }

//   // If input is an array
//   if (Array.isArray(input)) {
//     const cleanedArray = input
//       .filter((item) => item && item.trim() && item.toLowerCase() !== "nothing")
//       .map((item) => `"${item.trim().replace(/"/g, '""')}"`);

//     return cleanedArray.length ? `{${cleanedArray.join(",")}}` : "{}";
//   }

//   return "{}";
// };

// // Test database connection before starting server
// async function startServer() {
//   try {
//     // Test the connection
//     const client = await pool.connect();
//     console.log("Database connection successful");

//     // Release the client back to the pool
//     client.release();

//     // Helper function to hash password
//     const hashPassword = (password) => {
//       const salt = crypto.randomBytes(16).toString("hex");
//       const hash = crypto
//         .pbkdf2Sync(password, salt, 1000, 64, "sha512")
//         .toString("hex");
//       return `${salt}:${hash}`;
//     };

//     // Helper function to verify password
//     const verifyPassword = (password, hashedPassword) => {
//       const [salt, hash] = hashedPassword.split(":");
//       const verifyHash = crypto
//         .pbkdf2Sync(password, salt, 1000, 64, "sha512")
//         .toString("hex");
//       return hash === verifyHash;
//     };

//     // Add a test endpoint
//     app.get("/api/test", (req, res) => {
//       res.json({ message: "Server is running" });
//     });

//     // Login endpoint
//     app.post("/api/login", async (req, res) => {
//       console.log("Login attempt received:", req.body.username);
//       const { username, password } = req.body;

//       try {
//         const result = await pool.query(
//           "SELECT public_id, password_hash FROM users WHERE username = $1",
//           [username]
//         );

//         console.log(
//           "Query result:",
//           result.rows.length > 0 ? "User found" : "User not found"
//         );

//         if (result.rows.length === 0) {
//           return res.status(401).json({ error: "User not found" });
//         }

//         const isValid = verifyPassword(password, result.rows[0].password_hash);
//         console.log("Password validation:", isValid ? "Success" : "Failed");

//         if (!isValid) {
//           return res.status(401).json({ error: "Invalid password" });
//         }

//         res.json({ publicId: result.rows[0].public_id });
//       } catch (error) {
//         console.error("Login error:", error);
//         res.status(500).json({ error: "Server error", details: error.message });
//       }
//     });

//     // Signup endpoint
//     app.post("/api/signup", async (req, res) => {
//       console.log("Signup attempt received:", req.body.username);
//       const { username, email, password } = req.body;

//       try {
//         const checkExisting = await pool.query(
//           "SELECT username FROM users WHERE username = $1 OR email = $2",
//           [username, email]
//         );

//         console.log(
//           "Existing user check:",
//           checkExisting.rows.length > 0 ? "User exists" : "New user"
//         );

//         if (checkExisting.rows.length > 0) {
//           return res
//             .status(400)
//             .json({ error: "Username or email already exists" });
//         }

//         const hashedPassword = hashPassword(password);
//         const result = await pool.query(
//           "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING public_id",
//           [username, email, hashedPassword]
//         );

//         console.log("User created successfully");
//         res.json({ publicId: result.rows[0].public_id });
//       } catch (error) {
//         console.error("Signup error:", error);
//         res.status(500).json({ error: "Server error", details: error.message });
//       }
//     });

//     app.post("/api/questionnaire", async (req, res) => {
//       const {
//         publicId,
//         name,
//         age,
//         gender,
//         height,
//         weight,
//         activityLevel,
//         dietType,
//         allergies,
//         intolerances,
//         primaryGoal,
//         targetWeight,
//         exerciseTypes,
//         workoutFrequency,
//         workoutDuration,
//         conditions,
//         medications,
//       } = req.body;

//       try {
//         // Insert basic info
//         await pool.query(
//           "INSERT INTO basic_info (public_id, name, age, gender, height, weight, activity_level) VALUES ($1, $2, $3, $4, $5, $6, $7)",
//           [publicId, name, age, gender, height, weight, activityLevel]
//         );

//         // Insert dietary preferences
//         await pool.query(
//           "INSERT INTO dietary_preferences (public_id, diet_type, allergies, intolerances) VALUES ($1, $2, $3, $4)",
//           [
//             publicId,
//             dietType,
//             formatArrayForPostgres(allergies),
//             formatArrayForPostgres(intolerances),
//           ]
//         );

//         // Insert health goals
//         await pool.query(
//           "INSERT INTO health_goals (public_id, primary_goal, target_weight) VALUES ($1, $2, $3)",
//           [publicId, primaryGoal, targetWeight]
//         );

//         // Insert activity info
//         await pool.query(
//           "INSERT INTO activity_info (public_id, exercise_type, workout_frequency, workout_duration) VALUES ($1, $2, $3, $4)",
//           [
//             publicId,
//             formatArrayForPostgres(exerciseTypes),
//             workoutFrequency,
//             workoutDuration,
//           ]
//         );

//         // Insert medical info - now using simple strings
//         await pool.query(
//           "INSERT INTO medical_info (public_id, conditions, medications) VALUES ($1, $2, $3)",
//           [publicId, conditions || "", medications || ""]
//         );

//         res.json({ message: "Questionnaire data saved successfully" });
//       } catch (error) {
//         console.error("Error saving questionnaire data:", error);
//         res.status(500).json({ error: "Server error", details: error.message });
//       }
//     });

//     // Add these endpoints to server.js before the server.listen() call

//     // Get profile data
//     app.get("/api/profile/:publicId", async (req, res) => {
//       const { publicId } = req.params;

//       try {
//         // Get all profile data from different tables
//         const basicInfo = await pool.query(
//           "SELECT * FROM basic_info WHERE public_id = $1",
//           [publicId]
//         );

//         const dietaryPreferences = await pool.query(
//           "SELECT * FROM dietary_preferences WHERE public_id = $1",
//           [publicId]
//         );

//         const healthGoals = await pool.query(
//           "SELECT * FROM health_goals WHERE public_id = $1",
//           [publicId]
//         );

//         const activityInfo = await pool.query(
//           "SELECT * FROM activity_info WHERE public_id = $1",
//           [publicId]
//         );

//         const medicalInfo = await pool.query(
//           "SELECT * FROM medical_info WHERE public_id = $1",
//           [publicId]
//         );

//         // Combine all data
//         const profileData = {
//           ...basicInfo.rows[0],
//           ...dietaryPreferences.rows[0],
//           ...healthGoals.rows[0],
//           ...activityInfo.rows[0],
//           ...medicalInfo.rows[0],
//           // Set default values for required fields if they're null
//           activityLevel: basicInfo.rows[0]?.activity_level || "Sedentary",
//           dietType: dietaryPreferences.rows[0]?.diet_type || "Non-vegetarian",
//           primaryGoal: healthGoals.rows[0]?.primary_goal || "Weight Loss",
//           gender: basicInfo.rows[0]?.gender || "Not Specified",
//         };

//         res.json(profileData);
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//         res.status(500).json({ error: "Server error", details: error.message });
//       }
//     });

//     // Update profile data
//     app.put("/api/profile/:publicId", async (req, res) => {
//       const { publicId } = req.params;
//       const {
//         name,
//         age,
//         gender = "Not Specified",
//         height,
//         weight,
//         activityLevel = "Sedentary",
//         dietType = "Non-vegetarian",
//         allergies = [],
//         intolerances = [],
//         primaryGoal = "Weight Loss",
//         targetWeight,
//         exerciseTypes = [],
//         workoutFrequency,
//         workoutDuration,
//         conditions = "",
//         medications = "",
//       } = req.body;

//       try {
//         // Start a transaction
//         const client = await pool.connect();
//         try {
//           await client.query("BEGIN");

//           // Update basic_info
//           await client.query(
//             `UPDATE basic_info 
//          SET name = $1, age = $2, gender = $3, height = $4, weight = $5, activity_level = $6 
//          WHERE public_id = $7`,
//             [name, age, gender, height, weight, activityLevel, publicId]
//           );

//           // Update dietary_preferences
//           await client.query(
//             `UPDATE dietary_preferences 
//          SET diet_type = $1, allergies = $2, intolerances = $3 
//          WHERE public_id = $4`,
//             [
//               dietType,
//               formatArrayForPostgres(allergies),
//               formatArrayForPostgres(intolerances),
//               publicId,
//             ]
//           );

//           // Update health_goals
//           await client.query(
//             `UPDATE health_goals 
//          SET primary_goal = $1, target_weight = $2 
//          WHERE public_id = $3`,
//             [primaryGoal, targetWeight, publicId]
//           );

//           // Update activity_info
//           await client.query(
//             `UPDATE activity_info 
//          SET exercise_type = $1, workout_frequency = $2, workout_duration = $3 
//          WHERE public_id = $4`,
//             [
//               formatArrayForPostgres(exerciseTypes),
//               workoutFrequency,
//               workoutDuration,
//               publicId,
//             ]
//           );

//           // Update medical_info
//           await client.query(
//             `UPDATE medical_info 
//          SET conditions = $1, medications = $2 
//          WHERE public_id = $3`,
//             [conditions || "", medications || "", publicId]
//           );

//           await client.query("COMMIT");
//           res.json({ message: "Profile updated successfully" });
//         } catch (e) {
//           await client.query("ROLLBACK");
//           throw e;
//         } finally {
//           client.release();
//         }
//       } catch (error) {
//         console.error("Error updating profile:", error);
//         res.status(500).json({ error: "Server error", details: error.message });
//       }
//     });

//     // Get exercises and progress for a user
//     app.get("/api/exercises/:publicId", async (req, res) => {
//       const { publicId } = req.params;

//       try {
//         // Get user's weight for calorie calculations
//         const userResult = await pool.query(
//           `SELECT weight FROM basic_info WHERE public_id = $1::uuid`,
//           [publicId]
//         );
//         const userWeight = userResult.rows[0]?.weight || 70; // Default to 70kg if not found

//         // Get today's exercises
//         const exercisesResult = await pool.query(
//           `SELECT exercise_list 
//            FROM daily_exercise_list 
//            WHERE public_id = $1::uuid 
//            AND date_generated = CURRENT_DATE`,
//           [publicId]
//         );

//         // Get completed exercises
//         const completedResult = await pool.query(
//           `SELECT exercise_name, duration_minutes 
//            FROM user_workout_progress 
//            WHERE public_id = $1::uuid 
//            AND date_completed = CURRENT_DATE`,
//           [publicId]
//         );

//         // Get daily calories
//         const caloriesResult = await pool.query(
//           `SELECT total_calories 
//            FROM daily_progress 
//            WHERE public_id = $1::uuid 
//            AND date_completed = CURRENT_DATE`,
//           [publicId]
//         );

//         const exercises = exercisesResult.rows[0]?.exercise_list || [];
//         const completed = completedResult.rows.map((row) => row.exercise_name);
//         const durations = completedResult.rows.reduce((acc, row) => {
//           acc[row.exercise_name] = row.duration_minutes;
//           return acc;
//         }, {});
//         const dailyCalories = caloriesResult.rows[0]?.total_calories || 0;

//         // Add durations to exercises
//         const exercisesWithDurations = exercises.map((exercise) => ({
//           ...exercise,
//           duration: durations[exercise.Exercise] || exercise.duration || 30,
//         }));

//         res.json({
//           exercises: exercisesWithDurations,
//           completed,
//           daily_calories: dailyCalories,
//         });
//       } catch (error) {
//         console.error("Error fetching exercises:", error);
//         res.status(500).json({ error: "Server error", details: error.message });
//       }
//     });

//     // Get weekly progress
//     app.get("/api/progress/:publicId", async (req, res) => {
//       const { publicId } = req.params;

//       try {
//         const result = await pool.query(
//           `WITH RECURSIVE dates AS (
//         SELECT CURRENT_DATE - INTERVAL '6 days' as date
//         UNION ALL
//         SELECT date + 1
//         FROM dates
//         WHERE date < CURRENT_DATE
//       )
//       SELECT 
//         d.date,
//         COALESCE(dp.total_calories, 0) as actual_calories,
//         COALESCE(
//           (SELECT COUNT(DISTINCT exercise_name)
//            FROM user_workout_progress
//            WHERE public_id = $1::uuid
//            AND date_completed = d.date), 
//           0
//         ) as exercises_completed
//       FROM dates d
//       LEFT JOIN daily_progress dp ON 
//         dp.public_id = $1::uuid AND 
//         dp.date_completed = d.date
//       ORDER BY d.date`,
//           [publicId]
//         );

//         res.json(result.rows);
//       } catch (error) {
//         console.error("Error fetching progress:", error);
//         res.status(500).json({ error: "Server error", details: error.message });
//       }
//     });

//     // Complete an exercise
//     app.post("/api/complete-exercise", async (req, res) => {
//       const { publicId, exercise, calories, duration } = req.body;
    
//       try {
//         const client = await pool.connect();
//         try {
//           await client.query("BEGIN");
    
//           // Add exercise completion record with duration
//           await client.query(
//             `INSERT INTO user_workout_progress 
//             (public_id, exercise_name, calories_burned, duration_minutes, date_completed)
//             VALUES ($1::uuid, $2, $3, $4, CURRENT_DATE)
//             ON CONFLICT (public_id, exercise_name, date_completed) 
//             DO NOTHING`,
//             [publicId, exercise, calories, duration]
//           );
    
//           // Update daily calories with explicit date
//           await client.query(
//             `INSERT INTO daily_progress 
//             (public_id, total_calories, date_completed)
//             VALUES ($1::uuid, $2, CURRENT_DATE)
//             ON CONFLICT (public_id, date_completed) 
//             DO UPDATE SET 
//               total_calories = daily_progress.total_calories + EXCLUDED.total_calories,
//               updated_at = CURRENT_TIMESTAMP`,
//             [publicId, calories]
//           );
    
//           await client.query("COMMIT");
//           res.json({ message: "Exercise completed successfully" });
//         } catch (e) {
//           await client.query("ROLLBACK");
//           throw e;
//         } finally {
//           client.release();
//         }
//       } catch (error) {
//         console.error("Error completing exercise:", error);
//         res.status(500).json({ error: "Server error", details: error.message });
//       }
//     });

//     // Remove completed exercise
//     app.post("/api/remove-exercise", async (req, res) => {
//       const { publicId, exercise, calories } = req.body;

//       try {
//         // Start a transaction
//         const client = await pool.connect();
//         try {
//           await client.query("BEGIN");

//           // Remove exercise completion record
//           await client.query(
//             `DELETE FROM user_workout_progress
//         WHERE public_id = $1::uuid 
//         AND exercise_name = $2 
//         AND date_completed = CURRENT_DATE`,
//             [publicId, exercise]
//           );

//           // Update daily calories
//           await client.query(
//             `UPDATE daily_progress
//         SET total_calories = GREATEST(0, total_calories - $2),
//             updated_at = CURRENT_TIMESTAMP
//         WHERE public_id = $1::uuid 
//         AND date_completed = CURRENT_DATE`,
//             [publicId, calories]
//           );

//           await client.query("COMMIT");
//           res.json({ message: "Exercise removed successfully" });
//         } catch (e) {
//           await client.query("ROLLBACK");
//           throw e;
//         } finally {
//           client.release();
//         }
//       } catch (error) {
//         console.error("Error removing exercise:", error);
//         res.status(500).json({ error: "Server error", details: error.message });
//       }
//     });

//     // Generate daily exercises for a user
//     app.post("/api/generate-exercises", async (req, res) => {
//       const { publicId } = req.body;

//       try {
//         await pool.query("SELECT generate_daily_exercises($1::uuid)", [
//           publicId,
//         ]);

//         // Fetch the generated exercises
//         const result = await pool.query(
//           `SELECT exercise_list 
//        FROM daily_exercise_list 
//        WHERE public_id = $1::uuid 
//        AND date_generated = CURRENT_DATE`,
//           [publicId]
//         );

//         res.json({
//           message: "Exercises generated successfully",
//           exercises: result.rows[0]?.exercise_list || [],
//         });
//       } catch (error) {
//         console.error("Error generating exercises:", error);
//         res.status(500).json({ error: "Server error", details: error.message });
//       }
//     });

//     // Get all available exercises with proper formatting
//     app.get("/api/available-exercises", async (req, res) => {
//       try {
//         const result = await pool.query(`
//           SELECT 
//             exercise_name AS "Exercise",
//             description AS "Description",
//             target_muscles AS "Target Muscles",
//             met_value AS "MET Value",
//             category AS "Category",
//             duration AS "duration",
//             estimated_calories AS "Estimated_Calories",
//             modified_reps_sets AS "Modified_Reps_Sets"
//           FROM exercises 
//           ORDER BY exercise_name
//         `);
//         res.json(result.rows);
//       } catch (error) {
//         console.error("Error fetching available exercises:", error);
//         res.status(500).json({ error: "Server error" });
//       }
//     });

//     // Add exercise to user's daily list
//     app.post("/api/add-exercise", async (req, res) => {
//       const { publicId, exercise } = req.body;

//       try {
//         const client = await pool.connect();
//         try {
//           await client.query("BEGIN");

//           let result = await client.query(
//             `SELECT exercise_list 
//              FROM daily_exercise_list 
//              WHERE public_id = $1::uuid 
//              AND date_generated = CURRENT_DATE`,
//             [publicId]
//           );

//           let exercises = result.rows[0]?.exercise_list || [];

//           if (!exercises.find((e) => e.Exercise === exercise.Exercise)) {
//             const formattedExercise = {
//               Exercise: exercise.Exercise,
//               Description: exercise.Description,
//               "Target Muscles": exercise["Target Muscles"],
//               "MET Value": exercise["MET Value"],
//               Estimated_Calories: exercise.Estimated_Calories,
//               duration: exercise.duration || 30,
//               Category: exercise.Category,
//             };

//             exercises = [...exercises, formattedExercise];

//             await client.query(
//               `INSERT INTO daily_exercise_list (public_id, exercise_list)
//                VALUES ($1::uuid, $2::jsonb)
//                ON CONFLICT (public_id, date_generated) 
//                DO UPDATE SET exercise_list = $2::jsonb`,
//               [publicId, JSON.stringify(exercises)]
//             );
//           }

//           await client.query("COMMIT");
//           res.json({ message: "Exercise added successfully" });
//         } catch (e) {
//           await client.query("ROLLBACK");
//           throw e;
//         } finally {
//           client.release();
//         }
//       } catch (error) {
//         console.error("Error adding exercise:", error);
//         res.status(500).json({ error: "Server error" });
//       }
//     });

//     // Get weekly stats
//     app.get("/api/weekly-stats/:publicId", async (req, res) => {
//       const { publicId } = req.params;
//       try {
//         const result = await pool.query(
//           `WITH RECURSIVE dates AS (
//             SELECT CURRENT_DATE - INTERVAL '6 days' as date
//             UNION ALL
//             SELECT date + INTERVAL '1 day'
//             FROM dates
//             WHERE date < CURRENT_DATE + INTERVAL '1 day'
//           )
//           SELECT 
//             d.date,
//             COALESCE(dp.total_calories, 0) as calories,
//             COALESCE(
//               (SELECT COUNT(*) * 100.0 / NULLIF((
//                 SELECT COUNT(*) 
//                 FROM daily_exercise_list del 
//                 CROSS JOIN jsonb_array_elements(del.exercise_list)
//                 WHERE del.public_id = $1::uuid 
//                 AND del.date_generated = d.date
//               ), 0)
//                FROM user_workout_progress wp
//                WHERE wp.public_id = $1::uuid
//                AND wp.date_completed = d.date), 
//               0
//             ) as completion_rate
//           FROM dates d
//           LEFT JOIN daily_progress dp ON 
//             dp.public_id = $1::uuid AND 
//             dp.date_completed = d.date
//           ORDER BY d.date`,
//           [publicId]
//         );

//         const stats = {
//           dates: result.rows.map((r) => r.date.toISOString().split("T")[0]),
//           calories: result.rows.map((r) => Math.round(r.calories || 0)),
//           completion: result.rows.map((r) =>
//             Math.round(r.completion_rate || 0)
//           ),
//         };

//         res.json(stats);
//       } catch (error) {
//         console.error("Error fetching weekly stats:", error);
//         res.status(500).json({
//           dates: [],
//           calories: [],
//           completion: [],
//         });
//       }
//     });

//     // Start the server
//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error("Database connection error:", error);
//     process.exit(1);
//   }
// }

// // Start the server
// console.log("Starting server...");
// console.log("Database URL:", process.env.DB_URL ? "Is set" : "Not set");
// startServer();



const express = require("express");
const { Pool } = require("pg");
const crypto = require("crypto");
const cors = require("cors");
const axios = require("axios");
const cron = require("node-cron");
const { Expo } = require("expo-server-sdk");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Create database pool
const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Initialize Expo SDK for push notifications
const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

const formatArrayForPostgres = (input) => {
  // If input is null, undefined, or empty array
  if (!input || (Array.isArray(input) && input.length === 0)) {
    return "{}";
  }

  // If input is a string
  if (typeof input === "string") {
    // Return empty array if input is "Nothing"
    if (input.toLowerCase() === "nothing") {
      return "{}";
    }

    const items = input
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item && item.toLowerCase() !== "nothing")
      .map((item) => `"${item.replace(/"/g, '""')}"`);

    return items.length ? `{${items.join(",")}}` : "{}";
  }

  // If input is an array
  if (Array.isArray(input)) {
    const cleanedArray = input
      .filter((item) => item && item.trim() && item.toLowerCase() !== "nothing")
      .map((item) => `"${item.trim().replace(/"/g, '""')}"`);

    return cleanedArray.length ? `{${cleanedArray.join(",")}}` : "{}";
  }

  return "{}";
};

// Generate a new nutritional tip using OpenAI
async function generateNutritionalTip() {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: 
              "You are a nutrition expert. Generate a short, interesting nutritional fact or tip. " +
              "Each tip should be informative, accurate, and helpful for someone trying to improve their diet " +
              "or nutritional knowledge. Keep it between 1-3 sentences. " +
              "Format your response as a JSON object with the following fields: " +
              "tip: the nutritional tip or fact, " +
              "source: a credible source for this information (or 'Nutritional Science' if general knowledge), " +
              "category: one of the following categories: 'Diet Tip', 'Nutrition Fact', 'Health Insight', 'Food Science', 'Metabolism'"
          },
          {
            role: "user",
            content: "Generate a nutritional tip or fact."
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    const content = response.data.choices[0].message.content;
    try {
      // Parse the JSON from the response
      const tipData = JSON.parse(content);
      return tipData;
    } catch (parseError) {
      console.error("Error parsing OpenAI response as JSON:", parseError);
      // Fallback tip
      return {
        tip: "Drinking water before meals can help you feel fuller and potentially consume fewer calories.",
        source: "Nutritional Science",
        category: "Diet Tip"
      };
    }
  } catch (error) {
    console.error("Error generating tip with OpenAI:", error);
    // Fallback tip
    return {
      tip: "Eating a diet rich in colorful fruits and vegetables provides a wide range of antioxidants that help protect your cells from damage.",
      source: "Nutritional Science",
      category: "Nutrition Fact"
    };
  }
}

// Send push notifications for new nutritional tips
async function sendTipNotifications() {
  console.log("Starting scheduled tip notifications job");
  
  try {
    // Get all users with their tip preferences and push tokens
    const result = await pool.query(`
      WITH latest_tips AS (
        SELECT id, tip, category, source, created_at 
        FROM nutritional_tips 
        ORDER BY created_at DESC 
        LIMIT 1
      )
      SELECT 
        u.public_id, 
        bi.name,
        u.push_token, 
        u.tip_frequency, 
        u.notifications_enabled,
        u.last_seen_tip_id,
        lt.id as latest_tip_id,
        lt.tip as latest_tip
      FROM users u
      JOIN basic_info bi ON u.public_id = bi.public_id
      CROSS JOIN latest_tips lt
      WHERE u.tip_frequency != 'never' 
        AND u.notifications_enabled = true 
        AND u.push_token IS NOT NULL
    `);

    console.log(`Found ${result.rows.length} users with notification preferences`);
    
    // Prepare messages for all eligible users
    let messages = [];
    const now = new Date();
    
    for (const user of result.rows) {
      // Skip if user has already seen the latest tip
      if (user.last_seen_tip_id === user.latest_tip_id) {
        continue;
      }
      
      // Check if we should send notification based on frequency
      let shouldSend = false;
      
      switch (user.tip_frequency) {
        case 'hourly': 
          shouldSend = true; // Always send for hourly
          break;
        case 'daily':
          // Check if user has received a notification in the last 24 hours
          const dailyCheck = await pool.query(`
            SELECT created_at FROM notification_logs
            WHERE public_id = $1
            AND created_at > NOW() - INTERVAL '24 hours'
            ORDER BY created_at DESC
            LIMIT 1
          `, [user.public_id]);
          shouldSend = dailyCheck.rows.length === 0;
          break;
        case 'weekly':
          // Check if user has received a notification in the last 7 days
          const weeklyCheck = await pool.query(`
            SELECT created_at FROM notification_logs
            WHERE public_id = $1
            AND created_at > NOW() - INTERVAL '7 days'
            ORDER BY created_at DESC
            LIMIT 1
          `, [user.public_id]);
          shouldSend = weeklyCheck.rows.length === 0;
          break;
      }
      
      if (shouldSend && Expo.isExpoPushToken(user.push_token)) {
        // Add message to batch
        messages.push({
          to: user.push_token,
          sound: 'default',
          title: 'New Nutritional Tip',
          body: user.latest_tip.length > 100 
            ? `${user.latest_tip.substring(0, 97)}...` 
            : user.latest_tip,
          data: { tipId: user.latest_tip_id },
        });
        
        // Log the notification
        await pool.query(`
          INSERT INTO notification_logs (public_id, notification_type, content)
          VALUES ($1, 'nutritional_tip', $2)
        `, [user.public_id, `Tip ID: ${user.latest_tip_id}`]);
      }
    }
    
    // Send notifications in chunks
    if (messages.length > 0) {
      let chunks = expo.chunkPushNotifications(messages);
      console.log(`Sending ${messages.length} notifications in ${chunks.length} chunks`);
      
      for (let chunk of chunks) {
        try {
          await expo.sendPushNotificationsAsync(chunk);
        } catch (error) {
          console.error('Error sending push notifications:', error);
        }
      }
    } else {
      console.log('No notifications to send');
    }
  } catch (error) {
    console.error('Error in sendTipNotifications:', error);
  }
}

// Test database connection before starting server
async function startServer() {
  try {
    // Test the connection
    const client = await pool.connect();
    console.log("Database connection successful");

    // Release the client back to the pool
    client.release();

    // Helper function to hash password
    const hashPassword = (password) => {
      const salt = crypto.randomBytes(16).toString("hex");
      const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, "sha512")
        .toString("hex");
      return `${salt}:${hash}`;
    };

    // Helper function to verify password
    const verifyPassword = (password, hashedPassword) => {
      const [salt, hash] = hashedPassword.split(":");
      const verifyHash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, "sha512")
        .toString("hex");
      return hash === verifyHash;
    };

    // Add a test endpoint
    app.get("/api/test", (req, res) => {
      res.json({ message: "Server is running" });
    });

    // Login endpoint
    app.post("/api/login", async (req, res) => {
      console.log("Login attempt received:", req.body.username);
      const { username, password } = req.body;

      try {
        const result = await pool.query(
          "SELECT public_id, password_hash FROM users WHERE username = $1",
          [username]
        );

        console.log(
          "Query result:",
          result.rows.length > 0 ? "User found" : "User not found"
        );

        if (result.rows.length === 0) {
          return res.status(401).json({ error: "User not found" });
        }

        const isValid = verifyPassword(password, result.rows[0].password_hash);
        console.log("Password validation:", isValid ? "Success" : "Failed");

        if (!isValid) {
          return res.status(401).json({ error: "Invalid password" });
        }

        res.json({ publicId: result.rows[0].public_id });
      } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
      }
    });

    // Signup endpoint
    app.post("/api/signup", async (req, res) => {
      console.log("Signup attempt received:", req.body.username);
      const { username, email, password } = req.body;

      try {
        const checkExisting = await pool.query(
          "SELECT username FROM users WHERE username = $1 OR email = $2",
          [username, email]
        );

        console.log(
          "Existing user check:",
          checkExisting.rows.length > 0 ? "User exists" : "New user"
        );

        if (checkExisting.rows.length > 0) {
          return res
            .status(400)
            .json({ error: "Username or email already exists" });
        }

        const hashedPassword = hashPassword(password);
        const result = await pool.query(
          "INSERT INTO users (username, email, password_hash, tip_frequency, notifications_enabled) VALUES ($1, $2, $3, 'daily', true) RETURNING public_id",
          [username, email, hashedPassword]
        );

        console.log("User created successfully");
        res.json({ publicId: result.rows[0].public_id });
      } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
      }
    });

    app.post("/api/questionnaire", async (req, res) => {
      const {
        publicId,
        name,
        age,
        gender,
        height,
        weight,
        activityLevel,
        dietType,
        allergies,
        intolerances,
        primaryGoal,
        targetWeight,
        exerciseTypes,
        workoutFrequency,
        workoutDuration,
        conditions,
        medications,
      } = req.body;

      try {
        // Insert basic info
        await pool.query(
          "INSERT INTO basic_info (public_id, name, age, gender, height, weight, activity_level) VALUES ($1, $2, $3, $4, $5, $6, $7)",
          [publicId, name, age, gender, height, weight, activityLevel]
        );

        // Insert dietary preferences
        await pool.query(
          "INSERT INTO dietary_preferences (public_id, diet_type, allergies, intolerances) VALUES ($1, $2, $3, $4)",
          [
            publicId,
            dietType,
            formatArrayForPostgres(allergies),
            formatArrayForPostgres(intolerances),
          ]
        );

        // Insert health goals
        await pool.query(
          "INSERT INTO health_goals (public_id, primary_goal, target_weight) VALUES ($1, $2, $3)",
          [publicId, primaryGoal, targetWeight]
        );

        // Insert activity info
        await pool.query(
          "INSERT INTO activity_info (public_id, exercise_type, workout_frequency, workout_duration) VALUES ($1, $2, $3, $4)",
          [
            publicId,
            formatArrayForPostgres(exerciseTypes),
            workoutFrequency,
            workoutDuration,
          ]
        );

        // Insert medical info - now using simple strings
        await pool.query(
          "INSERT INTO medical_info (public_id, conditions, medications) VALUES ($1, $2, $3)",
          [publicId, conditions || "", medications || ""]
        );

        res.json({ message: "Questionnaire data saved successfully" });
      } catch (error) {
        console.error("Error saving questionnaire data:", error);
        res.status(500).json({ error: "Server error", details: error.message });
      }
    });

    // Get profile data
    app.get("/api/profile/:publicId", async (req, res) => {
      const { publicId } = req.params;

      try {
        // Get all profile data from different tables
        const basicInfo = await pool.query(
          "SELECT * FROM basic_info WHERE public_id = $1",
          [publicId]
        );

        const dietaryPreferences = await pool.query(
          "SELECT * FROM dietary_preferences WHERE public_id = $1",
          [publicId]
        );

        const healthGoals = await pool.query(
          "SELECT * FROM health_goals WHERE public_id = $1",
          [publicId]
        );

        const activityInfo = await pool.query(
          "SELECT * FROM activity_info WHERE public_id = $1",
          [publicId]
        );

        const medicalInfo = await pool.query(
          "SELECT * FROM medical_info WHERE public_id = $1",
          [publicId]
        );

        // Get user tip settings
        const userSettings = await pool.query(
          "SELECT tip_frequency, last_seen_tip_id FROM users WHERE public_id = $1",
          [publicId]
        );

        // Combine all data
        const profileData = {
          ...basicInfo.rows[0],
          ...dietaryPreferences.rows[0],
          ...healthGoals.rows[0],
          ...activityInfo.rows[0],
          ...medicalInfo.rows[0],
          // Set default values for required fields if they're null
          activityLevel: basicInfo.rows[0]?.activity_level || "Sedentary",
          dietType: dietaryPreferences.rows[0]?.diet_type || "Non-vegetarian",
          primaryGoal: healthGoals.rows[0]?.primary_goal || "Weight Loss",
          gender: basicInfo.rows[0]?.gender || "Not Specified",
          // Add tip settings
          tip_frequency: userSettings.rows[0]?.tip_frequency || "daily",
          last_seen_tip_id: userSettings.rows[0]?.last_seen_tip_id || 0
        };

        res.json(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: "Server error", details: error.message });
      }
    });

    // Update profile data
    app.put("/api/profile/:publicId", async (req, res) => {
      const { publicId } = req.params;
      const {
        name,
        age,
        gender = "Not Specified",
        height,
        weight,
        activityLevel = "Sedentary",
        dietType = "Non-vegetarian",
        allergies = [],
        intolerances = [],
        primaryGoal = "Weight Loss",
        targetWeight,
        exerciseTypes = [],
        workoutFrequency,
        workoutDuration,
        conditions = "",
        medications = "",
      } = req.body;

      try {
        // Start a transaction
        const client = await pool.connect();
        try {
          await client.query("BEGIN");

          // Update basic_info
          await client.query(
            `UPDATE basic_info 
         SET name = $1, age = $2, gender = $3, height = $4, weight = $5, activity_level = $6 
         WHERE public_id = $7`,
            [name, age, gender, height, weight, activityLevel, publicId]
          );

          // Update dietary_preferences
          await client.query(
            `UPDATE dietary_preferences 
         SET diet_type = $1, allergies = $2, intolerances = $3 
         WHERE public_id = $4`,
            [
              dietType,
              formatArrayForPostgres(allergies),
              formatArrayForPostgres(intolerances),
              publicId,
            ]
          );

          // Update health_goals
          await client.query(
            `UPDATE health_goals 
         SET primary_goal = $1, target_weight = $2 
         WHERE public_id = $3`,
            [primaryGoal, targetWeight, publicId]
          );

          // Update activity_info
          await client.query(
            `UPDATE activity_info 
         SET exercise_type = $1, workout_frequency = $2, workout_duration = $3 
         WHERE public_id = $4`,
            [
              formatArrayForPostgres(exerciseTypes),
              workoutFrequency,
              workoutDuration,
              publicId,
            ]
          );

          // Update medical_info
          await client.query(
            `UPDATE medical_info 
         SET conditions = $1, medications = $2 
         WHERE public_id = $3`,
            [conditions || "", medications || "", publicId]
          );

          await client.query("COMMIT");
          res.json({ message: "Profile updated successfully" });
        } catch (e) {
          await client.query("ROLLBACK");
          throw e;
        } finally {
          client.release();
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Server error", details: error.message });
      }
    });

    // Get exercises and progress for a user
    app.get("/api/exercises/:publicId", async (req, res) => {
      const { publicId } = req.params;

      try {
        // Get user's weight for calorie calculations
        const userResult = await pool.query(
          `SELECT weight FROM basic_info WHERE public_id = $1::uuid`,
          [publicId]
        );
        const userWeight = userResult.rows[0]?.weight || 70; // Default to 70kg if not found

        // Get today's exercises
        const exercisesResult = await pool.query(
          `SELECT exercise_list 
           FROM daily_exercise_list 
           WHERE public_id = $1::uuid 
           AND date_generated = CURRENT_DATE`,
          [publicId]
        );

        // Get completed exercises
        const completedResult = await pool.query(
          `SELECT exercise_name, duration_minutes 
           FROM user_workout_progress 
           WHERE public_id = $1::uuid 
           AND date_completed = CURRENT_DATE`,
          [publicId]
        );

        // Get daily calories
        const caloriesResult = await pool.query(
          `SELECT total_calories 
           FROM daily_progress 
           WHERE public_id = $1::uuid 
           AND date_completed = CURRENT_DATE`,
          [publicId]
        );

        const exercises = exercisesResult.rows[0]?.exercise_list || [];
        const completed = completedResult.rows.map((row) => row.exercise_name);
        const durations = completedResult.rows.reduce((acc, row) => {
          acc[row.exercise_name] = row.duration_minutes;
          return acc;
        }, {});
        const dailyCalories = caloriesResult.rows[0]?.total_calories || 0;

        // Add durations to exercises
        const exercisesWithDurations = exercises.map((exercise) => ({
          ...exercise,
          duration: durations[exercise.Exercise] || exercise.duration || 30,
        }));

        res.json({
          exercises: exercisesWithDurations,
          completed,
          daily_calories: dailyCalories,
        });
      } catch (error) {
        console.error("Error fetching exercises:", error);
        res.status(500).json({ error: "Server error", details: error.message });
      }
    });

    // Get weekly progress
    app.get("/api/progress/:publicId", async (req, res) => {
      const { publicId } = req.params;

      try {
        const result = await pool.query(
          `WITH RECURSIVE dates AS (
        SELECT CURRENT_DATE - INTERVAL '6 days' as date
        UNION ALL
        SELECT date + 1
        FROM dates
        WHERE date < CURRENT_DATE
      )
      SELECT 
        d.date,
        COALESCE(dp.total_calories, 0) as actual_calories,
        COALESCE(
          (SELECT COUNT(DISTINCT exercise_name)
           FROM user_workout_progress
           WHERE public_id = $1::uuid
           AND date_completed = d.date), 
          0
        ) as exercises_completed
      FROM dates d
      LEFT JOIN daily_progress dp ON 
        dp.public_id = $1::uuid AND 
        dp.date_completed = d.date
      ORDER BY d.date`,
          [publicId]
        );

        res.json(result.rows);
      } catch (error) {
        console.error("Error fetching progress:", error);
        res.status(500).json({ error: "Server error", details: error.message });
      }
    });

    // Complete an exercise
    app.post("/api/complete-exercise", async (req, res) => {
      const { publicId, exercise, calories, duration } = req.body;
    
      try {
        const client = await pool.connect();
        try {
          await client.query("BEGIN");
    
          // Add exercise completion record with duration
          await client.query(
            `INSERT INTO user_workout_progress 
            (public_id, exercise_name, calories_burned, duration_minutes, date_completed)
            VALUES ($1::uuid, $2, $3, $4, CURRENT_DATE)
            ON CONFLICT (public_id, exercise_name, date_completed) 
            DO NOTHING`,
            [publicId, exercise, calories, duration]
          );
    
          // Update daily calories with explicit date
          await client.query(
            `INSERT INTO daily_progress 
            (public_id, total_calories, date_completed)
            VALUES ($1::uuid, $2, CURRENT_DATE)
            ON CONFLICT (public_id, date_completed) 
            DO UPDATE SET 
              total_calories = daily_progress.total_calories + EXCLUDED.total_calories,
              updated_at = CURRENT_TIMESTAMP`,
            [publicId, calories]
          );
    
          await client.query("COMMIT");
          res.json({ message: "Exercise completed successfully" });
        } catch (e) {
          await client.query("ROLLBACK");
          throw e;
        } finally {
          client.release();
        }
      } catch (error) {
        console.error("Error completing exercise:", error);
        res.status(500).json({ error: "Server error", details: error.message });
      }
    });

    // Remove completed exercise
    app.post("/api/remove-exercise", async (req, res) => {
      const { publicId, exercise, calories } = req.body;

      try {
        // Start a transaction
        const client = await pool.connect();
        try {
          await client.query("BEGIN");

          // Remove exercise completion record
          await client.query(
            `DELETE FROM user_workout_progress
        WHERE public_id = $1::uuid 
        AND exercise_name = $2 
        AND date_completed = CURRENT_DATE`,
            [publicId, exercise]
          );

          // Update daily calories
          await client.query(
            `UPDATE daily_progress
        SET total_calories = GREATEST(0, total_calories - $2),
            updated_at = CURRENT_TIMESTAMP
        WHERE public_id = $1::uuid 
        AND date_completed = CURRENT_DATE`,
            [publicId, calories]
          );

          await client.query("COMMIT");
          res.json({ message: "Exercise removed successfully" });
        } catch (e) {
          await client.query("ROLLBACK");
          throw e;
        } finally {
          client.release();
        }
      } catch (error) {
        console.error("Error removing exercise:", error);
        res.status(500).json({ error: "Server error", details: error.message });
      }
    });

    // Generate daily exercises for a user
    app.post("/api/generate-exercises", async (req, res) => {
      const { publicId } = req.body;

      try {
        await pool.query("SELECT generate_daily_exercises($1::uuid)", [
          publicId,
        ]);

        // Fetch the generated exercises
        const result = await pool.query(
          `SELECT exercise_list 
       FROM daily_exercise_list 
       WHERE public_id = $1::uuid 
       AND date_generated = CURRENT_DATE`,
          [publicId]
        );

        res.json({
          message: "Exercises generated successfully",
          exercises: result.rows[0]?.exercise_list || [],
        });
      } catch (error) {
        console.error("Error generating exercises:", error);
        res.status(500).json({ error: "Server error", details: error.message });
      }
    });

    // Get all available exercises with proper formatting
    app.get("/api/available-exercises", async (req, res) => {
      try {
        const result = await pool.query(`
          SELECT 
            exercise_name AS "Exercise",
            description AS "Description",
            target_muscles AS "Target Muscles",
            met_value AS "MET Value",
            category AS "Category",
            duration AS "duration",
            estimated_calories AS "Estimated_Calories",
            modified_reps_sets AS "Modified_Reps_Sets"
          FROM exercises 
          ORDER BY exercise_name
        `);
        res.json(result.rows);
      } catch (error) {
        console.error("Error fetching available exercises:", error);
        res.status(500).json({ error: "Server error" });
      }
    });

    // Add exercise to user's daily list
    app.post("/api/add-exercise", async (req, res) => {
      const { publicId, exercise } = req.body;

      try {
        const client = await pool.connect();
        try {
          await client.query("BEGIN");

          let result = await client.query(
            `SELECT exercise_list 
             FROM daily_exercise_list 
             WHERE public_id = $1::uuid 
             AND date_generated = CURRENT_DATE`,
            [publicId]
          );

          let exercises = result.rows[0]?.exercise_list || [];

          if (!exercises.find((e) => e.Exercise === exercise.Exercise)) {
            const formattedExercise = {
              Exercise: exercise.Exercise,
              Description: exercise.Description,
              "Target Muscles": exercise["Target Muscles"],
              "MET Value": exercise["MET Value"],
              Estimated_Calories: exercise.Estimated_Calories,
              duration: exercise.duration || 30,
              Category: exercise.Category,
            };

            exercises = [...exercises, formattedExercise];

            await client.query(
              `INSERT INTO daily_exercise_list (public_id, exercise_list)
               VALUES ($1::uuid, $2::jsonb)
               ON CONFLICT (public_id, date_generated) 
               DO UPDATE SET exercise_list = $2::jsonb`,
              [publicId, JSON.stringify(exercises)]
            );
          }

          await client.query("COMMIT");
          res.json({ message: "Exercise added successfully" });
        } catch (e) {
          await client.query("ROLLBACK");
          throw e;
        } finally {
          client.release();
        }
      } catch (error) {
        console.error("Error adding exercise:", error);
        res.status(500).json({ error: "Server error" });
      }
    });

    // Get weekly stats
    app.get("/api/weekly-stats/:publicId", async (req, res) => {
      const { publicId } = req.params;
      try {
        const result = await pool.query(
          `WITH RECURSIVE dates AS (
            SELECT CURRENT_DATE - INTERVAL '6 days' as date
            UNION ALL
            SELECT date + INTERVAL '1 day'
            FROM dates
            WHERE date < CURRENT_DATE + INTERVAL '1 day'
          )
          SELECT 
            d.date,
            COALESCE(dp.total_calories, 0) as calories,
            COALESCE(
              (SELECT COUNT(*) * 100.0 / NULLIF((
                SELECT COUNT(*) 
                FROM daily_exercise_list del 
                CROSS JOIN jsonb_array_elements(del.exercise_list)
                WHERE del.public_id = $1::uuid 
                AND del.date_generated = d.date
              ), 0)
               FROM user_workout_progress wp
               WHERE wp.public_id = $1::uuid
               AND wp.date_completed = d.date), 
              0
            ) as completion_rate
          FROM dates d
          LEFT JOIN daily_progress dp ON 
            dp.public_id = $1::uuid AND 
            dp.date_completed = d.date
          ORDER BY d.date`,
          [publicId]
        );

        const stats = {
          dates: result.rows.map((r) => r.date.toISOString().split("T")[0]),
          calories: result.rows.map((r) => Math.round(r.calories || 0)),
          completion: result.rows.map((r) =>
            Math.round(r.completion_rate || 0)
          ),
        };

        res.json(stats);
      } catch (error) {
        console.error("Error fetching weekly stats:", error);
        res.status(500).json({
          dates: [],
          calories: [],
          completion: [],
        });
      }
    });

    // NUTRITIONAL TIPS ENDPOINTS

    // Create a new nutritional tip
    app.post("/api/create-nutritional-tip", async (req, res) => {
      try {
        const tipData = await generateNutritionalTip();

        const result = await pool.query(
          `INSERT INTO nutritional_tips (tip, source, category) 
          VALUES ($1, $2, $3) 
          RETURNING id, tip, source, category, created_at`,
          [tipData.tip, tipData.source, tipData.category]
        );

        res.json({ 
          message: "Nutritional tip created successfully", 
          tip: result.rows[0]
        });
      } catch (error) {
        console.error("Error creating nutritional tip:", error);
        res.status(500).json({ error: "Failed to create nutritional tip" });
      }
    });

    // Get latest nutritional tip for user
    app.get("/api/nutritional-tips/:publicId", async (req, res) => {
      const { publicId } = req.params;

      try {
        // Get the latest nutritional tip
        const tipResult = await pool.query(
          `SELECT * FROM nutritional_tips
           ORDER BY created_at DESC
           LIMIT 1`
        );

        if (tipResult.rows.length === 0) {
          // No tips exist, create a new one
          const tipData = await generateNutritionalTip();
          
          const newTipResult = await pool.query(
            `INSERT INTO nutritional_tips (tip, source, category) 
             VALUES ($1, $2, $3) 
             RETURNING id, tip, source, category, created_at`,
            [tipData.tip, tipData.source, tipData.category]
          );

          // Get the user's last seen tip
          const userResult = await pool.query(
            `SELECT last_seen_tip_id FROM users
             WHERE public_id = $1`,
            [publicId]
          );

          const lastSeenTipId = userResult.rows[0]?.last_seen_tip_id || 0;
          const isNewTip = lastSeenTipId < newTipResult.rows[0].id;

          res.json({ 
            tip: newTipResult.rows[0],
            isNew: isNewTip
          });
        } else {
          // Get the user's last seen tip
          const userResult = await pool.query(
            `SELECT last_seen_tip_id FROM users
             WHERE public_id = $1`,
            [publicId]
          );

          const lastSeenTipId = userResult.rows[0]?.last_seen_tip_id || 0;
          const isNewTip = lastSeenTipId < tipResult.rows[0].id;

          res.json({ 
            tip: tipResult.rows[0],
            isNew: isNewTip
          });
        }
      } catch (error) {
        console.error("Error fetching nutritional tip:", error);
        res.status(500).json({ error: "Failed to fetch nutritional tip" });
      }
    });

    // Mark tip as seen
    app.post("/api/mark-tip-seen/:publicId", async (req, res) => {
      const { publicId } = req.params;
      const { tipId } = req.body;

      try {
        await pool.query(
          `UPDATE users
           SET last_seen_tip_id = $1
           WHERE public_id = $2`,
          [tipId, publicId]
        );

        res.json({ message: "Tip marked as seen" });
      } catch (error) {
        console.error("Error marking tip as seen:", error);
        res.status(500).json({ error: "Failed to update tip status" });
      }
    });

    // Update tip settings
    app.post("/api/update-tip-settings/:publicId", async (req, res) => {
      const { publicId } = req.params;
      const { tipFrequency, notificationsEnabled } = req.body;

      try {
        // Validate frequency value
        const validFrequencies = ['hourly', 'daily', 'weekly', 'never'];
        if (!validFrequencies.includes(tipFrequency)) {
          return res.status(400).json({ error: "Invalid frequency value" });
        }

        await pool.query(
          `UPDATE users
           SET tip_frequency = $1, notifications_enabled = $2
           WHERE public_id = $3`,
          [tipFrequency, notificationsEnabled, publicId]
        );

        res.json({ message: "Tip settings updated successfully" });
      } catch (error) {
        console.error("Error updating tip settings:", error);
        res.status(500).json({ error: "Failed to update tip settings" });
      }
    });

    // Register push notification token
    app.post("/api/register-push-token/:publicId", async (req, res) => {
      const { publicId } = req.params;
      const { token } = req.body;

      try {
        // Validate token
        if (!token || typeof token !== 'string') {
          return res.status(400).json({ error: "Invalid token" });
        }

        await pool.query(
          `UPDATE users
           SET push_token = $1
           WHERE public_id = $2`,
          [token, publicId]
        );

        res.json({ message: "Push token registered successfully" });
      } catch (error) {
        console.error("Error registering push token:", error);
        res.status(500).json({ error: "Failed to register push token" });
      }
    });

    // Schedule cronjobs
    
    // Generate a new nutritional tip daily at midnight
    cron.schedule('0 0 * * *', async () => {
      try {
        console.log('Running scheduled task: Generate new nutritional tip');
        const tipData = await generateNutritionalTip();
        
        await pool.query(
          `INSERT INTO nutritional_tips (tip, source, category) 
           VALUES ($1, $2, $3)`,
          [tipData.tip, tipData.source, tipData.category]
        );
        
        console.log('New nutritional tip generated successfully');
      } catch (error) {
        console.error('Error in scheduled task - Generate nutritional tip:', error);
      }
    });

    // Send push notifications at different frequencies
    
    // Hourly notifications (check every hour)
    cron.schedule('0 * * * *', () => {
      sendTipNotifications();
    });

    // Daily notifications (9 AM)
    cron.schedule('0 9 * * *', () => {
      sendTipNotifications();
    });

    // Weekly notifications (Monday 9 AM)
    cron.schedule('0 9 * * 1', () => {
      sendTipNotifications();
    });

    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}

// Start the server
console.log("Starting server...");
console.log("Database URL:", process.env.DB_URL ? "Is set" : "Not set");
startServer();