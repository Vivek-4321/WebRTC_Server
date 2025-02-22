// // const express = require("express");
// // const app = express();
// // const bodyParser = require("body-parser");
// // const webrtc = require("wrtc");

// // let senderStream;

// // app.use(express.static("public"));
// // app.use(bodyParser.json());
// // app.use(bodyParser.urlencoded({ extended: true }));

// // app.post("/consumer", async ({ body }, res) => {
// //   const peer = new webrtc.RTCPeerConnection({
// //     iceServers: [
// //       {
// //         urls: "stun:stun.relay.metered.ca:80",
// //       },
// //       {
// //         urls: "turn:global.relay.metered.ca:80",
// //         username: "f5baae95181d1a3b2947f791",
// //         credential: "n67tiC1skstIO4zc",
// //       },
// //       {
// //         urls: "turn:global.relay.metered.ca:80?transport=tcp",
// //         username: "f5baae95181d1a3b2947f791",
// //         credential: "n67tiC1skstIO4zc",
// //       },
// //       {
// //         urls: "turn:global.relay.metered.ca:443",
// //         username: "f5baae95181d1a3b2947f791",
// //         credential: "n67tiC1skstIO4zc",
// //       },
// //       {
// //         urls: "turns:global.relay.metered.ca:443?transport=tcp",
// //         username: "f5baae95181d1a3b2947f791",
// //         credential: "n67tiC1skstIO4zc",
// //       },
// //     ],
// //   });
// //   const desc = new webrtc.RTCSessionDescription(body.sdp);
// //   await peer.setRemoteDescription(desc);
// //   senderStream
// //     .getTracks()
// //     .forEach((track) => peer.addTrack(track, senderStream));
// //   const answer = await peer.createAnswer();
// //   await peer.setLocalDescription(answer);
// //   const payload = {
// //     sdp: peer.localDescription,
// //   };

// //   res.json(payload);
// // });

// // app.post("/broadcast", async ({ body }, res) => {
// //   const peer = new webrtc.RTCPeerConnection({
// //     iceServers: [
// //       {
// //         urls: "stun:stun.relay.metered.ca:80",
// //       },
// //       {
// //         urls: "turn:global.relay.metered.ca:80",
// //         username: "f5baae95181d1a3b2947f791",
// //         credential: "n67tiC1skstIO4zc",
// //       },
// //       {
// //         urls: "turn:global.relay.metered.ca:80?transport=tcp",
// //         username: "f5baae95181d1a3b2947f791",
// //         credential: "n67tiC1skstIO4zc",
// //       },
// //       {
// //         urls: "turn:global.relay.metered.ca:443",
// //         username: "f5baae95181d1a3b2947f791",
// //         credential: "n67tiC1skstIO4zc",
// //       },
// //       {
// //         urls: "turns:global.relay.metered.ca:443?transport=tcp",
// //         username: "f5baae95181d1a3b2947f791",
// //         credential: "n67tiC1skstIO4zc",
// //       },
// //     ],
// //   });
// //   peer.ontrack = (e) => handleTrackEvent(e, peer);
// //   const desc = new webrtc.RTCSessionDescription(body.sdp);
// //   await peer.setRemoteDescription(desc);
// //   const answer = await peer.createAnswer();
// //   await peer.setLocalDescription(answer);
// //   const payload = {
// //     sdp: peer.localDescription,
// //   };
// //   console.log(payload);
// //   res.json(payload);
// // });

// // function handleTrackEvent(e, peer) {
// //   senderStream = e.streams[0];
// //   console.log(senderStream);
// // }

// // app.listen(5000, () => console.log("server started"));

// // const express = require("express");
// // const app = express();
// // const bodyParser = require("body-parser");
// // const webrtc = require("wrtc");

// // let senderStream;

// // app.use(express.static("public"));
// // app.use(bodyParser.json());
// // app.use(bodyParser.urlencoded({ extended: true }));

// // app.post("/consumer", async ({ body }, res) => {
// //   console.log("Consumer endpoint hit"); // Log when this endpoint is accessed
// //   console.log("Consumer received SDP:", body.sdp); // Log received SDP

// //   const peer = new webrtc.RTCPeerConnection({
// //     iceServers: [
// //       {
// //         urls: "stun:stun.relay.metered.ca:80",
// //       },
// //       {
// //         urls: "turn:global.relay.metered.ca:80",
// //         username: "f5baae95181d1a3b2947f791",
// //         credential: "n67tiC1skstIO4zc",
// //       },
// //       {
// //         urls: "turn:global.relay.metered.ca:80?transport=tcp",
// //         username: "f5baae95181d1a3b2947f791",
// //         credential: "n67tiC1skstIO4zc",
// //       },
// //       {
// //         urls: "turn:global.relay.metered.ca:443",
// //         username: "f5baae95181d1a3b2947f791",
// //         credential: "n67tiC1skstIO4zc",
// //       },
// //       {
// //         urls: "turns:global.relay.metered.ca:443?transport=tcp",
// //         username: "f5baae95181d1a3b2947f791",
// //         credential: "n67tiC1skstIO4zc",
// //       },
// //     ],
// //   });
// //   console.log("Consumer RTCPeerConnection created");

