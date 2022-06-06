class Tracker {
    SENDING_TIMEOUT_MS = 1000;
    SENDING_THRESHOLD = 3;
    API_URL = "/track";

    constructor() {
        this.buffer = [];
        this.senderTimerId = setTimeout(() => this.send(), this.SENDING_TIMEOUT_MS);

        this.bindListener();
    }

    bindListener() {
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden" && this.buffer.length > 0) {
                navigator.sendBeacon(this.API_URL, JSON.stringify(this.buffer));
            }
        });
    }

    async send() {
        if (this.senderTimerId) {
            clearTimeout(this.senderTimerId);
        }

        this.senderTimerId = setTimeout(() => this.send(), this.SENDING_TIMEOUT_MS);

        if (this.buffer.length < 1) {
            return;
        }

        const eventsForSending = this.buffer.splice(0, this.buffer.length);

        try {
            await fetch(this.API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(eventsForSending),
            });
        } catch (err) {
            this.buffer.push(...eventsForSending);
            console.error(err);
        }
    }

    track(event, ...tags) {
        this.buffer.push({
            event,
            tags,
            url: window.location.href,
            title: document.title,
            ts: new Date().toLocaleString({}, { hour12: false, timeZoneName: "short" }),
        });

        if (this.buffer.length >= this.SENDING_THRESHOLD) {
            this.send();
        }
    }
}

const tracker = new Tracker();
