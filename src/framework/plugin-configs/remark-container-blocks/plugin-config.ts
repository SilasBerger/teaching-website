import {ContainerDirectivesConfig} from "../../plugins/remark-container-directives/model";
import admonitions from "./admonitions";
import Hero from "./Hero";
import Caption from "./Caption";

export const remarkContainerDirectivesConfig: ContainerDirectivesConfig = {
  declarations: [
    ...admonitions,
    Hero,
    Caption,
  ]
}
