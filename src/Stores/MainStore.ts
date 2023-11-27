
import ActionConfirm from "./ActionConfirm.ts";
import { TemplateStore } from "./Template.ts";
import { ProductsStore } from "./Products.ts";

export interface IMainStore {
  actionConfirm: ActionConfirm;
  productsStore: ProductsStore;
  currentTemplate: TemplateStore;
}

export class MainStore {
  templates: TemplateStore[] = [];

  // Used to confirm actions that will change the tab we are in
  actionConfirm = new ActionConfirm();
  // Used to store the products
  productsStore = new ProductsStore();
  // Used to store the current template
  currentTemplate = new TemplateStore();

  saveCurrentTemplate() {
    if (this.templates.find(template => template.id === this.currentTemplate.id)) {
      // Update the template
      this.templates = this.templates.map(template => {
        if (template.id === this.currentTemplate.id) {
          return this.currentTemplate;
        }
        return template;
      });
    } else {
      // Add the template
      this.templates.push(this.currentTemplate);
    }

    // Save all templates to local storage
    const templatesJson = JSON.stringify(this);
    localStorage.setItem('templates', templatesJson);
  }

  loadTemplate(templateId: string) {
    this.currentTemplate = this.templates.find(template => template.id === templateId)!;
  }

  removeTemplate(templateId: string) {
    this.templates = this.templates.filter(template => template.id !== templateId);
  }

  toJSON() {
    return {
      templates: this.templates,
      currentTemplate: this.currentTemplate,
    };
  }
}

export default new MainStore();