// //   try {
// //     const desc = new webrtc.RTCSessionDescription(body.sdp);
// //     console.log("Consumer Creating Remote Description", desc);
// //     await peer.setRemoteDescription(desc);
// //     console.log("Consumer Remote description set successfully");

// //     if (senderStream) {
// //       console.log("Consumer adding tracks from senderStream");
// //       senderStream.getTracks().forEach((track) => {
// //         console.log("Consumer Adding Track:", track);
// //         peer.addTrack(track, senderStream);
// //       });

// //       console.log("Consumer Tracks added from senderStream successfully");
// //     } else {
// //       console.warn("Consumer senderStream is not available yet");
// //     }

// //     const answer = await peer.createAnswer();
// //     console.log("Consumer Answer created:", answer);
// //     await peer.setLocalDescription(answer);
// //     console.log(
// //       "Consumer Local description set successfully:",
// //       peer.localDescription
// //     );

// //     const payload = {
// //       sdp: peer.localDescription,
// //     };

// //     res.json(payload);
// //     console.log("Consumer Sending answer back to client:", payload);
// //   } catch (error) {
// //     console.error("Consumer Error during connection process:", error);
// //     res.status(500).send("Error processing request");
// //   }
// // });

// // app.post("/broadcast", async ({ body }, res) => {
// //   console.log("Broadcast endpoint hit"); // Log when this endpoint is accessed
// //   console.log("Broadcast received SDP:", body.sdp); // Log received SDP
// //   const peer = new webrtc.RTCPeerConnection({
// //     iceServers: [
// //       {
// //         urls: "stun:stun.relay.metered.ca:80",
// //       },
// //       {
// //         urls: "turn:global.relay.metered.ca:80",
// //         username: "f5baae95181d1a3b2947f791",
// //         credential: "n67tiC1skstIO4zc",
// //       },
// //       {
// //         urls: "turn:global.relay.metered.ca:80?transport=tcp",
// //         username: "f5baae95181d1a3b2947f791",
// //         credential: "n67tiC1skstIO4zc",
// //       },
// //       {
// //         urls: "turn:global.relay.metered.ca:443",
// //         username: "f5baae95181d1a3b2947f791",
// //         credential: "n67tiC1skstIO4zc",
// //       },
// //       {
// //         urls: "turns:global.relay.metered.ca:443?transport=tcp",
// //         username: "f5baae95181d1a3b2947f791",
// //         credential: "n67tiC1skstIO4zc",
// //       },
// //     ],
// //   });

// //   console.log("Broadcaster RTCPeerConnection created");

// //   peer.ontrack = (e) => handleTrackEvent(e, peer);

// //   try {
// //     const desc = new webrtc.RTCSessionDescription(body.sdp);
// //     console.log("Broadcaster Creating Remote Description:", desc);
// //     await peer.setRemoteDescription(desc);
// //     console.log("Broadcaster remote description set successfully");

// //     const answer = await peer.createAnswer();
// //     console.log("Broadcaster answer created:", answer);

// //     await peer.setLocalDescription(answer);
// //     console.log("Broadcaster local description set:", peer.localDescription);

// //     const payload = {
// //       sdp: peer.localDescription,
// //     };
// //     console.log("Broadcaster Sending answer back to client:", payload);
// //     res.json(payload);
// //   } catch (error) {
// //     console.error("Broadcaster Error during connection process:", error);
// //     res.status(500).send("Error processing request");
// //   }
// // });

// // function handleTrackEvent(e, peer) {
// //   console.log("Track Event Received:", e); // Log the track event
// //   console.log("Streams in the track", e.streams);
// //   senderStream = e.streams[0];
// //   console.log("Sender Stream Captured:", senderStream);
// // }

// // app.listen(5000, () => console.log("server started"));

// // server.js
// const express = require("express");
// const app = express();
// const bodyParser = require("body-parser");
// const webrtc = require("@roamhq/wrtc");

// let senderStream;

// app.use(express.static("public"));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.post("/consumer", async ({ body }, res) => {
//   console.log("Consumer endpoint hit"); // Log when this endpoint is accessed
//   console.log("Consumer received SDP:", body.sdp); // Log received SDP

//   const peer = new webrtc.RTCPeerConnection({
//     iceServers: [
//       {
//         urls: "stun:stun.relay.metered.ca:80",
//       },
//       {
//         urls: "turn:global.relay.metered.ca:80",
//         username: "f5baae95181d1a3b2947f791",
//         credential: "n67tiC1skstIO4zc",
//       },
//       {
//         urls: "turn:global.relay.metered.ca:80?transport=tcp",
//         username: "f5baae95181d1a3b2947f791",
//         credential: "n67tiC1skstIO4zc",
//       },
//       {
//         urls: "turn:global.relay.metered.ca:443",
//         username: "f5baae95181d1a3b2947f791",
//         credential: "n67tiC1skstIO4zc",
//       },
//       {
//         urls: "turns:global.relay.metered.ca:443?transport=tcp",
//         username: "f5baae95181d1a3b2947f791",
//         credential: "n67tiC1skstIO4zc",
//       },
//     ],
//   });
//   console.log("Consumer RTCPeerConnection created");

