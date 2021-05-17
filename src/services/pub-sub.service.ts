import { Subject, Subscription } from 'rxjs'
import { first } from 'rxjs/operators';


export class PubSub {

    private _events: Map<string, Subject<any[]>> = new Map()


    publish<T>(event: string, ...args: T[]): void
    publish(event: string, ...args: any[]): void {
        if (!this._events.has(event)) return;
        const subject = this._events.get(event);
        subject?.next(args)
    }

    subscribe<T>(event: string, cb: (...args: T[]) => void): Subscription
    subscribe(event: string, cb: (...args: any[]) => void): Subscription {
        let subject = this._events.get(event);
        if (!subject) {
            subject = new Subject<any[]>();
            this._events.set(event, subject);
        }
        return subject.subscribe((args) => cb(...args));
    }

    subscribeOnce<T>(event: string, cb: (...args: T[]) => void): void
    subscribeOnce(event: string, cb: (...args: any[]) => void): void {
        let subject = this._events.get(event);
        if (!subject) {
            subject = new Subject<any[]>();
            this._events.set(event, subject);
        }
        const sub = subject.pipe(first()).subscribe(args => {
            sub.unsubscribe();
            cb(...args);
        })
    }
}

export default new PubSub();