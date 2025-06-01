import React, { useState, useEffect } from "react";

const GEMINI_API_KEY = "AIzaSyC1eku4AedgACYsBqXWF5E5HspM9oieoFs";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<
    { from: "bot" | "user"; text: string }[]
  >([
    { from: "bot", text: "👋 Bonjour! Pose-moi une question sur FastRide ou sur les voitures." },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [voitures, setVoitures] = useState<string[]>([]);

  // Charger la liste des voitures depuis l’API locale
  useEffect(() => {
    const fetchVoitures = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/voitures/AllVoitures");
        const data = await response.json();
        console.log(data.voitures);
        const noms = data.voitures.map((voiture: { name: string;prix_par_jour: number }) => voiture.name +" ,price "+voiture.prix_par_jour+" MAD"
      ); // suppose que chaque objet a un champ `nom`
        setVoitures(noms);
      } catch (error) {
        console.error("Erreur lors du chargement des voitures:", error);
      }
    };

    fetchVoitures();
  }, []);

  const getGeminiResponse = async (text: string): Promise<string> => {
    const msg = text.toLowerCase();

    if (!msg.trim()) return "😅 Tu dois écrire quelque chose.";

    if (msg.includes("contact")) {
      return "📞 Tu peux nous contacter via la page Contact.";
    }

    try {
      const catalogue =
         voitures.join(", ")

      const systemContext = `
Tu es un assistant automobile pour FastRide, une société de location de voitures. Voici les informations à connaître :
- Notre catalogue actuel inclut : ${catalogue}.
- Donne des réponses concises (max 3 phrases) et amicales.
- En français, tutoie l'utilisateur.
- Pour des questions hors sujet automobile, réponds poliment que tu ne peux aider que sur la location de voitures.
- N'invente jamais d'informations sur des modèles non listés ci-dessus.
      `;
      console.log("systemContext",systemContext);

      const requestBody = JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemContext },
              { text: text }
            ]
          }
        ]
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: requestBody
        }
      );

      if (!response.ok) throw new Error(`Erreur API: ${response.status}`);

      const result = await response.json();

      if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
        return result.candidates[0].content.parts[0].text.trim();
      } else {
        throw new Error("Format de réponse inattendu");
      }

    } catch (error) {
      console.error("Erreur Gemini:", error);

      if (msg.includes("prix") || msg.includes("coût")) {
        return "💵 Nos prix commencent à 30€/jour.";
      }
      if (msg.includes("voiture") || msg.includes("car")) {
        return "🚗 Tu peux voir nos voitures disponibles sur la page Cars.";
      }
      if (msg.includes("besoin") || msg.includes("condition")) {
        return "📝 Il faut un permis valide, une carte d'identité et être majeur (21+).";
      }

      return "🤔 Désolé, je n'ai pas pu répondre. Essaie une autre question.";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((msgs) => [...msgs, { from: "user", text: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const botResponse = await getGeminiResponse(userMessage);
      setMessages((msgs) => [...msgs, { from: "bot", text: botResponse }]);
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "🤖 Erreur de traitement. Réessaie." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div style={{
      position: "fixed", bottom: 20, right: 20, width: 300, height: 400,
      backgroundColor: "#f9fafb", border: "1px solid #ccc", borderRadius: 10,
      display: "flex", flexDirection: "column", boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", zIndex: 9999,
    }}>
      <div style={{
        backgroundColor: "#0d9488", color: "white", padding: "10px 15px",
        borderTopLeftRadius: 10, borderTopRightRadius: 10, fontWeight: "bold", fontSize: 16,
      }}>
        FastRide Assistant
      </div>

      <div style={{
        flex: 1, padding: 10, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8,
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
            backgroundColor: msg.from === "user" ? "#d1fae5" : "#14b8a6",
            color: msg.from === "user" ? "#064e3b" : "#fff",
            padding: "8px 12px", borderRadius: 15, maxWidth: "80%", wordWrap: "break-word",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div style={{
            alignSelf: "flex-start", backgroundColor: "#14b8a6", color: "#fff",
            padding: "8px 12px", borderRadius: 15, maxWidth: "80%", wordWrap: "break-word",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 8,
          }}>
            <span className="typing-indicator">
              <span className="dot"></span><span className="dot"></span><span className="dot"></span>
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes blink {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .dot {
          width: 6px;
          height: 6px;
          background-color: white;
          border-radius: 50%;
          animation: blink 1s infinite;
        }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      <div style={{
        borderTop: "1px solid #ccc", padding: 10, display: "flex", gap: 8,
      }}>
        <input
          type="text"
          placeholder={isLoading ? "Attends une réponse..." : "Écris ta question..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          style={{
            flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ccc", fontSize: 14,
            backgroundColor: isLoading ? "#f1f5f9" : "white",
          }}
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? "#94a3b8" : "#0d9488", color: "white",
            border: "none", padding: "8px 15px", borderRadius: 8,
            cursor: isLoading ? "not-allowed" : "pointer",
            fontWeight: "bold", fontSize: 14, minWidth: "80px",
          }}
        >
          {isLoading ? "..." : "Envoyer"}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
