/**
 * @credits to @r0the
 */

export const LEVEL_MAP = {
    achievement: 0,
    notice: 1,
    warning: 2,
    insecure: 3,
};

export const DICTIONARY = {
    instantly: 'sofort',
    forever: 'nie',
};

interface Period {
    singular: string;
    plural: string;
    seconds: number;
    abbreviations?: string[]
}

export const PERIOD_DICTIONARY: Period[] = [
    {
        singular: 'Nanosekunde',
        plural: 'Nanosekunden',
        seconds: 1e-9,
    },
    {
        singular: 'Mikrosekunde',
        plural: 'Mikrosekunden',
        seconds: 1e-6,
    },
    {
        singular: 'Millisekunde',
        plural: 'Millisekunden',
        abbreviations: ['ms', 'msec'],
        seconds: 1e-3,
    },
    {
        singular: 'second',
        plural: 'Sekunden',
        abbreviations: ['s', 'sec', 'secs'],
        seconds: 1,
    },
    {
        singular: 'Minute',
        plural: 'Minuten',
        abbreviations: ['m', 'min', 'mins'],
        seconds: 60,
    },
    {
        singular: 'Stunde',
        plural: 'Stunden',
        abbreviations: ['h'],
        seconds: 3600,
    },
    {
        singular: 'Tag',
        plural: 'Tagen',
        seconds: 86400,
    },
    {
        singular: 'Woche',
        plural: 'Wochen',
        seconds: 604800,
    },
    {
        singular: 'Monat',
        plural: 'Monaten',
        seconds: 2626560,
    },
    {
        singular: 'Jahr',
        plural: 'Jahren',
        seconds: 31557600,
    },
];

export const NAMED_NUMBER_DICTIONARY = {
    Millionen: 6,
    Milliarden: 9,
    Billionen: 12,
    Billiarden: 15,
    Trillionen: 18,
    Trilliarden: 21,
    Quadrillionen: 24,
    Quadrilliarden: 27,
    Quintillionen: 30,
    Quintilliarden: 33,
    Sextillionen: 36,
    Sextilliarden: 39,
    Septillionen: 42,
    Septilliarden: 45,
    Oktillionen: 48,
    Oktilliarden: 51,
    Nonillionen: 54,
    Nonilliarden: 57,
    Dezillionen: 60,
    Dezilliarden: 63,
};

export const CHECKER_DICTIONARY = {
    common: {
        name: 'Top {{ value }} häufigste Passwörter',
        message: 'Ihr Passwort wird sehr häufig verwendet. Es kann fast augenblicklich geknackt werden.',
    },
    xkcd: {
        name: 'xkcd',
        message: 'https://xkcd.com/936/',
    },
    jeff: {
        name: 'Es gibt immer eine Hintertür',
        message:
            "'The guy who made the software was called Jeff Jeffty Jeff. Born on the first of Jeff, nineteen-jeffty-jeff.'",
    },
    lengthVeryShort: {
        name: 'Sehr kurz',
        message: 'Ihr Passwort ist sehr kurz. Je länger ein Passwort ist, desto sicherer ist es.',
    },
    possiblyWord: {
        name: 'Wort oder Name',
        message:
            'Ihr Passwort sieht wie ein Wort aus dem Wörterbuch oder ein Name aus. Ein Name mit persönlichem Bezug könnte einfach erraten werden. Ein Wort aus dem Wörterbuch kann sehr schnell geknackt werden.',
    },
    onlyNumbers: {
        name: 'Nur Zahlen',
        message:
            'Ihr Passwort besteht nur aus Zahlen. Fügen Sie Buchstaben und Symbole hinzu, um es sicherer zu machen.',
    },
    wordAndNumber: {
        name: 'Wort und Zahl',
        message:
            'Ihr Passwort besteht nur aus einem Wort und ein paar Ziffern. Dies ist eine häufige Kombination und kann sehr rasch geknackt werden.',
    },
    lengthShort: {
        name: 'Kurz',
        message: 'Ihr Passwort ist ziemlich kurz. Je länger ein Passwort ist, desto sicherer ist es.',
    },
    justLetters: {
        name: 'Nur Buchstaben',
        message:
            'Ihr Passwort besteht nur aus Buchstaben. Fügen Sie Zahlen und Symbole hinzu, um es sicherer zu machen.',
    },
    noSymbols: {
        name: 'Keine Symbole',
        message:
            'Ihr Passwort enthält nur Zahlen und Buchstaben. Fügen Sie ein Symbol hinzu, um es sicherer zu machen.',
    },
    telephone: {
        name: 'Telefonnummer oder Datum',
        message:
            'Ihr Passwort könnte eine Telefonnummer oder ein Datum sein. Falls es einen persönlichen Bezug hat, kann es einfach zu erraten sein.',
    },
    repeatedPattern: {
        name: 'Wiederholendes Muster',
        message: 'Wiederholende Zeichen oder Muster können Ihr Passwort vorhersagbar machen.',
    },
    nonStandardCharacters: {
        name: 'Spezialzeichen',
        message: 'Ihr Passwort enthält ein Spezialzeichen und ist dadurch sicherer.',
    },
    lengthLong: {
        name: 'Lang',
        message: 'Ihr Passwort ist länger als sechzehn Zeichen.',
    },
};
