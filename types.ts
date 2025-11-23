// ---------------------------------------------------------
// PRISMA SCHEMA REFERENCE (For Backend Implementation)
// ---------------------------------------------------------
/*
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  avatar        String?
  balance       Float     @default(1000.00)
  createdAt     DateTime  @default(now())
  
  memberships   GroupMember[]
  betsCreated   Bet[]
  participations BetParticipation[]
  votes         BetResolutionVote[]
  transactions  Transaction[]
}

model Group {
  id          String   @id @default(cuid())
  name        String
  description String?
  inviteCode  String   @unique
  createdAt   DateTime @default(now())
  
  members     GroupMember[]
  bets        Bet[]
  messages    Message[]
}

model Bet {
  id          String    @id @default(cuid())
  title       String
  description String?
  amount      Float     // Minimum stake
  status      BetStatus @default(OPEN)
  creatorId   String
  groupId     String
  deadline    DateTime
  
  options     BetOption[]
  participations BetParticipation[]
  createdAt   DateTime @default(now())
}

model BetOption {
  id        String @id @default(cuid())
  text      String // "Yes", "No", "Player A"
  betId     String
}

model BetParticipation {
  id        String @id @default(cuid())
  userId    String
  betId     String
  optionId  String
  amount    Float
}

enum BetStatus {
  OPEN
  LOCKED
  RESOLVED
  CANCELLED
}
*/

// ---------------------------------------------------------
// FRONTEND TYPES
// ---------------------------------------------------------

export interface User {
  id: string;
  name: string;
  avatar: string;
  balance: number;
  walletAddress?: string; // Future crypto hook
}

export interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  imageUrl?: string;
}

export enum BetStatus {
  OPEN = 'OPEN',
  VOTING = 'VOTING',
  RESOLVED = 'RESOLVED',
  CANCELLED = 'CANCELLED',
}

export interface BetOption {
  id: string;
  text: string;
}

export interface Bet {
  id: string;
  groupId: string;
  creatorId: string;
  title: string;
  description: string;
  minStake: number;
  status: BetStatus;
  createdAt: string;
  deadline: string;
  options: BetOption[];
  totalPot: number;
}

export interface Participation {
  userId: string;
  betId: string;
  optionId: string;
  amount: number;
}

export interface Message {
  id: string;
  groupId: string;
  userId: string;
  text: string; // If null, it might be a system message (like a bet creation)
  timestamp: string;
  isSystem?: boolean;
  relatedBetId?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number; // Positive for win/deposit, negative for stake/withdraw
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'STAKE' | 'PAYOUT' | 'FEE';
  description: string;
  timestamp: string;
}

export const PLATFORM_FEE_PERCENT = 0.03;