//   try {
//     const desc = new webrtc.RTCSessionDescription(body.sdp);
//     console.log("Consumer Creating Remote Description", desc);
//     await peer.setRemoteDescription(desc);
//     console.log("Consumer Remote description set successfully");

//     if (senderStream) {
//       console.log("Consumer adding tracks from senderStream");
//       senderStream.getTracks().forEach((track) => {
//         console.log("Consumer Adding Track:", track, track.kind);
//         peer.addTrack(track, senderStream);
//       });

//       console.log("Consumer Tracks added from senderStream successfully");
//     } else {
//       console.warn("Consumer senderStream is not available yet");
//     }

//     const answer = await peer.createAnswer();
//     console.log("Consumer Answer created:", answer);
//     await peer.setLocalDescription(answer);
//     console.log(
//       "Consumer Local description set successfully:",
//       peer.localDescription
//     );

//     const payload = {
//       sdp: peer.localDescription,
//     };

//     console.log("Consumer Sending answer back to client:", payload);
//     res.json(payload);

//   } catch (error) {
//     console.error("Consumer Error during connection process:", error);
//     res.status(500).send("Error processing request");
//   }
// });

// app.post("/broadcast", async ({ body }, res) => {
//   console.log("Broadcast endpoint hit"); // Log when this endpoint is accessed
//   console.log("Broadcast received SDP:", body.sdp); // Log received SDP
//   const peer = new webrtc.RTCPeerConnection({
//     iceServers: [
//       {
//         urls: "stun:stun.relay.metered.ca:80",
//       },
//       {
//         urls: "turn:global.relay.metered.ca:80",
//         username: "f5baae95181d1a3b2947f791",
//         credential: "n67tiC1skstIO4zc",
//       },
//       {
//         urls: "turn:global.relay.metered.ca:80?transport=tcp",
//         username: "f5baae95181d1a3b2947f791",
//         credential: "n67tiC1skstIO4zc",
//       },
//       {
//         urls: "turn:global.relay.metered.ca:443",
//         username: "f5baae95181d1a3b2947f791",
//         credential: "n67tiC1skstIO4zc",
//       },
//       {
//         urls: "turns:global.relay.metered.ca:443?transport=tcp",
//         username: "f5baae95181d1a3b2947f791",
//         credential: "n67tiC1skstIO4zc",
//       },
//     ],
//   });

//   console.log("Broadcaster RTCPeerConnection created");

//   peer.ontrack = (e) => handleTrackEvent(e, peer);

//   try {
//     const desc = new webrtc.RTCSessionDescription(body.sdp);
//     console.log("Broadcaster Creating Remote Description:", desc);
//     await peer.setRemoteDescription(desc);
//     console.log("Broadcaster remote description set successfully");

//     const answer = await peer.createAnswer();
//     console.log("Broadcaster answer created:", answer);

//     await peer.setLocalDescription(answer);
//     console.log("Broadcaster local description set:", peer.localDescription);

//     const payload = {
//       sdp: peer.localDescription,
//     };
//     console.log("Broadcaster Sending answer back to client:", payload);
//     res.json(payload);
//   } catch (error) {
//     console.error("Broadcaster Error during connection process:", error);
//     res.status(500).send("Error processing request");
//   }
// });

// function handleTrackEvent(e, peer) {
//   console.log("Track Event Received:", e); // Log the track event
//   console.log("Streams in the track", e.streams);
//   senderStream = e.streams[0];
//   console.log("Sender Stream Captured:", senderStream);
// }

// app.listen(5000, () => console.log("server started"));

//server.js
const express = require("express");
const { Pool } = require("pg");
const crypto = require("crypto");
const cors = require("cors");
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
          "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING public_id",
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

        // Combine all data
        const profileData = {
          ...basicInfo.rows[0],
          ...dietaryPreferences.rows[0],
          ...healthGoals.rows[0],
          ...activityInfo.rows[0],
          ...medicalInfo.rows[0],
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
        // Update each table
        await pool.query(
          `UPDATE basic_info 
       SET name = $1, age = $2, gender = $3, height = $4, weight = $5, activity_level = $6 
       WHERE public_id = $7`,
          [name, age, gender, height, weight, activityLevel, publicId]
        );

        await pool.query(
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

        await pool.query(
          `UPDATE health_goals 
       SET primary_goal = $1, target_weight = $2 
       WHERE public_id = $3`,
          [primaryGoal, targetWeight, publicId]
        );

        await pool.query(
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

        await pool.query(
          `UPDATE medical_info 
       SET conditions = $1, medications = $2 
       WHERE public_id = $3`,
          [conditions || "", medications || "", publicId]
        );

        res.json({ message: "Profile updated successfully" });
      } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Server error", details: error.message });
      }
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
