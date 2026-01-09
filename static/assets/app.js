function addTerminalEntry(agent, msg, className) {
    const logContainer = document.getElementById('event-log');
    if (!logContainer) return;

    const now = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const div = document.createElement('div');
    div.className = `log-entry ${className}`;
    div.innerHTML = `<span class="log-time">[${now}]</span> <span class="log-agent">${agent}:</span> ${msg}`;
    
    logContainer.appendChild(div);
    logContainer.scrollTop = logContainer.scrollHeight;
}

function runAgentMeshSimulation(traceId) {
    const logContainer = document.getElementById('event-log');
    
    addTerminalEntry("🌐 BUS", `Inbound message routed to topic: portfolio/v1 (Trace: ${traceId})`, "agent-bus");

    setTimeout(() => {
        addTerminalEntry("🤖 GEMINI", "Reasoning-Agent: Context window analyzed. Generating response...", "agent-ai");
    }, 400);

    setTimeout(() => {
        addTerminalEntry("📊 MESH", "Analytics-Agent: Performance metrics captured.", "agent-mesh");
    }, 1200);

    setTimeout(() => {
        addTerminalEntry("✅ MESH", `Execution flow finished for ${traceId}. Standby.`, "agent-bus");
    }, 2200);
}

async function sendMessage() {
    const inputField = document.getElementById('user-input');
    const chatWindow = document.getElementById('chat-window');
    const message = inputField.value.trim();

    if (!message) return;

    const userDiv = document.createElement('div');
    userDiv.className = 'message user-message';
    userDiv.textContent = message;
    chatWindow.appendChild(userDiv);
    
    inputField.value = '';
    chatWindow.scrollTop = chatWindow.scrollHeight;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        if (!response.ok) throw new Error('Network response was not ok');

const data = await response.json();
        console.log("Gemini Raw Data:", data);

        if (data.trace_id) {
            runAgentMeshSimulation(data.trace_id);
        }
        let aiText = "";
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            aiText = data.candidates[0].content.parts[0].text;
        } else if (data.error) {
            aiText = `**API Fehler:** ${data.error.message}`;
        } else {
            aiText = "Entschuldigung, ich konnte keine Antwort generieren. Prüfe die Server-Logs.";
            console.error("Unerwartete API Struktur:", data);
        }

        const aiDiv = document.createElement('div');
        aiDiv.className = 'message ai-message';
        aiDiv.innerHTML = marked.parse(aiText);
        
        chatWindow.appendChild(aiDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;

    } catch (error) {
        console.error('Error:', error);
        addTerminalEntry("❌ ERROR", "Failed to connect to Agent Mesh.", "error");
    }
}

document.getElementById('user-input')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});