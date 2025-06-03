import { TerminalApi } from '@tdev-components/Terminal';

export async function run(api: TerminalApi) {
    const { print, input } = api;

    print('Welcome to the hunt.');
    let state = 'start';
    let option = '';
    let suspect = 'unknown';

    while (option.toLowerCase() !== 'i go home' && option.toLowerCase() !== 'exit') {
        if (state === 'start') {
            print(
                'Before you go home, you see a dog with a fork in his body. It seems the dog is quite dead.'
            );
            state = 'dog';
        }
        if (state === 'dog') {
            option = await input('do you want to remove the fork (yes/no)');
            if (option === 'yes') {
                print('while pulling on the fork you poked your eye and you cant hunt anymore');
            } else if (option === 'no') {
                print('Great idea,good choice');
                state = 'neighbours';
            }
        }
        if (state === 'neighbours') {
            option = await input('do you want to go ask the neighbors for hints?(yes/no)');
            if (option === 'yes') {
                // The original code has a syntax error here (missing print), so we keep it as is:
                print('');
                state = 'shoe';
            } else if (option === 'no') {
                print('you have no hints, you cant investigate further on the crime');
                state = "i don't know";
            }
        }
        if (state === 'shoe') {
            option = await input('Do you want to check security cameras near the crime scene? (yes/no)');
            if (option === 'yes') {
                print('You see a man wearing Nike shoes running away from the scene.');
            } else if (option === 'no') {
                print('You decide to rely on other clues.');
            }
            option = await input('Do you want to check the shoe prints near the scene? (yes/no) ');
            if (option.toLowerCase() === 'yes') {
                print('The shoe prints match the ones seen on the camera footage.');
            } else if (option.toLowerCase() === 'no') {
                print('You skip this clue and move on.');
            }
            option = await input('Do you want to check the local shoe store records? (yes/no) ');
            if (option.toLowerCase() === 'yes') {
                print('The store owner says christopher his dad bought those exact shoes last week.');
                suspect = 'christophers dad';
                state = 'suspect';
            } else if (option.toLowerCase() === 'no') {
                suspect = 'unknown';
                state = "i don't know";
            }
        }
        if (state === 'suspect') {
            print('You track christophers dad down and find bloodstains on his clothes.');
            option = await input('Do you want to confront christophers dad? (yes/no) ');
            if (option.toLowerCase() === 'yes') {
                print('christophers dad confesses to the crime! You have found the murderer.');
                print('Congratulations you won the game.');
                option = 'exit';
            } else if (option.toLowerCase() === 'no') {
                print('You let him go, and the case remains unsolved.');
                state = "i don't know";
            } else if (suspect === '') {
                print('Without a clear suspect, the case remains open.');
                state = "i don't know";
            }
        }
        if (state === "i don't know") {
            state = (
                await input(
                    "you look around you, and you don't know what do you. You could always go home and exit this part. Or you could restart from the beginning and have a look at the dog (start) "
                )
            ).toLowerCase();
            if (state !== 'start') {
                state = "i don't know";
            }
        }
    }

    print('The investigation is over.');
}
