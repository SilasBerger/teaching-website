import {
  ContainerDirectiveDeclaration,
  ContainerDirectiveTransformerProps
} from "../../plugins/remark-container-directives/model";
import {Optional} from "../../plugins/optional";
import {jsxFlowElementFrom} from "../../plugins/shared/util/jsx-node-util";
import {ImportType} from "../../plugins/shared/models";

interface Props extends ContainerDirectiveTransformerProps {}

export default {
  name: 'Caption',
  transform: ({children}: Props) => Optional.of(jsxFlowElementFrom({
    componentName: 'Caption',
    attributes: []
  }, children)),
  esmImports: [{
    sourcePackage: '@site/src/components/Caption',
    specifiers: [{type: ImportType.DEFAULT_IMPORT, name: 'Caption'}],
  }]
} as ContainerDirectiveDeclaration
