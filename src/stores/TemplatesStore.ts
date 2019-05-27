import { StoreBase, AutoSubscribeStore, autoSubscribe } from 'resub';
import { Template } from '../utils/FdEvents';

@AutoSubscribeStore
class TemplatesStore extends StoreBase {
    private templates: Template[] = [];

    addTemplate(template: Template) {
        const templates = this.templates.concat(template);
        templates.sort((t1: Template, t2: Template, ) => t1.name.localeCompare(t2.name, undefined, {numeric: true, sensitivity: 'base'}));
        this.templates = templates;
        this.trigger();
    }

    setTemplates(templates: Template[]) {
        templates.sort((t1: Template, t2: Template, ) => t1.name.localeCompare(t2.name, undefined, {numeric: true, sensitivity: 'base'}));
        this.templates = templates || [];
        this.trigger();
    }

    clear() {
        this.templates = [];
        this.trigger();
    }

    @autoSubscribe
    getTemplates() {
        return this.templates;
    }
}

export = new TemplatesStore();
