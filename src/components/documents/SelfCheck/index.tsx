import { SelfCheckContext } from '@tdev-components/documents/SelfCheck/shared';

interface Props {
    solutionId: string;
    taskStateId: string;
    children?: React.ReactNode;
}

const SelfCheck = ({ solutionId, taskStateId, children }: Props) => {
    return (
        <SelfCheckContext.Provider value={{ solutionId, taskStateId }}>{children}</SelfCheckContext.Provider>
    );
};

export default SelfCheck;
