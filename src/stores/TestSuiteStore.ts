import { ReSubstitute } from '../utils/ReSubstitute';

class TestSuiteStore extends ReSubstitute {
    private testSuite: string | undefined;
    private testDescription: string | undefined;
    private recording = false;
    private basicAuth = false;

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
        this.testSuite = '';
        this.testDescription = '';
        this.recording = false;
        this.trigger();
    }

    getTestSuite() {
        return this.testSuite;
    }

    getTestDescription() {
        return this.testDescription;
    }

    getRecording() {
        return this.recording;
    }

    getBasicAuth() {
        return this.basicAuth;
    }
}

export = new TestSuiteStore();
