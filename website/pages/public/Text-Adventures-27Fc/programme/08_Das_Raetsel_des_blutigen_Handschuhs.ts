import { TerminalApi } from '@tdev-components/Terminal';

export async function run(api: TerminalApi) {
    const { print, input } = api;

    print('Willkommen beim Textadventure von Lina und Naya!');
    print('Du befindest dich im Garten von mrs Shears.');
    print('Du schlüpfst in Christophers Rolle und möchtest unbedingt den Täter ausfindig machen.');
    print('Du stehst vor dem Polizisten und er schüchtert dich ein.');

    async function polizei_station() {
        print('Er wird von dem Polizisten abgeführt und mit auf die Wache genommen.');
        print('Gratuliere, du hast gewonnen, der Nachbar wurde verhaftet, somit ist das Spiel beendet!');
    }

    async function handschuh_mit_blut() {
        print('Die Polizei durchsucht sein Haus und findet einen Handschuh mit Blut von Wellington drauf.');
        await polizei_station();
    }

    async function vorbei() {
        print('Die Polizei empfindet den Zettel für unwichtig und schickt dich nach Hause, GAME OVER.');
    }

    async function nachbar() {
        print('Du gehst zum Nachbarn, um dich zu erkundigen, ob er etwas mitbekommen hat.');
        print('Er erkennt die Schrift und schickt dich zum verdächtigen Nachbarn.');
        await verdächtiger_nachbar();
    }

    async function verdächtiger_nachbar() {
        let auswahl = await input('Verrät dir der Nachbar, ob er es war? (ja/nein) ');
        if (auswahl == 'ja') {
            await polizei_station();
        } else if (auswahl == 'nein') {
            await handschuh_mit_blut();
        }
    }

    async function sie_erkennt_schrift() {
        print('Sie erkennt die Schrift und schickt dich zum verdächtigen Nachbarn');
        await verdächtiger_nachbar();
    }

    async function einkaufszettel() {
        print('Du findest einen Einkaufszettel in der Nähe von dem Ort, an welchem der Hund lag.');
        let auswahl = await input(
            'Wohin gehst du mit diesem Einkaufszettel? (zu mrs Sheers/zu der Polizei) '
        );
        auswahl = auswahl.toLowerCase();
        if (auswahl == 'zu mrs sheers') {
            await sie_erkennt_schrift();
        } else if (auswahl == 'zu der polizei') {
            await vorbei();
        } else {
            print('Diese Antwort ist nicht erkennbar, versuche es noch einmal.');
            await einkaufszettel();
        }
    }

    async function liest_buch() {
        print(
            'In einer physikalischen Gleichung ist die Lösung 22. Diese Zahl kommt dir bekannt vor, denn in der Nähe vom Tatort hast du diese Nummer an einer Hauswand gesehen.'
        );
        let auswahl = await input('Willst du zum Tatort zurück? (ja/nein) ');
        if (auswahl == 'ja') {
            await einkaufszettel();
        } else {
            await nachbar();
        }
    }

    async function denkt_nochmal_nach() {
        print(
            'Du denkst über den Mord nach und realisierst, dass du bevor du den Hund gesehen hast, jemanden wegrennen gesehen hast. Du gehst zurück zur Polizei und meldest es.'
        );
        await jemanden_gesehen();
    }

    async function sieht_physikbuch() {
        print('Du willst dich ablenken und siehst dein Lieblings-Physikbuch auf dem Bett.');
        let auswahl = await input('Möchtest du es lesen? (ja/nein) ');
        if (auswahl == 'ja') {
            await liest_buch();
        } else if (auswahl == 'nein') {
            await denkt_nochmal_nach();
        }
    }

    async function erinnerung() {
        print(
            'Der Polizist erinnert sich an eine Befragung bei dem Nachbarn und erkennt, dass du ihn beschreibst. Somit geht ihr gemeinsam zum Nachbarn.'
        );
        await verdächtiger_nachbar();
    }

    async function beschreibung_ort() {
        print('Du beschreibst die Person A vor Ort.');
        await erinnerung();
    }

    async function beschreibung_wache() {
        print('Auf der Wache beschreibst du Person A.');
        await erinnerung();
    }

    async function beratung() {
        print('Der Polizist bedankt sich und berät sich mit der Partnerin.');
        let auswahl = await input(
            'Nimmt der Polizist dich mit auf die Wache, um eine Aussage aufzunehmen? (ja/nein) '
        );
        if (auswahl == 'ja') {
            await beschreibung_wache();
        } else if (auswahl == 'nein') {
            await beschreibung_ort();
        }
    }

    async function jemanden_gesehen() {
        print('Du erzählst, dass du jemanden wegrennen gesehen hast.');
        print(
            'Du hast zwei Bilder im Kopf und kannst dich nicht genau erinnern welche der beiden Personen wegrennen geshen hast: a)Diese Person erinnert dich an deinen Vater, welcher sehr sportlich ist. b) Diese Person erinnert dich an deinen Mathelehrer, welcher ein Holzbein hat'
        );
        let auswahl = await input('Welche Beschreibung trifft auf die Person zu? (a/b) ');
        if (auswahl == 'a') {
            await nachbar();
        } else if (auswahl == 'b') {
            await vorbei();
        }
    }

    async function polizei_verhoer() {
        print('Der Polizist verhört dich.');
        let auswahl = await input('Fragt der Polizist, ob du etwas beobachtet hast? (ja/nein) ');
        if (auswahl == 'ja') {
            await jemanden_gesehen();
        } else if (auswahl == 'nein') {
            await beratung();
        }
    }

    let auswahl = await input('Möchtest du wegrennen? (ja/nein) ');
    if (auswahl == 'ja') {
        print('Du sprintest nach Hause in dein Zimmer.');
        await sieht_physikbuch();
    } else if (auswahl == 'nein') {
        await polizei_verhoer();
    }
}
