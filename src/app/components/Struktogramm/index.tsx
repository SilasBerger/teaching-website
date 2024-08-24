import styles from './styles.module.scss';
import {Program} from "@site/src/app/components/Struktogramm/model";
import Instruction from "@site/src/app/components/Struktogramm/Instruction";
import Output from "@site/src/app/components/Struktogramm/Output";
import Input from "@site/src/app/components/Struktogramm/Input";
import Loop from "@site/src/app/components/Struktogramm/Loop";
import Conditional from "@site/src/app/components/Struktogramm/Conditional";

interface Props {
  align?: 'flex-start' | 'center' | 'flex-end';
  program: Program;
}

function transform(program: Program): React.ReactNode[] {
  return program.map(element => {
    switch (element.type) {
      case 'input':
        return <Input code={<>{element.code}</>}/>;
      case 'output':
        return <Output code={<>{element.code}</>}/>;
      case 'step':
        return <Instruction code={<>{element.code}</>}/>;
      case 'repeat':
        return <Loop code={<>{element.code}</>}>{transform(element.block)}</Loop>;
      case 'if':
        return <Conditional
          code={<>{element.code}</>}
          truePath={transform(element.trueBlock)}
          falsePath={transform(element.falseBlock)} />
    }
  });
}

const Struktogramm = ({program, align}: Props) => {
  return (
    <div className={styles.Struktogramm} style={{alignItems: align || 'flex-start'}}>
      <div className={styles.container}>{transform(program)}</div>
    </div>
  );
}

export default Struktogramm;