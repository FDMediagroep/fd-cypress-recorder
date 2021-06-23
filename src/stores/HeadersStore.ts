import { ReSubstitute } from '@fdmg/resubstitute';
import { Header } from '../utils/FdEvents';

class HeadersStore extends ReSubstitute {
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

    getHeaders() {
        return this.headers;
    }
}

export = new HeadersStore();
