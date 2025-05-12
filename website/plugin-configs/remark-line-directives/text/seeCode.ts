import { jsxTextElementFrom } from '../../../plugins/shared/util/jsx-node-util';
import { ImportType } from '../../../plugins/shared/models';
import {
    TextDirectiveDeclaration,
    TextDirectiveTransformerProps
} from '../../../plugins/remark-line-directives/model';
import { Optional } from '../../../utils/optional';

interface Props extends TextDirectiveTransformerProps {}

export default {
    name: 'seeCode',
    transform: ({ literal }: Props) => {
        if (!literal) {
            console.warn(`Missing literal on 'seeCode' directive`);
            return Optional.empty();
        }

        return Optional.of(
            jsxTextElementFrom({
                componentName: 'SeeCodeBadge',
                attributes: [{ name: 'url', value: literal }]
            })
        );
    },
    esmImports: [
        {
            sourcePackage: '@tdev-components/SeeCodeBadge',
            specifiers: [{ type: ImportType.DEFAULT_IMPORT, name: 'SeeCodeBadge' }]
        }
    ]
} as TextDirectiveDeclaration<Props>;
