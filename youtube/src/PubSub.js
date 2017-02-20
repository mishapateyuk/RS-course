class PubSub {
    constructor() {
        this.subscriptions = {};
    }

    on(eventName, handler) {
        if (this.subscriptions[eventName]) {
            this.subscriptions[eventName].push(handler);
        } else {
            this.subscriptions[eventName] = [handler];
        }
        return this;
    }

    trigger(eventName, ...args) {
        if (this.subscriptions[eventName]) {
            this.subscriptions[eventName].forEach((item) => {
                setTimeout(() => item.apply(null, args), 0);
            });
        }
        return this;
    }

    off(eventName, handler) {
        if (!this.subscriptions[eventName]) {
            return;
        } else {
            let index = this.subscriptions[eventName].indexOf(handler);
            this.subscriptions[eventName].splice(index, 1);
        }
    }
}

export default PubSub;