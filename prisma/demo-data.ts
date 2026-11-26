import type { Priority } from './generated/enums.ts';

type DemoTask = {
  name: string;
  description: string;
  priority: Priority;
  dueInDays: number | null;
  completed: boolean;
};

type DemoProject = {
  name: string;
  description: string;
  tasks: DemoTask[];
};

export const demoUserName = 'Alex';

const deadlineOn = (today: Date, dueInDays: number | null) => {
  if (dueInDays === null) return null;
  return new Date(
    Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + dueInDays,
    ),
  );
};

export const buildDemoData = (today: Date) => {
  return demoProjects.map((project) => ({
    name: project.name,
    description: project.description,
    tasks: project.tasks.map((task) => ({
      name: task.name,
      description: task.description,
      priority: task.priority,
      completed: task.completed,
      deadline: deadlineOn(today, task.dueInDays),
    })),
  }));
};

export const demoProjects: DemoProject[] = [
  {
    name: 'Website Relaunch',
    description: 'A new marketing site before the spring campaign.',
    tasks: [
      {
        name: 'Audit the current pages for broken links',
        description:
          'Crawl the old site and list every 404 and redirect chain.',
        priority: 'low',
        dueInDays: -10,
        completed: true,
      },
      {
        name: 'Write the copy for the pricing page',
        description: 'Three plans, one comparison table, and an FAQ under it.',
        priority: 'high',
        dueInDays: -2,
        completed: false,
      },
      {
        name: 'Review the homepage hero with design',
        description:
          'Check the headline, the visual and the call to action on mobile first.',
        priority: 'medium',
        dueInDays: 1,
        completed: false,
      },
      {
        name: 'Set up redirects from the old URLs',
        description:
          'Map every old path to its new page so search traffic is not lost.',
        priority: 'high',
        dueInDays: 3,
        completed: false,
      },
      {
        name: 'Run Lighthouse on staging',
        description:
          'Performance and accessibility above 90 on the five main pages.',
        priority: 'medium',
        dueInDays: 3,
        completed: false,
      },
      {
        name: 'Convert the hero images to AVIF',
        description: 'Keep a JPEG fallback and compare the file sizes.',
        priority: 'low',
        dueInDays: 9,
        completed: false,
      },
      {
        name: 'Choose an analytics provider',
        description: 'Privacy-friendly, so no cookie banner is needed.',
        priority: 'medium',
        dueInDays: -6,
        completed: true,
      },
      {
        name: 'Add Open Graph images',
        description: 'One per main page, 1200 by 630.',
        priority: 'low',
        dueInDays: null,
        completed: true,
      },
    ],
  },
  {
    name: 'Mobile App Beta',
    description: 'The first public beta of the iOS and Android app.',
    tasks: [
      {
        name: 'Fix the crash on login with an expired session',
        description:
          'Reproduces when the app wakes up after a day in the background.',
        priority: 'high',
        dueInDays: -1,
        completed: false,
      },
      {
        name: 'Write the TestFlight release notes',
        description:
          'What is new, what is known to be broken, how to send feedback.',
        priority: 'medium',
        dueInDays: 2,
        completed: true,
      },
      {
        name: 'Invite the first 50 beta testers',
        description: 'Start with the waitlist, oldest sign-ups first.',
        priority: 'medium',
        dueInDays: 4,
        completed: true,
      },
      {
        name: 'Set up crash reporting',
        description: 'Symbolicated stack traces for both platforms.',
        priority: 'high',
        dueInDays: -8,
        completed: true,
      },
      {
        name: 'Design the onboarding screens',
        description: 'Three screens at most, and every one can be skipped.',
        priority: 'medium',
        dueInDays: -12,
        completed: true,
      },
      {
        name: 'Add a feedback button to settings',
        description: 'Opens a short form with the app version filled in.',
        priority: 'low',
        dueInDays: 12,
        completed: false,
      },
      {
        name: 'Prepare the App Store screenshots',
        description: 'Six sizes, in light and dark.',
        priority: 'medium',
        dueInDays: 14,
        completed: false,
      },
      {
        name: 'Decide when the beta ends',
        description: 'Depends on the crash-free rate in the first two weeks.',
        priority: 'low',
        dueInDays: null,
        completed: false,
      },
    ],
  },
  {
    name: 'Conference Talk',
    description: 'A 25-minute talk about shipping a design system.',
    tasks: [
      {
        name: 'Submit the talk abstract',
        description: 'A title, 300 words, and a short bio.',
        priority: 'high',
        dueInDays: -20,
        completed: true,
      },
      {
        name: 'Draft the slide outline',
        description: 'One idea per slide, with the demo in the middle.',
        priority: 'high',
        dueInDays: -3,
        completed: false,
      },
      {
        name: 'Build the live demo',
        description: 'Small enough to type on stage.',
        priority: 'high',
        dueInDays: 6,
        completed: false,
      },
      {
        name: 'Ask two colleagues for feedback',
        description: 'A dry run over a video call, notes in a shared doc.',
        priority: 'medium',
        dueInDays: 8,
        completed: false,
      },
      {
        name: 'Rehearse with a timer',
        description: 'Twice in full, aiming for 23 minutes.',
        priority: 'medium',
        dueInDays: 10,
        completed: false,
      },
      {
        name: 'Book travel and a hotel',
        description: 'Arrive the evening before, leave the morning after.',
        priority: 'medium',
        dueInDays: -5,
        completed: true,
      },
      {
        name: 'Record a backup video of the demo',
        description: 'In case the venue Wi-Fi fails.',
        priority: 'low',
        dueInDays: 16,
        completed: false,
      },
    ],
  },
  {
    name: 'Apartment Move',
    description: 'Moving to the new place at the end of the month.',
    tasks: [
      {
        name: 'Give notice to the landlord',
        description: 'In writing, two months ahead, as the contract says.',
        priority: 'high',
        dueInDays: -15,
        completed: true,
      },
      {
        name: 'Compare three moving companies',
        description: 'The same inventory list to each, quotes in one table.',
        priority: 'medium',
        dueInDays: -4,
        completed: true,
      },
      {
        name: 'Pack the bookshelf',
        description: 'Books in small boxes, so each one can still be lifted.',
        priority: 'low',
        dueInDays: 0,
        completed: false,
      },
      {
        name: 'Transfer the internet to the new address',
        description: 'Book the technician before the move-in date.',
        priority: 'high',
        dueInDays: 7,
        completed: false,
      },
      {
        name: 'Update the address at the bank',
        description: 'And at the tax office.',
        priority: 'medium',
        dueInDays: 11,
        completed: false,
      },
      {
        name: 'Take meter readings on moving day',
        description: 'A photo of each meter, with the date visible.',
        priority: 'medium',
        dueInDays: 21,
        completed: false,
      },
      {
        name: 'Sell the old sofa',
        description: 'List it with photos from two angles.',
        priority: 'low',
        dueInDays: null,
        completed: false,
      },
    ],
  },
];
