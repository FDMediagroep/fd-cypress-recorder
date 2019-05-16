import { StoreBase, AutoSubscribeStore, autoSubscribe } from 'resub';

@AutoSubscribeStore
class TestSuiteStore extends StoreBase {
    private testSuite: string|undefined;
    private testDescription: string|undefined;
    private recording: boolean = false;
    private basicAuth: boolean = false;

    setTestSuite(testSuite: string) {
        this.testSuite = testSuite;
        this.trigger();
    }

    setTestDescription(testDescription: string) {
        this.testDescription = testDescription;
        this.trigger();
    }

    setRecording(recording: boolean) {
        this.recording = recording;
        this.trigger();
    }

    setBasicAuth(basicAuth: boolean) {
        this.basicAuth = basicAuth;
        this.trigger();
    }

    clear() {
        this.testSuite = undefined;
        this.testDescription = undefined;
        this.recording = false;
        this.trigger();
    }

    @autoSubscribe
    getTestSuite() {
        return this.testSuite;
    }

    @autoSubscribe
    getTestDescription() {
        return this.testDescription;
    }

    @autoSubscribe
    getRecording() {
        return this.recording;
    }

    @autoSubscribe
    getBasicAuth() {
        return this.basicAuth;
    }
}

export = new TestSuiteStore();
