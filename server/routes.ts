import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertContentSchema, insertEventSchema } from "@shared/schema";
import { handleAiAssistant } from "./gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Statistics endpoint
  app.get('/api/statistics', async (req, res) => {
    try {
      const stats = await storage.getStatistics();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Reviews endpoint
  app.get('/api/reviews', async (req, res) => {
    try {
      const reviews = await storage.getFeaturedReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Content routes
  app.post('/api/content', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const contentData = insertContentSchema.parse({
        ...req.body,
        userId,
      });
      
      const newContent = await storage.createContent(contentData);
      res.json(newContent);
    } catch (error) {
      console.error("Error creating content:", error);
      res.status(500).json({ message: "Failed to create content" });
    }
  });

  app.get('/api/content/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userContent = await storage.getContentByUser(userId);
      res.json(userContent);
    } catch (error) {
      console.error("Error fetching user content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  // Event routes
  app.post('/api/events', isAuthenticated, async (req: any, res) => {
    try {
      const organizerId = req.user.claims.sub;
      const eventData = insertEventSchema.parse({
        ...req.body,
        organizerId,
      });
      
      const newEvent = await storage.createEvent(eventData);
      res.json(newEvent);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  app.get('/api/events/user', isAuthenticated, async (req: any, res) => {
    try {
      const organizerId = req.user.claims.sub;
      const userEvents = await storage.getEventsByOrganizer(organizerId);
      res.json(userEvents);
    } catch (error) {
      console.error("Error fetching user events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get('/api/events/active', async (req, res) => {
    try {
      const activeEvents = await storage.getActiveEvents();
      res.json(activeEvents);
    } catch (error) {
      console.error("Error fetching active events:", error);
      res.status(500).json({ message: "Failed to fetch active events" });
    }
  });

  // Badge routes
  app.get('/api/badges', async (req, res) => {
    try {
      const badges = await storage.getBadges();
      res.json(badges);
    } catch (error) {
      console.error("Error fetching badges:", error);
      res.status(500).json({ message: "Failed to fetch badges" });
    }
  });

  app.get('/api/badges/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userBadges = await storage.getUserBadges(userId);
      res.json(userBadges);
    } catch (error) {
      console.error("Error fetching user badges:", error);
      res.status(500).json({ message: "Failed to fetch user badges" });
    }
  });

  // AI Assistant endpoint
  app.post('/api/ai/chat', async (req: any, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const response = await handleAiAssistant(message);
      res.json({ response });
    } catch (error) {
      console.error("Error handling AI chat:", error);
      res.status(500).json({ message: "Failed to process AI request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
