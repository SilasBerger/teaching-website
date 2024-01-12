import {Optional} from "../../../util/optional";
import {jsxTextElementFrom} from "../../../plugins/shared/util/jsx-node-util";
import {Log} from "../../../util/log";
import {TextDirectiveDeclaration, TextDirectiveTransformerProps} from "../../../plugins/remark-line-directives/model";

interface Props extends TextDirectiveTransformerProps {}

export default {
  name: 'mdi',
  transform: ({literal}: Props) => {
    if (!literal) {
      Log.instance.warn(`Missing literal on 'mdi' directive`);
      return Optional.empty();
    }

    return Optional.of(jsxTextElementFrom({
      componentName: 'span',
      attributes: [{name: 'class', value: `mdi mdi-${literal}`}]
    }));
  },
} as TextDirectiveDeclaration<Props>;
