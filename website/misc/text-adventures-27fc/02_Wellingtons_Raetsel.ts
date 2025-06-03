import { TerminalApi } from '@tdev-components/Terminal';

export async function run(api: TerminalApi) {
    const { print, input } = api;

    async function zettel() {
        print(
            'Auf dem Nachhauseweg windet es stark, und plötzlich windet es dir einen Zettel vor die Füsse. Darauf steht man eine Telefonnummer, von dem man nur noch die letzten drei Zahlen sieht: 222'
        );
        await zettel_analysieren();
    }

    async function polizei() {
        print('Du rufst an und meldest deinen Verdacht, dass der Polizist den Hund getötet hat.');
        print(
            'Eine Stunde Später wirst du angerufen und der Fall wird bestätigt und der Polizist wird Festgenommen.'
        );
        print(
            'Bravo! Du hast den Fall gelöst. Das Motiv des Polizisten war es, dass er sich genervt hat, weil die Besitzerin des Hundes immer zu viel Wein trank und deshalb besoffen auf der Suche nach ihrem Hund, durchs Dorf fährt.'
        );
    }

    async function zettel_analysieren() {
        let auswahl = await input('ist der Zettel ein Hinweis?(ja/nein)');
        if (auswahl == 'ja') {
            print(
                'Da die Zwei die erste Primzahl ist und somit auch meine Lieblingszahl ist, kenne ich alle Telefonnummern die mit dieser Zahlenkonstellation enden. Davon gibt es nur zwei.'
            );
            print('Du schaust die nummer an');
            auswahl = await input('Willst du bei der Nummer anrufen? (ja/nein)');
            if (auswahl == 'ja') {
                print(
                    'Du rufst an und hörst eine bekannte Stimme die Sagt: Hallo hier ist der Auftragskiller 222.'
                );
                print('Da du die Stimme erkennst legst du auf');
                let auswhal = await input('Willst du die Polizei anrufen?');
                if (auswahl == 'ja') {
                    await polizei();
                } else if (auswahl == 'nein') {
                    print('Du gehst Nachhause, da du dich nicht getraust mit Menschen zu sprechen.');
                    await zettel();
                }
            }
        } else if (auswahl == 'nein') {
            print('Ich mag es nicht mit Menschen zu sprechen und gebe auf.');
            await zettel();
        }
    }

    async function nummer() {
        print('Du schaust die nummer an');
        let auswahl = await input('Willst du bei der Nummer anrufen? (ja/nein)');
        if (auswahl == 'ja') {
            print(
                'Du rufst an und hörst eine bekannte Stimme die Sagt: Hallo hier ist der Auftragskiller 222.'
            );
        } else if (auswahl == 'nein') {
            print('Ich mag es nicht mit Menschen zu sprechen und gebe auf.');
            await zettel();
        }
    }

    async function polizei_anrufen() {
        print('Da du die Stimme erkennst legst du auf');
        let auswal = await input('Willst du die Polizei anrufen?');
        if (auswal == 'ja') {
            await polizei();
        } else if (auswal == 'nein') {
            print('Du gehst Nachhause, da du dich nicht getraust mit Menschen zu sprechen.');
            await zettel();
        }
    }

    async function spurensuche() {
        print('Du gehst auf Spurensuche');
        let auswahl = await input('Findest du spuren? (ja/nein)');
        if (auswahl == 'ja') {
            print(
                'Du findest einen Zettel auf dem eine Telefonnummer steht, bei dem man nur noch die letzten drei Zahlen "222" erkennt.'
            );
            await zettel_analysieren();
        } else if (auswahl == 'nein') {
            print('Ich gehe Nachhause da ich überfordert bin und suche dort nach Fakten.');
            await zettel();
        }
    }

    async function alleine_weg() {
        print('Du fragst sie nun: Ist Wellington von alleine Weggelaufen?');
        let auswahl = await input('Was Antwortet sie? (ja/nein)');
        if (auswahl == 'ja') {
            print(
                'Du gehst in den Garten und schaust ob du etwas finden kannst, wo Wellington entwischen konnte.'
            );
            await spurensuche();
        } else if (auswahl == 'nein') {
            print(
                'Die Besitzerin gesteht dir, dass sie an diesem Tag zu viel Wein getrunken hat und somit vergessen hat das Gartentor zu schliessen. Du gehst nun zum Gartentor'
            );
            await zettel_analysieren();
        }
    }

    async function hundebesitzerin() {
        let auswahl = await input('Willst du zu der Hundebesitzerin gehen?(ja/nein)');
        if (auswahl == 'ja') {
            print(
                'Du ziehst deine gelben Stiefel, deine Jacke und dein Schal den du immer gleich knotest an und laufst die 20,85 Meter zur Besitzerin.'
            );
            await alleine_weg();
        } else if (auswahl == 'nein') {
            print('Du gehst nachhause');
            await zettel();
        }
    }

    async function nummer_anschauen() {
        print('Du schaust die nummer an');
        let auswahl = await input('Willst du bei der Nummer anrufen? (ja/nein)');
        if (auswahl == 'ja') {
            print(
                'Du rufst an und hörst eine bekannte Stimme die Sagt: Hallo hier ist der Auftragskiller 222.'
            );
        } else if (auswahl == 'nein') {
            print('Ich mag es nicht mit Menschen zu sprechen und gebe auf.');
            await zettel();
        }
    }

    print(
        'Wilkommen beim Detektivspiel, du befindest dich gerade vor einem toten Hund, der mit einer Heugabel erstochen wurde. Ein Polizist hat nun nun ein paar Fragen an dich.'
    );
    print('Du siehst den Polizisten auf dich zukommen.');
    let auswahl = await input('rennst du von der Polizei weg? (ja/nein) ');
    if (auswahl == 'ja') {
        print(
            'Du rennst weg und schaffst es gerade noch über eine Hecke und gehst nach Hause. Du beschliesst den Fall selber zu lösen.'
        );
        await hundebesitzerin();
    } else if (auswahl == 'nein') {
        print(
            'Du liegst ins Gras, hälst deine Ohren mit den Händen zu, es wird dir zu viel und du gehst Nachhause.'
        );
        await zettel();
    }
}
