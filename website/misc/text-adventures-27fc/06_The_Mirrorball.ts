import { TerminalApi } from '@tdev-components/Terminal';

export async function run(api: TerminalApi) {
    const { print, input } = api;

    print('Welcome to our detective game!');
    print('You came home after seeing a dead dog in your neighbor´s garten');
    print('You decide to find the murderer. You can ask Siobhan or Mrs. Shears');

    let decision = await input('Who would you like to ask first? a)Siobhan b)Mrs. Shears');
    if (decision == 'a') {
        print('She did not know anything about the dogs death and started crying');
        print('No one could help you so you dicided to find the murderer yourself');
    } else if (decision == 'b') {
        print('She yelled at you and you didn´t get any important information');
        print('No one could help you so you dicided to find the murderer yourself');
    }

    async function mr_russel() {
        print('Mr. Russell says that he hates dogs because a dog once attacked him.');
    }

    decision = await input(
        'What will you do next? a)observe your neighbours b)Look for any clues at the place where the dog died'
    );
    if (decision == 'a') {
        print('You notices that Mr. Russell rarely leaves his house');
        decision = await input('What do you do? a)Ask Mr. Russell some questions b)Spy on Mr. Russell');
        if (decision == 'a') {
            await mr_russel();
        } else if (decision == 'b') {
            print('You find out that Mr. Russell hates dogs, but loves cats');
            print('No one could help you so you dicided to find the murderer yourself');
            print('You also ask him about Wellington, but Mr. Russell has no clue who Wellington is');
            print("You don't know what to do, so you ask Siobhan");
            print(
                'She told you the last time she visited Mrs. Shears she was very mad at you and did not want to talk about it'
            );
        }
    } else if (decision == 'b') {
        print('You found the gardering fork');
        print('You looked at it very carefully and noticed some hair on the fork');
        let desicion = await input(
            'What will you do? a)Send the hair to a lab for a DNA test b)Ask Siobhan what you should do'
        );
        if (decision == 'a') {
            print('It was Wellingtons hair');
            print(" You didn't get any important information. Go back to the start and try again!");
        } else if (decision == 'b') {
            print(
                'She told you the last time she visited Mrs. Shears she was very mad at you and did not want to talk about it'
            );
        }
    }

    print(
        'In the next few days you try to find any clues, but you found nothing. You feel like everyone is looking at you'
    );
    let desicion = await input('What now? a)Wash your clothes b)Help your father in the garden');
    if (desicion == 'a') {
        print(
            'While you were washing your clothes, you saw blood on your gardering gloves and on your t-shirt'
        );
        let desicon = await input(
            "What is your reaction? a)Don't pay attention to it and forget about it b)Think about this situation to understand where the blood came from"
        );
        if (desicion == 'a') {
            print('You want to find the murderer and not forget anything');
        } else if (desicion == 'b') {
            print(
                'When you thought about it, some memories came to your mind: You remember that dark night. You remember how you found the dead dogs body'
            );
            print(
                'It was shocking for you. You realized that you remember nothing about the events of that night.'
            );
        }
    } else if (desicion == 'b') {
        print(
            'While helping your father you need a gardening fork, so you go to garden shed. You looked at the fork, when suddenly came some memories to your mind: You remmber that dark night. You remember how you found the dead dogs body.'
        );
        print(
            'It was shocking for you. You realized that you remember nothing about the events of that night.'
        );
    }

    desicion = await input(
        'What is your next step? a)Tell your parents b)Think about this situation again and summarize all the clues'
    );
    if (desicion == 'a') {
        print('They thought this story was very strange and sent you to a terapist');
        print('Now you can not find out who the murderer is. You failed!');
    } else if (desicion == 'b') {
        print(
            'You were sitting for hours in silence and thinking. During this time, you realized that none of your neighbours killed the dog.'
        );
        print(
            "You didn't find a single clue that point to a person you could know. You also noticed that many people began to look diffrently at you after the dog died."
        );
        print(
            "Mrs. Shears was still really mad at you and you didn't understand why. You thought a lot until you fell asleep."
        );
        print('You had a terrible nightmare that night and woke up sweating.');
        desicion = await input('Do you want to continous? a)Yes! b)No');
        if (desicion == 'a') {
            print('All the puzzles came together...');
            print('After the nightmare you remember everything. You were alone in the garden at that night.');
            print(
                "The garden fork that was sticking out of the dog belonged to his family. Dog's blood was on your clothes."
            );
            print('And Mrs. Shears who saw her dog being killed from the kitchen window began to hate you');
            print('YOU WERE THE MURDERER!');
        } else if (desicion == 'b') {
            print("I think you don't really want to find the murderer of Wellington");
        }
    }
}
