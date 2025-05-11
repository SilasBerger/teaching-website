import { LineDirectivesConfig } from '../../plugins/remark-line-directives/model';
import youtube from './leaf/youtube';
import seeCode from './text/seeCode';

export const remarkLineDirectivesPluginConfig: LineDirectivesConfig = {
    textDirectives: [seeCode],
    leafDirectives: [youtube]
};
