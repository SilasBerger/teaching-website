import { TerminalApi } from '@tdev-components/Terminal';

export async function run(api: TerminalApi) {
    const { print, input } = api;

    print('Willkommen bei unserem Projekt. Ich wünsche euch viel Spass und Erfolg!');
    print('Du hast nach dem langen Gespräch mit dem Polizisten gemerkt das er Recht hat');

    async function sofa() {
        print('Du stehst gesund auf und suchst weiter nach deinem Schicksal im Wald');
        let auswahl = await input(
            'Du suchst und suchst weiter und findest ein Auto, willst du rein? (ja/nein)'
        );
        if (auswahl == 'ja') {
            await input(
                'Du fährst weg und gehst zurück nachhause. Beim Weg siehst du den Polizisten von weitem mit dem Toten Hund!!. [Enter drücken]'
            );
            await input(
                'Im Auto hat es eine Fotokamera, mit der machst du ein Bild von beidem und fährst zur nächsten Polizeistation. Respekt, du bist entkommen und hast den Fall gelöst!!!'
            );
            return; // exit(0)
        } else if (auswahl == 'nein') {
            await input(
                'Du läufst weiter und fällst ausversehen um und verletzt dich an deinem Fuss[Enter drücken]'
            );
            await input('du läufst weiter doch dann findet dich der Polizist!!');
            auswahl = await input('willst du wegrennen?, (ja/nein)');
            if (auswahl == 'ja') {
                await input(
                    'Er fällt um und du rennst und entkommst nach 4h laufen findest du dein Weg nach Hause!!'
                );
                await input(
                    'auf dem Weg siehst du das Polizeiauto und erkennst die Leiche vom Hund drinnen, direkt machst du ein Bild mit der kleinen Fotokamera den du dabei hast und meldest es an der Polizei als du endlich ankamst.'
                );
                await input('Respekt du hast es geschafft!!');
                return; // exit(0)
            } else if (auswahl == 'nein') {
                await input('du hattest kein Glück und er fängt dich, es ist vorbei..');
                return; // exit(0)
            }
        } else {
            await sofa();
        }
    }

    async function drinnen() {
        let auswahl = await input(
            'Du suchst dir einen Schlafplatz und hast 2 Optionen, Auf dem Bett, das Blutflecken hat, oder auf dem Sofa wo ein totes Tier liegt. Welches wählst du aus? (Bett/Sofa):'
        );
        if (auswahl == 'Bett') {
            await input(
                'Du hast rote Flecken an dein Körper am morgen entdeckt, wahrscheinlich hast du eine Krankheit bekommen.'
            );
            await input(
                'Du stehst auf und suchst draussen nach einem Wasserfall für Wasser und fällst um. Du bekommst einen Anfall und aus allen roten Flecken an deiner Haut kommt Blut raus. Du bist tot'
            );
            return;
        } else if (auswahl == 'Sofa') {
            await sofa();
        } else {
            await drinnen();
        }
    }

    async function fenster() {
        await input(
            'Du fällst aus dem 2en Stock in einen Busch, und brichst dir den Arm. Jedoch bist du jetzt Frei! [Enter drücken]'
        );
        let auswahl = await input(
            'Du rennst auf den Zaun zu. willst du hinüberklettern oder unter durch? (drüber klettern/unter durch):'
        );
        if (auswahl == 'drüber klettern') {
            print(
                'Du entkommst einem tollwütigen Hund gerade noch rechtzeitig! Du rennst in die Freiheit doch hast nichts über den Fall herausgefunden...'
            );
            return;
        } else if (auswahl == 'unter durch') {
            await input('Zu langsam! Ein tollwütiger Hund hat dich erwischt. RIP');
            return;
        } else {
            await fenster();
        }
    }

    let auswahl = await input(
        'Willst du dich für dein Verhalten entschuldigen oder wegrennen? (wegrennen/entschuldigen): '
    );
    if (auswahl == 'entschuldigen') {
        print('Weil du dich nett entschuldigt hast fragt er dich ob er dich nachhause fahren soll');
        auswahl = await input('steigst du ein oder nicht? (ja/nein)');
        if (auswahl == 'ja') {
            await input(
                'Du sagst ihm deine Adresse und er sagt das er diese kennen würde, als er jedoch einen ganz anderenn weg geht bekommst du einen komischen Gefühl... [Enter drücken]'
            );
            await input(
                'Du sagst es wäre okey wenn er dich rauslässt, aber er sagt lieber nicht und schlägt dich KO'
            );
            auswahl = await input(
                'Du wachst in einem dunklen und kalten Keller auf der nur mit einer Glühbirne beleuchtet wird du bist nicht mehr angebunden und sieht 2 Flucht wege. welchen wählst du? (Fenster/Kellertür):'
            );
            if (auswahl == 'Fenster') {
                await fenster();
            } else if (auswahl == 'Kellertür') {
                await input(
                    'In dem Moment, wo du die Tür aufmachst, fängt dich der Polizist, und zerrt dich in ein Auto. Neben dir ist die Leiche eines Hundes...[Enter drücken]'
                );
                await input(
                    'Du stellst fest das es wohl der Hund der Nachbarin ist, DER POLIZIST IST DER MÖRDER!!'
                );
                auswahl = await input(
                    'Als sich der Polizist vorne ins Auto setzten will, überlegst du dir folgendes, du bleibst sitzen, oder du reisst die Autotür auf und sprintest weg (raussprinten/drinnen bleiben): '
                );
                if (auswahl == 'drinnen bleiben') {
                    await input(
                        'Du bleibst sitzen und wartest bis die fahrt zu ende ist. Du wurdest über die Grenze gebracht, und niemand mehr kann dir helfen.'
                    );
                    return;
                } else if (auswahl == 'raussprinten') {
                    await input(
                        'Du reisst die Autotür auf, und rennst los. Hinter dir erscheint das Gebrüll des Polizisten. [Enter drücken]'
                    );
                    await input(
                        'Du bist so schnell wie du konntest gerannt und kamst zu der Polizei. Du hast deine Aussage abgelegt und die Polizei verhaftete den Polizisten. [Enter drücken]'
                    );
                    await input(
                        'Gratuliere, du Meisterdetektiv. Du hast den Hunde-Mord erfolgreich und lebendig gelöst.'
                    );
                    return;
                }
            }
        } else if (auswahl == 'nein') {
            await input(
                'Er sagt das er sich eine andere antwort erhofft hat und zert dich plötzlich ins auto und verbindet dir die Augen [Enter drücken]'
            );
            await input('du schreist um Hilfe und willst raus bis er dich KO schlägt [Enter drücken]');
            auswahl = await input(
                'Du wachst in einem dunklen und kalten Keller auf der nur mit einer Glühbirne beleuchtet wird du bist nicht mehr angebunden und sieht 2 Flucht wege. welchen wählst du? (Fenster/Kellertür): '
            );
            if (auswahl == 'Fenster') {
                await fenster();
            } else if (auswahl == 'Kellertür') {
                await input(
                    'In dem Moment, wo du die Tür aufmachst, fängt dich der Polizist, und zerrt dich in ein Auto. Neben dir ist die Leiche eines Hundes...[Enter drücken]'
                );
                await input(
                    'Du stellst fest das es wohl der Hund der Nachbarin ist, DER POLIZIST IST DER MÖRDER!!'
                );
                auswahl = await input(
                    'Als sich der Polizist vorne ins Auto setzten will, überlegst du dir folgendes, du bleibst sitzen, oder du reisst die Autotür auf und sprintest weg (raussprinten/drinnen bleiben): '
                );
                if (auswahl == 'drinnen bleiben') {
                    await input(
                        'Du bleibst sitzen und wartest bis die fahrt zu ende ist. Du wurdest über die Grenze gebracht, und niemand mehr kann dir helfen.'
                    );
                    return;
                } else if (auswahl == 'raussprinten') {
                    await input(
                        'Du reisst die Autotür auf, und rennst los. Hinter dir erscheint das Gebrüll des Polizisten. [Enter drücken]'
                    );
                    await input(
                        'Du bist so schnell wie du konntest gerannt und kamst zu der Polizei. Du hast deine Aussage abgelegt und die Polizei verhaftete den Polizisten. [Enter drücken]'
                    );
                    await input(
                        'Gratuliere, du Meisterdetektiv. Du hast den Hunde-Mord erfolgreich und lebendig gelöst.'
                    );
                    return;
                }
            }
        }
    } else if (auswahl == 'wegrennen') {
        print('Du bist in ein Wald reingerannt');
        print('du gehst in ein Waldhaus rein');
        auswahl = await input(
            'Es ist Nacht, willst du drinnen oder draussen beim Wald schlafen? (drinnen/draussen):'
        );
        if (auswahl == 'drinnen') {
            await drinnen();
        } else if (auswahl == 'draussen') {
            await input('Ein Bär frisst dich in der nacht auf');
            return;
        }
    }
}
