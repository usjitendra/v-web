import React, { useRef, useState } from "react";

const Viewer = () => {
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);

  const [offerInput, setOfferInput] = useState("");
  const [answer, setAnswer] = useState("");

  const startViewer = async () => {
    console.log("👀 Starting viewer...");

    pcRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Receive remote stream
    pcRef.current.ontrack = (event) => {
      console.log("📺 Remote stream received");
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    pcRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("🧊 Viewer ICE:", event.candidate);
      }
    };
  };

  const createAnswer = async () => {
    console.log("📥 Setting offer...");

    const offer = JSON.parse(offerInput);
    await pcRef.current.setRemoteDescription(offer);

    console.log("📤 Creating answer...");
    const answer = await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answer);

    setAnswer(JSON.stringify(answer, null, 2));
    console.log("✅ Answer created");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>WebRTC Viewer – Learning Mode</h2>

      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        style={{ width: 300, background: "#000" }}
      />

      <div style={{ marginTop: 20 }}>
        <button onClick={startViewer}>1️⃣ Start Viewer</button>
      </div>

      <h3>Paste Offer Here</h3>
      <textarea
        rows={10}
        style={{ width: "100%" }}
        value={offerInput}
        onChange={(e) => setOfferInput(e.target.value)}
      />

      <button onClick={createAnswer}>2️⃣ Create Answer</button>

      <h3>Answer (copy this)</h3>
      <textarea
        value={answer}
        readOnly
        rows={10}
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default Viewer;
