import { StoreBase, AutoSubscribeStore, autoSubscribe } from 'resub';
import { Header } from '../utils/FdEvents';

@AutoSubscribeStore
class HeadersStore extends StoreBase {
    private headers: Header[] = [];

    addHeader(header: Header) {
        const headers = this.headers.concat(header);
        this.headers = headers;
        this.trigger();
    }

    setHeaders(headers: Header[]) {
        this.headers = headers || [];
        this.trigger();
    }

    clear() {
        this.headers = [];
        this.trigger();
    }

    @autoSubscribe
    getHeaders() {
        return this.headers;
    }
}

export = new HeadersStore();
