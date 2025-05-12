import { ContainerDirectivesConfig } from '../../plugins/remark-container-directives/model';
import admonitions from './admonitions';
import Hero from './Hero';
import Caption from './Caption';
import tabs from './tabs';
import tiles from './tiles';
import Cite from './Cite';

export const remarkContainerDirectivesConfig: ContainerDirectivesConfig = {
    declarations: [...admonitions, ...tabs, ...tiles, Hero, Caption, Cite]
};
