import { User, Group, Bet, BetStatus, Message, Transaction } from './types';

export const CURRENT_USER_ID = 'u1';

export const MOCK_USERS: Record<string, User> = {
  'u1': { id: 'u1', name: 'Alex Rivera', avatar: 'https://picsum.photos/seed/u1/200/200', balance: 250.00 },
  'u2': { id: 'u2', name: 'Sarah Chen', avatar: 'https://picsum.photos/seed/u2/200/200', balance: 1420.50 },
  'u3': { id: 'u3', name: 'Jordan Mike', avatar: 'https://picsum.photos/seed/u3/200/200', balance: 85.00 },
  'u4': { id: 'u4', name: 'Casey Smith', avatar: 'https://picsum.photos/seed/u4/200/200', balance: 500.00 },
};

export const MOCK_GROUPS: Group[] = [
  { id: 'g1', name: 'Poker Night Crew', description: 'Weekly Texas Holdem predictions and debts.', memberCount: 4, imageUrl: 'https://picsum.photos/seed/poker/400/400' },
  { id: 'g2', name: 'Startup Founders', description: 'Who ships first? Who raises first?', memberCount: 12, imageUrl: 'https://picsum.photos/seed/startup/400/400' },
  { id: 'g3', name: 'Sunday League', description: 'Betting on our own terrible soccer matches.', memberCount: 18, imageUrl: 'https://picsum.photos/seed/soccer/400/400' },
];

export const INITIAL_BETS: Bet[] = [
  {
    id: 'b1',
    groupId: 'g1',
    creatorId: 'u2',
    title: 'Who wins the main event tonight?',
    description: 'Requires proof of final chip count.',
    minStake: 20,
    status: BetStatus.OPEN,
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    deadline: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
    totalPot: 60,
    options: [
      { id: 'opt1', text: 'Alex' },
      { id: 'opt2', text: 'Sarah' },
      { id: 'opt3', text: 'Jordan' }
    ]
  },
  {
    id: 'b2',
    groupId: 'g1',
    creatorId: 'u3',
    title: 'Will Jordan be late?',
    description: 'Late is defined as arriving after 8:15 PM.',
    minStake: 10,
    status: BetStatus.RESOLVED,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    deadline: new Date(Date.now() - 80000000).toISOString(),
    totalPot: 100,
    options: [
      { id: 'opt1', text: 'Yes' },
      { id: 'opt2', text: 'No' }
    ]
  }
];

export const INITIAL_MESSAGES: Message[] = [
  { id: 'm1', groupId: 'g1', userId: 'u2', text: 'Anyone want to bet on the game tonight?', timestamp: new Date(Date.now() - 4000000).toISOString() },
  { id: 'm2', groupId: 'g1', userId: 'u2', text: 'Created a market above.', timestamp: new Date(Date.now() - 3600000).toISOString(), isSystem: true, relatedBetId: 'b1' },
  { id: 'm3', groupId: 'g1', userId: 'u1', text: 'I am definitely taking your money Sarah.', timestamp: new Date(Date.now() - 3500000).toISOString() },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', userId: 'u1', amount: 500, type: 'DEPOSIT', description: 'Initial Deposit', timestamp: new Date(Date.now() - 100000000).toISOString() },
  { id: 't2', userId: 'u1', amount: -20, type: 'STAKE', description: 'Stake on "Will Jordan be late?"', timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 't3', userId: 'u1', amount: -50, type: 'STAKE', description: 'Poker Buy-in Bet', timestamp: new Date(Date.now() - 80000000).toISOString() },
  { id: 't4', userId: 'u1', amount: 38.50, type: 'PAYOUT', description: 'Winnings: "Will Jordan be late?"', timestamp: new Date(Date.now() - 79000000).toISOString() },
];