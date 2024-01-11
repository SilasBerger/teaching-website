import {TextDirectiveDeclaration} from "../plugins/shared/models";
import {TextDirectivesConfig} from "../plugins/remark-text-directives/plugin";


interface MdiAttributes {
  class?: string;
}

const mdiDeclaration: TextDirectiveDeclaration = {
  name: 'mdi',
  transform: (attributes: MdiAttributes) => {
    return null;
  },
}

export const remarkTextDirectivesPluginConfig: TextDirectivesConfig = {
  declarations: [
    mdiDeclaration,
  ],
}
