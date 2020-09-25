type KeyOrKeys = any | any[];

type Callback = (keys?: any[]) => void;

interface Subscription {
    id: number;
    callback: Callback;
    key: any;
}

interface SubscriptionOptions {
    keys?: any | any[];
    throttledUntil: number;
    bypassBlock: boolean;
}

/**
 * Drop-in minimal replacement for microsoft/ReSub.
 * Only implements the Pub/Sub functionality of ReSub.
 * Disregarded the framework specific implementations.
 */
export class ReSubstitute {
    static Key_All = 'RESUBSTITUTE_ALL_EVENTS';
    private subscriptions: Subscription[] = [];
    private static pendingCallbacks: Map<
        Callback,
        SubscriptionOptions
    > = new Map();
    private throttleMs = 0;
    private bypassTriggerBlocks = false;
    private static triggerBlockCount = 0;

    constructor(throttleMs = 0, bypassTriggerBlocks = false) {
        this.throttleMs = throttleMs;
        this.bypassTriggerBlocks = bypassTriggerBlocks;
    }

    private static resolveCallbacks() {
        for (const [callback, options] of ReSubstitute.pendingCallbacks) {
            if (ReSubstitute.triggerBlockCount && !options.bypassBlock) {
                // The callback does not bypass the block so we continue to the next callback.
                continue;
            } else if (options.bypassBlock) {
                callback.call(null, options.keys);
            } else if (+new Date() >= options.throttledUntil) {
                callback.call(null, options.keys);
            } else {
                setTimeout(
                    callback.bind(null, options.keys),
                    +new Date() - options.throttledUntil
                );
            }
            ReSubstitute.pendingCallbacks.delete(callback);
        }
    }

    /**
     * Subscribe to store triggers.
     * @param callback
     * @param key limit only to events for this key
     */
    subscribe(callback: Callback, key?: string): number {
        console.log('sub', key);
        const id = +new Date();
        this.subscriptions.push({ id, callback, key });
        return id;
    }

    /**
     * Unsubscribe from the store so future triggers will not trigger the callback anymore.
     * @param subToken
     */
    unsubscribe(subToken: number) {
        this.subscriptions = [
            ...this.subscriptions.filter(
                (subscription) => subscription.id !== subToken
            ),
        ];
    }

    protected _getSubscriptionKeys(): (string | undefined)[] {
        return this.subscriptions.map((subscription) => {
            return subscription.key;
        });
    }

    protected _isTrackingKey(key: string) {
        const results = this.subscriptions.find(
            (subscription) => subscription.key === key
        );
        return !!results;
    }

    /**
     * Trigger callbacks of subscriptions.
     * @param keyOrKeys trigger callback if subscription matches given key or keys.
     */
    trigger(keyOrKeys?: KeyOrKeys) {
        if (typeof keyOrKeys === 'string') {
            this.subscriptions.forEach((subscription) => {
                console.log(subscription.key ?? 'no key', keyOrKeys);
                if (
                    subscription.key === keyOrKeys ||
                    subscription.key === ReSubstitute.Key_All
                ) {
                    ReSubstitute.pendingCallbacks.set(subscription.callback, {
                        bypassBlock: this.bypassTriggerBlocks,
                        keys: [keyOrKeys],
                        throttledUntil: +new Date() + this.throttleMs,
                    });
                }
            });
        } else if (Array.isArray(keyOrKeys)) {
            this.subscriptions.forEach((subscription) => {
                console.log(subscription.key ?? 'no key', keyOrKeys);
                if (
                    keyOrKeys.indexOf(subscription.key) !== -1 ||
                    subscription.key === ReSubstitute.Key_All
                ) {
                    ReSubstitute.pendingCallbacks.set(subscription.callback, {
                        bypassBlock: this.bypassTriggerBlocks,
                        keys: keyOrKeys,
                        throttledUntil: +new Date() + this.throttleMs,
                    });
                }
            });
        } else {
            // Notify all listeners
            this.subscriptions.forEach((subscription) => {
                ReSubstitute.pendingCallbacks.set(subscription.callback, {
                    bypassBlock: this.bypassTriggerBlocks,
                    keys: keyOrKeys,
                    throttledUntil: +new Date() + this.throttleMs,
                });
            });
        }

        ReSubstitute.resolveCallbacks();
    }

    /**
     * Block callback triggers globally.
     */
    static pushTriggerBlock() {
        this.triggerBlockCount++;
    }

    /**
     * Pop trigger block. When no trigger blocks are left. The callback triggering will resume.
     * If no trigger blocks are set then this function does nothing.
     */
    static popTriggerBlock() {
        if (this.triggerBlockCount) {
            this.triggerBlockCount--;
            if (this.triggerBlockCount === 0) {
                ReSubstitute.resolveCallbacks();
            }
        }
    }
}
