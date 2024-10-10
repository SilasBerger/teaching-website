import clsx from 'clsx';
import styles from './styles.module.scss';

export const Colors = {
    primary: styles.primary,
    secondary: styles.secondary,
    blue: styles.blue,
    green: styles.green,
    red: styles.red,
    orange: styles.orange,
    gray: styles.gray,
    lightBlue: styles.lightBlue,
    black: styles.black
};
export type Color = keyof typeof Colors;

export const ButtonColors: { [key in Color]: string } = {
    primary: 'button--primary',
    secondary: 'button--secondary',
    blue: 'button--primary',
    green: 'button--success',
    red: 'button--danger',
    orange: 'button--warning',
    gray: 'button--secondary',
    lightBlue: 'button--info',
    black: 'button--primary'
};

export const getColorClass = (color: Color | string | undefined, defaultColor?: Color) => {
    return Colors[color as Color] || Colors[defaultColor as Color];
};

export const getButtonColorClass = (color: Color | string | undefined, defaultColor?: Color) => {
    return clsx(
        ButtonColors[color as Color] || ButtonColors[defaultColor as Color],
        color === 'blue' && styles.buttonBlue,
        color === 'black' && styles.buttonBlack
    );
};
