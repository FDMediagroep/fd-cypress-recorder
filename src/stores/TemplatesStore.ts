import { ReSubstitute } from '@fdmg/resubstitute';
import { Template } from '../utils/FdEvents';

class TemplatesStore extends ReSubstitute {
    private templates: Template[] = [];

    addTemplate(template: Template) {
        const templates = this.templates.concat(template);
        templates.sort((t1: Template, t2: Template) =>
            t1.name.localeCompare(t2.name, undefined, {
                numeric: true,
                sensitivity: 'base',
            })
        );
        this.templates = templates;
        this.trigger();
    }

    setTemplates(templates: Template[]) {
        templates.sort((t1: Template, t2: Template) =>
            t1.name.localeCompare(t2.name, undefined, {
                numeric: true,
                sensitivity: 'base',
            })
        );
        this.templates = templates || [];
        this.trigger();
    }

    clear() {
        this.templates = [];
        this.trigger();
    }

    getTemplates() {
        return this.templates;
    }
}

export = new TemplatesStore();
