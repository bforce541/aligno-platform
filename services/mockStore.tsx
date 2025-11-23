import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Group, Bet, Message, Transaction, Participation, BetStatus, PLATFORM_FEE_PERCENT } from '../types';
import { MOCK_USERS, MOCK_GROUPS, INITIAL_BETS, INITIAL_MESSAGES, INITIAL_TRANSACTIONS, CURRENT_USER_ID } from '../constants';

interface AppState {
  currentUser: User;
  users: Record<string, User>;
  groups: Group[];
  bets: Bet[];
  messages: Message[];
  participations: Participation[];
  transactions: Transaction[];
  
  // Actions
  placeBet: (betId: string, optionId: string, amount: number) => Promise<void>;
  createBet: (groupId: string, title: string, description: string, minStake: number, options: string[], deadline: string) => Promise<void>;
  createGroup: (name: string, description: string, imageUrl: string) => Promise<string>;
  sendMessage: (groupId: string, text: string) => void;
  resolveBet: (betId: string, winningOptionId: string) => Promise<void>;
  addFunds: (amount: number) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [groups, setGroups] = useState(MOCK_GROUPS);
  const [bets, setBets] = useState(INITIAL_BETS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [participations, setParticipations] = useState<Participation[]>([
     // Pre-seed some participations for the resolved bet
     { userId: 'u1', betId: 'b2', optionId: 'opt1', amount: 20 },
     { userId: 'u2', betId: 'b2', optionId: 'opt2', amount: 20 },
     { userId: 'u3', betId: 'b2', optionId: 'opt1', amount: 20 },
     { userId: 'u4', betId: 'b2', optionId: 'opt1', amount: 40 },
  ]);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  const currentUser = users[CURRENT_USER_ID];

  const addFunds = (amount: number) => {
    setUsers(prev => ({
      ...prev,
      [CURRENT_USER_ID]: { ...prev[CURRENT_USER_ID], balance: prev[CURRENT_USER_ID].balance + amount }
    }));
    const newTx: Transaction = {
      id: Date.now().toString(),
      userId: CURRENT_USER_ID,
      amount: amount,
      type: 'DEPOSIT',
      description: 'Test funds deposit',
      timestamp: new Date().toISOString()
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const createGroup = async (name: string, description: string, imageUrl: string) => {
    const newGroupId = `g${Date.now()}`;
    const newGroup: Group = {
      id: newGroupId,
      name,
      description,
      memberCount: 1, // Start with just the creator
      imageUrl
    };
    setGroups(prev => [...prev, newGroup]);
    return newGroupId;
  };

  const createBet = async (groupId: string, title: string, description: string, minStake: number, optionsRaw: string[], deadline: string) => {
    const newBetId = `b${Date.now()}`;
    const options = optionsRaw.map((text, idx) => ({ id: `${newBetId}_opt${idx}`, text }));
    
    const newBet: Bet = {
      id: newBetId,
      groupId,
      creatorId: CURRENT_USER_ID,
      title,
      description,
      minStake,
      status: BetStatus.OPEN,
      createdAt: new Date().toISOString(),
      deadline, // In real app, this is a Date
      totalPot: 0,
      options
    };

    setBets(prev => [newBet, ...prev]);
    
    // Announce in chat
    const sysMsg: Message = {
      id: `m${Date.now()}`,
      groupId,
      userId: CURRENT_USER_ID,
      text: 'Created a new bet',
      isSystem: true,
      relatedBetId: newBetId,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, sysMsg]);
  };

  const placeBet = async (betId: string, optionId: string, amount: number) => {
    if (currentUser.balance < amount) throw new Error("Insufficient funds");

    // Deduct balance
    setUsers(prev => ({
      ...prev,
      [CURRENT_USER_ID]: { ...prev[CURRENT_USER_ID], balance: prev[CURRENT_USER_ID].balance - amount }
    }));

    // Add participation
    setParticipations(prev => [...prev, { userId: CURRENT_USER_ID, betId, optionId, amount }]);

    // Update Bet Pot
    setBets(prev => prev.map(b => b.id === betId ? { ...b, totalPot: b.totalPot + amount } : b));

    // Log Transaction
    const tx: Transaction = {
      id: `tx${Date.now()}`,
      userId: CURRENT_USER_ID,
      amount: -amount,
      type: 'STAKE',
      description: `Stake on bet #${betId}`,
      timestamp: new Date().toISOString()
    };
    setTransactions(prev => [tx, ...prev]);
  };

  const resolveBet = async (betId: string, winningOptionId: string) => {
    const bet = bets.find(b => b.id === betId);
    if (!bet) return;

    const betParts = participations.filter(p => p.betId === betId);
    const totalPot = bet.totalPot;
    const platformFee = totalPot * PLATFORM_FEE_PERCENT;
    const netPot = totalPot - platformFee;

    const winners = betParts.filter(p => p.optionId === winningOptionId);
    const totalWinningStake = winners.reduce((sum, p) => sum + p.amount, 0);

    // Update bet status
    setBets(prev => prev.map(b => b.id === betId ? { ...b, status: BetStatus.RESOLVED } : b));

    // Distribute Winnings
    // In a real app, we'd loop through all winners. Here we just update the current user if they won.
    // However, to keep stats consistent, we should update all mock users in memory.
    
    const newUsers = { ...users };
    const newTransactions = [...transactions];

    winners.forEach(winner => {
      const share = (winner.amount / totalWinningStake) * netPot;
      
      if (newUsers[winner.userId]) {
         newUsers[winner.userId] = {
           ...newUsers[winner.userId],
           balance: newUsers[winner.userId].balance + share
         };
      }

      if (winner.userId === CURRENT_USER_ID) {
        newTransactions.unshift({
          id: `payout_${Date.now()}_${winner.userId}`,
          userId: winner.userId,
          amount: share,
          type: 'PAYOUT',
          description: `Win: ${bet.title}`,
          timestamp: new Date().toISOString()
        });
      }
    });

    setUsers(newUsers);
    setTransactions(newTransactions);
  };

  const sendMessage = (groupId: string, text: string) => {
    const newMsg: Message = {
      id: `m${Date.now()}`,
      groupId,
      userId: CURRENT_USER_ID,
      text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMsg]);
  };

  return (
    <AppContext.Provider value={{ currentUser, users, groups, bets, messages, participations, transactions, placeBet, createBet, createGroup, sendMessage, resolveBet, addFunds }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppStore must be used within AppProvider");
  return context;
};