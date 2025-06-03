import { TerminalApi } from '@tdev-components/Terminal';

export async function run(api: TerminalApi) {
    const { print, input } = api;

    async function policeman() {
        print();
        print('The policeman doesn’t believe you and takes you to the station.');
        print();
        print(
            "You answer the questions they're asking, but no one believes you. So, you end up in jail. Two days later, your father breaks in with a helicopter and takes you to his house, where you find a fork with initials."
        );
        print();
        await fork();
    }

    async function escape() {
        print();
        print('you hit the policeman and escape');
        print();
        print('The policeman hits you with the gun on the leg, and you get injured. ');
        print();
        await hide();
    }

    async function look_at_fork() {
        print();
        print('You see that the fork has the same initials as the one the dog was killed with.');
        print(
            'You suspect that your father killed the dog and try to find him. You discover his phone and see a message that says: "Come me to Aarbergstrasse 6." '
        );
        print();
        await killer();
    }

    async function bohoho() {
        print();
        print();
        print('bohoho you are dead. Welcome to the hell. ');
    }

    async function find_photo_album() {
        print(
            "You look around until you find an old photo album. When you open it, you can't believe your eyes. "
        );
        print('You see pictures of your father and Mrs. Shearks, looking like a love couple ');
        print();
        await recording();
    }

    async function olaola() {
        print();
        print();
        print('Olaola welcome to the other side. Ps: You are dead. ');
    }

    async function video() {
        print();
        print(
            "I killed the dog with the fork because your choice was Sophie, Christopher's mother, and not me."
        );
        print();
        print('Congratulations, you found the culprit.');
    }

    async function garden_fork() {
        print();
        print('Mrs. Shears killed you with the same garden fork. Hoho!! ');
    }

    async function hihi() {
        print();
        print('You have reached a destination, that you wouldn’t like. hihi ');
    }

    async function place() {
        print();
        print(
            'When you open the door, you start to search for a place to hide. You find a portrait of the same dog with a man you’ve never seen before. '
        );
        print();
        await portrait();
    }

    async function alive() {
        print();
        print('The Person in the portrait gets alive and kills you. ');
    }

    async function wall() {
        print();
        print('You take the portrait off the wall and it begins to move. ');
        print();
        await father();
    }

    async function enemie() {
        print();
        print('You meet your biggest enemie, the devel of the live. ');
    }

    async function jewelry() {
        print();
        print(
            'You see many pieces of gold, jewelry, guns, very expensive cars and a picture of your father and Mrs. Shears. '
        );
        print();
        await gold();
    }

    async function mrs_shears() {
        print();
        print('"What are you doing, Christopher?" Asks Mrs. Shears. ');
        print();
        print('What should you do? ');
        await congratulations();
    }

    async function psychiatric() {
        print();
        print('Welcome to the psychiatric hospita. ');
    }

    async function prison() {
        print();
        print('You end up in prison. ');
    }

    async function first_love() {
        print();
        print('"Why are you in the picture with my father?" ');
        print();
        print(
            "Because he was my first love, and I was his. He betrayed me with your mother. That's why he has to suffer like I did! "
        );
        print();
        print(
            "I killed the dog with the fork because your choice was Sophie, Christopher's mother, and not me said Mrs. Shears. "
        );
        print();
        print('Congratulations, you found the culprit.');
    }

    async function start() {
        const choice = await input(
            'Try to explain the situation you are in/Hit the policeman and escape?(explain/hit): '
        );
        if (choice == 'explain') {
            await policeman();
        } else if (choice == 'hit') {
            await escape();
        } else {
            await start();
        }
    }

    async function fork() {
        const choice = await input('Should you look at the fork? (yes/no): ');
        if (choice == 'no') {
            await look_at_fork();
        } else if (choice == 'yes') {
            await bohoho();
        } else {
            await fork();
        }
    }

    async function killer() {
        const choice = await input(
            'Should you go to the address and find out the truth or ignore the message? (yes/no): '
        );
        if (choice == 'yes') {
            await find_photo_album();
        } else if (choice == 'no') {
            await olaola();
        } else {
            await killer();
        }
    }

    async function recording() {
        const choice = await input('Do you want to make the video recording or not? (yes/no) ');
        if (choice == 'yes') {
            await video();
        } else if (choice == 'no') {
            await garden_fork();
        } else {
            await recording();
        }
    }

    async function hide() {
        const choice = await input('You see a house from far away. Should you enter? (yes/no)');
        if (choice == 'no') {
            await hihi();
        } else if (choice == 'yes') {
            await place();
        } else {
            await hide();
        }
    }

    async function portrait() {
        const choice = await input('Should you take it off and examine it up close? (yes/no) ');
        if (choice == 'no') {
            await alive();
        } else if (choice == 'yes') {
            await wall();
        } else {
            await portrait();
        }
    }

    async function father() {
        const choice = await input('A room opens infront of you. Do you want to enter? (yes/no): ');
        if (choice == 'no') {
            await enemie();
        } else if (choice == 'yes') {
            await jewelry();
        } else {
            await father();
        }
    }

    async function gold() {
        const choice = await input(
            'Do you want to take the gold and run away or stay and hide yourself? (a/b) '
        );
        if (choice == 'b') {
            await mrs_shears();
        } else if (choice == 'a') {
            await psychiatric();
        } else {
            await gold();
        }
    }

    async function congratulations() {
        const choice = await input('Confront her/Kill her with the fork.(confront/kill): ');
        if (choice == 'kill') {
            await prison();
        } else if (choice == 'confront') {
            await first_love();
        } else {
            await congratulations();
        }
    }

    print(
        "Christopher finds Wellington's dog dead with a fork in it. He stands outside of Mrs. Shears garden and tries to find the killer. After a while, the police arrives and take him as a suspect. "
    );
    print();
    await start();
}
