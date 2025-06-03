import { ConsoleApi } from '@tdev-components/Console';

export async function run(api: ConsoleApi) {
    const { print, input } = api;

    print('Welcome to the incident of the mysterious dog in the night time.');
    print('');
    print(
        'As you walk to the garden of Mrs. Shears, your neighbour, you notice that there is something in the grass.'
    );
    print('Your curiosity got the better of you so you walked to the mysterious object.');
    print('');
    print("You could not believe your eyes, as you saw your neighbour's beloved dog dead.");
    print(
        'Mrs. Shears comes up to you, screaming and accusing you of killing her dog. She calls the police.'
    );
    print('');
    print('Once the police arrive at the crime scene they approach you: ');

    async function right_side() {
        print("You find a piece of paper that states: 'Wrong neighbour'");
        print('');
        print("You go to your other neighbour's gardenhouse and you decide to enter it.");
        print('');
        print('As you enter the gardenhouse you notice a tempting garden fork lying on the table.');
        const takethefork = (await input('Do you want to take the garden fork?(yes/no): ')).toLowerCase();
        print('');
        if (takethefork === 'yes') {
            print('You take the gardenfork and you go out of the house.');
            print('');
            await input('');
            print('As you see a dog you start to feel a weird temptation...');
            print('');
            await input('');
            print(
                'The temptation is to kill the dog. You take the garden fork and you start to stab the dog repeatedly.'
            );
            print('');
            const lastquestion = (
                await input('Do you want to kill yourself or go to the police?(kill/police): ')
            ).toLowerCase();
            if (lastquestion === 'kill') {
                print(
                    'In the final moments, as you kill the dog, you thrust the garden fork into your own stomach, stabbing yourself.'
                );
                print('');
                print('What an interesting end...');
            } else if (lastquestion === 'police') {
                print('');
                print('As you surrender yourself to the police, they immediately arrest you for murder.');
                print('');
                print('What a boring end...');
            } else {
                print('');
                print('Your character does not like that interaction.');
            }
        } else if (takethefork === 'no') {
            print('You leave the fork and search for other hints.');
            print('');
            print('You notice a camera in the corner of the room.');
            print('You pick up the camera and check its contents...');
            await input('');
            print('');
            print(
                'The footage shows the dog happily playing, but then its movements become frantic. Suddenly, it collapses onto the fork, as if drawn to its own demise.'
            );
            print('');
            await input('');
            print('');
            print(
                'You show the police the video and the mystery of the incident of the dog in the night time is solved.'
            );
        } else {
            print('Your character does not like that interaction.');
        }
    }

    async function search_direction() {
        const hints = (await input('Do you want to search left or right?(left/right): ')).toLowerCase();
        if (hints === 'right') {
            await right_side();
        } else if (hints === 'left') {
            print('You find a piece of paper on the left side.');
            print('');
            const takepaper = (await input('Do you want to take the paper?(yes/no): ')).toLowerCase();
            if (takepaper === 'yes') {
                print("You see a paper that states: 'You know who did this.'");
                print('');
                print('You leave the left side and go to the right side.');
                await right_side();
            } else if (takepaper === 'no') {
                print('');
                print('Theres nothing else for you to find here.');
                print('You leave the left side and head to the right side.');
                await right_side();
            } else {
                print('That is not an option at the moment.');
                await investigationpaper();
            }
        } else {
            print('That side does not exist.');
            await search_direction();
        }
    }

    async function investigationpaper() {
        const takepaper = (await input('Do you want to take the paper?(Yes/No): ')).toLowerCase();
        if (takepaper === 'yes') {
            print("You see a paper that states: 'You know who did this.'");
            print('');
            print('You leave the left side and head to the right side.');
        } else if (takepaper === 'no') {
            print('');
            print('Theres nothing else for you to find here.');
            print('You leave the left side and head to the right side.');
        } else {
            print('That is not an option at the moment.');
        }
    }

    async function karensgardenhouse() {
        print('');
        print(
            'You get back to the crime scene, and you start investigating at the gardenhouse of Mrs. Shears.'
        );
        const hints = (await input('Do you want to search left or right?(left/right): ')).toLowerCase();
        if (hints === 'right') {
            await right_side();
        } else if (hints === 'left') {
            print('You find a piece of paper on the left side.');
            print('');
            const takepaper = (await input('Do you want to take the paper?(yes/no): ')).toLowerCase();
            if (takepaper === 'yes') {
                print("You see a paper that states: 'You know who did this.'");
                print('');
                print('You leave the left side and go to the right side.');
                await right_side();
            } else if (takepaper === 'no') {
                print('');
                print('Theres nothing else for you to find here.');
                print('You leave the left side and head to the right side.');
                await right_side();
            } else {
                print('That is not an option at the moment.');
                await investigationpaper();
            }
        } else {
            print('That side does not exist.');
            await search_direction();
        }
    }

    async function investigationbar() {
        print('You are in a bar. Choose your first suspect.');
        print('');
        const suspectsbar = (await input('Choose your suspect(drunk/bartender) ')).toLowerCase();
        if (suspectsbar === 'drunk') {
            print("The drunk man looks at you and says: 'What do you want from me little boy?'");
            await input('Your answer: ');
            print('');
            print('He ignores your interaction.');
            await investigationbar();
        } else if (suspectsbar === 'bartender') {
            print('The bartender looks at you with a mischievous grin...');
            print('');
            const bartenderanswer = (
                await input('Go back to the door at the bar or ask him to pour you a drink(back/drink): ')
            ).toLowerCase();
            if (bartenderanswer === 'back') {
                print('');
                print('You go back to the door at the bar.');
                await investigationbar();
            } else if (bartenderanswer === 'drink') {
                print('');
                print('The bartender makes you a dirty martini with something written on the napkin.');
                print("The napkin states: 'You are not on right track. Go back to the crime scene.'");
                print('');
                print('You follow the hint of the bartender and you go back to the crime scene.');
                await karensgardenhouse();
            } else {
                await investigationbar();
            }
        } else {
            print('');
            print('that is not a suspect.');
            print('');
            await investigationbar();
        }
    }

    async function killthedog() {
        const dogkill = (await input('Did you killed the dog?: ')).toLowerCase();
        if (dogkill === 'yes') {
            print('');
            print('The police takes you immediately to prison.');
            print('');
            print('YOU LOST THE GAME, WHO SAYS YES???');
            return;
        } else if (dogkill === 'no') {
            print('');
            print('Thats enough questions, for now...');
            print('');
            print('After 30min of getting interviewed they ask you for help: ');
            await help_or_not();
        }
    }

    async function help_or_not() {
        const help_police = (await input('Do you want to help the police?(yes/no): ')).toLowerCase();
        if (help_police === 'yes') {
            print('');
            print('The police ask you to go to the city to investigate.');
            print('');
            const go_city = (await input('Do you want to go to the city?: ')).toLowerCase();
            if (go_city === 'yes') {
                print('');
                await investigationbar();
            } else {
                await help_or_not();
            }
        } else if (help_police === 'no') {
            print('');
            print('You start your own investigation. You go to the city.');
            await investigationbar();
        } else {
            print('');
            print("The police didn't understand what you were saying so they asked you again: ");
            await help_or_not();
        }
    }

    async function trust_or_not() {
        const run_or_stay = (await input('Do you want to run away?(Run/Stay): ')).toLowerCase();
        if (run_or_stay === 'run') {
            print('');
            print('The adrenalin got to your head so you ran away from the police.');
            print('');
            const left_or_right = (await input('Do you want to turn left or right?')).toLowerCase();
            if (left_or_right === 'right') {
                print('');
                print(
                    "You take a sharp right turn, slip on a piece of paper but you don't notice it and fall. They catch you."
                );
            } else if (left_or_right === 'left') {
                print('');
                print('You take a sharp left turn, slip and fall. They catch you.');
            }
            print('');
            print('They take you back to the crime scene.');
            await trust_or_not();
        } else if (run_or_stay === 'stay') {
            print('');
            print('The police starts the investigation by questioning you. And so they ask: ');
            print('');
            await input('What were you doing here?: ');
            print('');
            print('right...');
            print('');
            await input('What is your relationship with Mrs. Shears like?: ');
            print('');
            print('interesting...');
            await killthedog();
        } else {
            print('The police did not understand your interaction, so they do nothing.');
            await trust_or_not();
        }
    }

    await trust_or_not();
}
