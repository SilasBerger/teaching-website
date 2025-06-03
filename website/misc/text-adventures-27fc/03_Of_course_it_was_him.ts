import { TerminalApi } from '@tdev-components/Terminal';

export async function run(api: TerminalApi) {
    const { print, input } = api;

    async function look_cameras() {
        print('You decided to look for a camera.');
        print("You saw one at the next door neighbor's Gardenwall.");
        print('You ask your neighbor if they give you the footage. They give it to you.');
        print(
            'On the footage is Jamal with the killerfork and with some more details... You have proof against your neighbor Jamal. Now you can tell the police.'
        );
        let choice = await input('Are you telling the police? AT THIS POINT YOU NEED TO!!! (Yes/Yes):');
        if (choice == 'Yes') {
            await end();
        } else {
            print('Invalid choice! Try again!!!');
            await look_cameras();
        }
    }

    async function proof_Jamal() {
        print(
            ' You see your neighbor Jamal, in all black and without a beanie. Jamal is now your suspect number 1 and you have proof that he could be the murderer, now you could tell the police'
        );
        let choice = await input(
            'Are you telling the police or are you searching for videocameras? (tell police(1)/search for cameras(2))'
        );
        if (choice == '1') {
            await end();
        } else if (choice == '2') {
            await look_cameras();
        } else {
            print('Invalid choice! Try again!!!');
            await proof_Jamal();
        }
    }

    async function ask_neighborhood() {
        print(
            'Your next door neighbor tells you that she saw every day someone walk in all black at 8pm with a fork next to the garden where you found the Dog'
        );
        print('You could go watch at 8pm if there is someone or do you want to look for cameras');
        let choice = await input('Are you going at 8pm? (go at 8 pm(1)/ look for cameras(2)):');
        if (choice == '1') {
            await proof_Jamal();
        } else if (choice == '2') {
            await look_cameras();
        } else {
            print('Invalid choice! Try again!!!');
            await ask_neighborhood();
        }
    }

    async function crime_scene() {
        print('You found a black beanie. You could ask the neighborhood');
        let choice = await input(
            'Are you asking the neighborhood if they saw something or are you searching for a videocamera? (ask neighborhood(1)/look for videocameras(2)):'
        );
        if (choice == '1') {
            await ask_neighborhood();
        } else if (choice == '2') {
            await look_cameras();
        } else {
            print('Invalid choice! Try again!!!');
            await crime_scene();
        }
    }

    async function end() {
        print(
            'The police check the neighborhoods camera and saw your neighbor jamal kill the dog with the fork'
        );
        print('Your neighbor Jamal Jackson gets arrested.');
        print(
            'Jamal Jackson has been arrested for a few more crimes that he committed, the animalkiller of your neighborhood is now behind bars.'
        );
        print('Good job you solved the crime');
    }

    async function tell_cops() {
        print('Now your sure Jamal did it. Now you can tell the police or not if you dont want to.');
        let choice = await input('Are you telling the police? AT THIS POINT YOU NEED TO!!! (Yes/Yes):');
        if (choice == 'Yes') {
            await end();
        } else {
            print('Invalid choice! Try again!!!');
            await tell_cops();
        }
    }

    async function carry_on() {
        print(
            'Your next door neighbor saw someone in an all black fit. Your on the right path to solve the crime. Now you need to carry on you can search for a videocamera or tell the Police.'
        );
        let choice = await input('How do you carry on? (search for videocamera(1)/tell the police(2)):');
        if (choice == '1') {
            await look_cameras();
        } else if (choice == '2') {
            await end();
        } else {
            print('Invalid choice! Try again!!!');
            await carry_on();
        }
    }

    async function Alone() {
        print(
            'You decided not to tell the Police and to start your own research. You start searching for clues. You can go ask the neighborhood or go back to the crime scene.'
        );
        let choice = await input(
            'Where are you starting to search for clues? (neighborhood(1)/ crime scene(2)):'
        );
        if (choice == '1') {
            await carry_on();
        } else if (choice == '2') {
            await crime_scene();
        } else {
            print('Invalid choice! Try again!!!');
            await Alone();
        }
    }

    async function investigate() {
        print(
            "You decided to tell them where and how you found the dog. Now they don't need your help anymore. Now you can let them take over the crime or you can start doing your own research."
        );
        let choice = await input(
            'Are you letting them take over or are you doing your own search? (let them take over(1)/ do it alone(2)):'
        );
        if (choice == '1') {
            await end();
        } else if (choice == '2') {
            await Alone();
        } else {
            print('Invalid choice! Try again!!!');
            await investigate();
        }
    }

    async function police() {
        print('You decided to solve the crime with the police. You can investigate with them or not.');
        let choice = await input('Do you investigate with them? (yes(1)/no(2)):');
        if (choice == '1') {
            await investigate();
        } else if (choice == '2') {
            await Alone();
        } else {
            print('Invalid choice! Try again!!!');
            await police();
        }
    }

    async function first() {
        print('Welcome to the crime scene of Wellington.');
        print(
            "You found the neighbor's dog Wellington dead with a fork in his belly in their neighbor's garden."
        );
        print('You want to solve the crime. Do you want to solve the crime with the Police or alone?');
        let choice = await input('Do you call the Police or start alone? (police(1)/alone(2)): ');
        if (choice == '1') {
            await police();
        } else if (choice == '2') {
            await Alone();
        } else {
            print('Invalid choice! Try again!!!');
            await first();
        }
    }

    await first();
}
