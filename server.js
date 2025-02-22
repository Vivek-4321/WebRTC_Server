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

// backend/server.js
const express = require("express");
const { Pool } = require("pg");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

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

app.post("/api/login", async (req, res) => {
  console.log("Called login");
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT public_id, password_hash FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const isValid = verifyPassword(password, result.rows[0].password_hash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.json({ publicId: result.rows[0].public_id });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/signup", async (req, res) => {
  console.log("Called signup");
  const { username, email, password } = req.body;
  try {
    const checkExisting = await pool.query(
      "SELECT username FROM users WHERE username = $1 OR email = $2",
      [username, email]
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

    res.json({ publicId: result.rows[0].public_id });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


