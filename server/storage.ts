import {
  users,
  content,
  events,
  badges,
  userBadges,
  reviews,
  statistics,
  type User,
  type UpsertUser,
  type Content,
  type InsertContent,
  type Event,
  type InsertEvent,
  type Badge,
  type UserBadge,
  type Review,
  type Statistics,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  
  // Content operations
  createContent(content: InsertContent): Promise<Content>;
  getContentByUser(userId: string): Promise<Content[]>;
  updateContentStats(contentId: string, views?: number, likes?: number, comments?: number): Promise<void>;
  
  // Event operations
  createEvent(event: InsertEvent): Promise<Event>;
  getEventsByOrganizer(organizerId: string): Promise<Event[]>;
  getActiveEvents(): Promise<Event[]>;
  
  // Badge operations
  getBadges(): Promise<Badge[]>;
  getUserBadges(userId: string): Promise<(UserBadge & { badge: Badge })[]>;
  awardBadge(userId: string, badgeId: string): Promise<void>;
  checkAndAwardBadges(userId: string): Promise<void>;
  
  // Review operations
  getFeaturedReviews(): Promise<Review[]>;
  
  // Statistics operations
  getStatistics(): Promise<Statistics>;
  updateStatistics(): Promise<void>;
  
  // Points operations
  addPoints(userId: string, points: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    
    // Update statistics after user creation
    await this.updateStatistics();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createContent(contentData: InsertContent): Promise<Content> {
    const [newContent] = await db
      .insert(content)
      .values(contentData)
      .returning();
    
    // Award points for content creation
    await this.addPoints(contentData.userId, 10);
    await this.checkAndAwardBadges(contentData.userId);
    await this.updateStatistics();
    
    return newContent;
  }

  async getContentByUser(userId: string): Promise<Content[]> {
    return await db
      .select()
      .from(content)
      .where(eq(content.userId, userId))
      .orderBy(desc(content.createdAt));
  }

  async updateContentStats(contentId: string, views?: number, likes?: number, comments?: number): Promise<void> {
    const updates: any = {};
    if (views !== undefined) updates.views = views;
    if (likes !== undefined) updates.likes = likes;
    if (comments !== undefined) updates.comments = comments;
    
    if (Object.keys(updates).length > 0) {
      await db.update(content).set(updates).where(eq(content.id, contentId));
    }
  }

  async createEvent(eventData: InsertEvent): Promise<Event> {
    const [newEvent] = await db
      .insert(events)
      .values(eventData)
      .returning();
    
    // Award points for event creation
    await this.addPoints(eventData.organizerId, 25);
    await this.checkAndAwardBadges(eventData.organizerId);
    await this.updateStatistics();
    
    return newEvent;
  }

  async getEventsByOrganizer(organizerId: string): Promise<Event[]> {
    return await db
      .select()
      .from(events)
      .where(eq(events.organizerId, organizerId))
      .orderBy(desc(events.createdAt));
  }

  async getActiveEvents(): Promise<Event[]> {
    return await db
      .select()
      .from(events)
      .where(eq(events.status, 'active'))
      .orderBy(desc(events.startDate));
  }

  async getBadges(): Promise<Badge[]> {
    return await db.select().from(badges);
  }

  async getUserBadges(userId: string): Promise<(UserBadge & { badge: Badge })[]> {
    const result = await db
      .select({
        id: userBadges.id,
        userId: userBadges.userId,
        badgeId: userBadges.badgeId,
        earnedAt: userBadges.earnedAt,
        badge: badges
      })
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, userId));
    
    return result;
  }

  async awardBadge(userId: string, badgeId: string): Promise<void> {
    // Check if user already has this badge
    const [existing] = await db
      .select()
      .from(userBadges)
      .where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, badgeId)));
    
    if (!existing) {
      await db.insert(userBadges).values({ userId, badgeId });
    }
  }

  async checkAndAwardBadges(userId: string): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) return;

    const userContent = await this.getContentByUser(userId);
    const userEvents = await this.getEventsByOrganizer(userId);
    const allBadges = await this.getBadges();
    const currentBadges = await this.getUserBadges(userId);
    const currentBadgeIds = currentBadges.map(ub => ub.badge.id);

    // Check badge requirements
    for (const badge of allBadges) {
      if (currentBadgeIds.includes(badge.id)) continue;
      if (badge.role && badge.role !== user.role) continue;

      let shouldAward = false;

      // Check based on badge name and requirements
      switch (badge.name) {
        case 'First Upload':
          shouldAward = userContent.length >= 1;
          break;
        case 'Viral Content':
          shouldAward = userContent.some(c => (c.views || 0) >= 1000);
          break;
        case 'Top Creator':
          shouldAward = userContent.length >= 50;
          break;
        case 'Community Hero':
          shouldAward = userContent.reduce((sum, c) => sum + (c.likes || 0), 0) >= 100;
          break;
        case 'Mentor':
          shouldAward = user.role === 'ambassador' && userContent.length >= 5;
          break;
        case 'Event Host':
          shouldAward = userEvents.length >= 10;
          break;
        case 'Community Builder':
          shouldAward = userEvents.reduce((sum, e) => sum + (e.participants || 0), 0) >= 50;
          break;
        case 'Expert':
          shouldAward = userEvents.length >= 25;
          break;
        case 'Global Impact':
          shouldAward = userEvents.length >= 100;
          break;
      }

      if (shouldAward) {
        await this.awardBadge(userId, badge.id);
      }
    }
  }

  async getFeaturedReviews(): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.featured, true))
      .orderBy(desc(reviews.createdAt));
  }

  async getStatistics(): Promise<Statistics> {
    let [stats] = await db.select().from(statistics).limit(1);
    
    if (!stats) {
      // Create initial statistics
      [stats] = await db
        .insert(statistics)
        .values({
          creators: 0,
          ambassadors: 0,
          contentPieces: 0,
          eventsHosted: 0,
        })
        .returning();
    }
    
    return stats;
  }

  async updateStatistics(): Promise<void> {
    const [creatorCount] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, 'creator'));
    
    const [ambassadorCount] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, 'ambassador'));
    
    const [contentCount] = await db
      .select({ count: count() })
      .from(content);
    
    const [eventCount] = await db
      .select({ count: count() })
      .from(events);

    await db
      .update(statistics)
      .set({
        creators: creatorCount.count,
        ambassadors: ambassadorCount.count,
        contentPieces: contentCount.count,
        eventsHosted: eventCount.count,
        updatedAt: new Date(),
      });
  }

  async addPoints(userId: string, points: number): Promise<void> {
    await db
      .update(users)
      .set({
        points: sql`${users.points} + ${points}`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();
