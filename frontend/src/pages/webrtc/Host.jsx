import React, { useRef, useState } from "react";

const Host = () => {
  const localVideoRef = useRef(null);
  const pcRef = useRef(null);

  const [offer, setOffer] = useState("");
  const [answerInput, setAnswerInput] = useState("");

  // STEP 1: Start camera
  const startCamera = async () => {
    console.log("🎥 Starting camera...");

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localVideoRef.current.srcObject = stream;

    // STEP 2: Create PeerConnection
    pcRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // STEP 3: Add camera tracks to WebRTC
    stream.getTracks().forEach((track) => {
      pcRef.current.addTrack(track, stream);
    });

    // ICE candidates (just log for now)
    pcRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("🧊 ICE Candidate:", event.candidate);
      }
    };

    console.log("✅ Camera & PeerConnection ready");
  };

  // STEP 4: Create Offer
  const createOffer = async () => {
    console.log("📤 Creating offer...");

    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);

    setOffer(JSON.stringify(offer, null, 2));

    console.log("✅ Offer created");
  };

  // STEP 5: Set Answer (paste from viewer later)
  const setAnswer = async () => {
    console.log("📥 Setting answer...");

    const answer = JSON.parse(answerInput);
    await pcRef.current.setRemoteDescription(answer);

    console.log("✅ Answer set, connection established");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>WebRTC Host – Learning Mode</h2>

      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        style={{ width: 300, background: "#000" }}
      />

      <div style={{ marginTop: 20 }}>
        <button onClick={startCamera}>1️⃣ Start Camera</button>
        <button onClick={createOffer}>2️⃣ Create Offer</button>
      </div>

      <h3>Offer (copy this)</h3>
      <textarea
        value={offer}
        readOnly
        rows={10}
        style={{ width: "100%" }}
      />

      <h3>Paste Answer Here</h3>
      <textarea
        rows={10}
        style={{ width: "100%" }}
        value={answerInput}
        onChange={(e) => setAnswerInput(e.target.value)}
      />

      <button onClick={setAnswer}>3️⃣ Set Answer</button>
    </div>
  );
};

export default Host;
