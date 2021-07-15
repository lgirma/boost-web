export class AppEvent<T = any> {
    private subscribers: ((eventData: T) => void)[] = []

    subscribe(callback: (eventData: T) => void) {
        this.subscribers.push(callback)
    }

    publish(data: T) {
        this.subscribers.forEach(sub => sub(data));
    }

    unsubscribe(callback: (eventData: T) => void) {
        this.subscribers = this.subscribers.filter(s => s != callback)
    }
}