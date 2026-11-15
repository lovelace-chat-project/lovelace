(() => {
    const CHAT_PORT = 8001;
    const protocol = location.protocol === "https:" ? "wss" : "ws";
    const sender = localStorage.chatSender ||= "Student-" + Math.random().toString(16).slice(2, 10);

    function addNotice(container, text) {
        const notice = document.createElement("p");
        notice.style.cssText = "color: #888; font-size: 0.9em; text-align: center; margin: 4px 0;";
        notice.textContent = text;
        container.append(notice);
    }

    function addMessage(container, message) {
        if (!container.dataset.started) {
            container.innerHTML = "";
            container.dataset.started = "true";
        }
        const line = document.createElement("div");
        line.style.margin = "6px 0";
        const name = document.createElement("strong");
        name.textContent = message.sender;
        const time = document.createElement("span");
        time.style.cssText = "color: #888; font-size: 0.85em; margin-left: 6px;";
        time.textContent = new Date(message.time).toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" });
        const text = document.createElement("div");
        text.textContent = message.text;
        line.append(name, time, text);
        container.append(line);
        container.scrollTop = container.scrollHeight;
    }

    function setupChat(widget) {
        widget.dataset.ready = "true";
        const container = widget.querySelector("#chat-messages-container");
        const input = widget.querySelector("#chat-input-field");
        const button = widget.querySelector("#chat-send-button");
        const room = encodeURIComponent(widget.dataset.room);
        const socket = new WebSocket(`${protocol}://${location.hostname}:${CHAT_PORT}/ws/chat/${room}/`);

        socket.onmessage = (event) => addMessage(container, JSON.parse(event.data));
        socket.onclose = () => addNotice(container, "Chat is offline. Reload the page to try again.");

        const send = () => {
            const text = input.value.trim();
            if (!text || socket.readyState !== WebSocket.OPEN) return;
            socket.send(JSON.stringify({ sender, text }));
            input.value = "";
        };
        button.addEventListener("click", send);
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") send();
        });
    }

    function findWidgets() {
        document.querySelectorAll("#custom-chat-widget[data-room]:not([data-ready])").forEach(setupChat);
    }

    function start() {
        findWidgets();
        new MutationObserver(findWidgets).observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }
})();