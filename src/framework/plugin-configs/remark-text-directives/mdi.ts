import {TextDirectiveDeclaration, TextDirectiveTransformerProps} from "../../plugins/shared/models";
import {Optional} from "../../util/optional";
import {jsxTextElementFrom} from "../../plugins/shared/util/jsx-node-util";
import {Log} from "../../util/log";

interface Props extends TextDirectiveTransformerProps {}

export default {
  name: 'mdi',
  transform: (props: Props) => {
    if (!props.literal) {
      Log.instance.warn('Missing literal on MDI directive');
      return Optional.empty();
    }

    return Optional.of(jsxTextElementFrom({
      componentName: 'span',
      attributes: [{name: 'class', value: `mdi mdi-${props.literal}`}]
    }));
  },
} as TextDirectiveDeclaration<Props>;
