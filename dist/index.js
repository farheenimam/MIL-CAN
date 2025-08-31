var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  badges: () => badges,
  badgesRelations: () => badgesRelations,
  content: () => content,
  contentRelations: () => contentRelations,
  events: () => events,
  eventsRelations: () => eventsRelations,
  insertBadgeSchema: () => insertBadgeSchema,
  insertContentSchema: () => insertContentSchema,
  insertEventSchema: () => insertEventSchema,
  insertReviewSchema: () => insertReviewSchema,
  insertUserSchema: () => insertUserSchema,
  reviews: () => reviews,
  sessions: () => sessions,
  statistics: () => statistics,
  userBadges: () => userBadges,
  userBadgesRelations: () => userBadgesRelations,
  userRoleEnum: () => userRoleEnum,
  users: () => users,
  usersRelations: () => usersRelations
});
import { sql, relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  integer,
  text,
  boolean,
  pgEnum
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var userRoleEnum = pgEnum("user_role", ["creator", "ambassador"]);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default("creator"),
  points: integer("points").default(0),
  institution: varchar("institution"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var content = pgTable("content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  category: varchar("category").notNull(),
  // 'fact-checking', 'digital-literacy', 'safety-ethics'
  type: varchar("type").notNull(),
  // 'post', 'video', 'reel'
  contentUrl: varchar("content_url"),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizerId: varchar("organizer_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  category: varchar("category").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  participants: integer("participants").default(0),
  status: varchar("status").default("active"),
  // 'active', 'completed', 'cancelled'
  createdAt: timestamp("created_at").defaultNow()
});
var badges = pgTable("badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  icon: varchar("icon").notNull(),
  requirement: text("requirement"),
  requiredPoints: integer("required_points").default(0),
  role: userRoleEnum("role"),
  // null means for both roles
  createdAt: timestamp("created_at").defaultNow()
});
var userBadges = pgTable("user_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  badgeId: varchar("badge_id").notNull().references(() => badges.id),
  earnedAt: timestamp("earned_at").defaultNow()
});
var reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  role: varchar("role").notNull(),
  content: text("content").notNull(),
  avatarUrl: varchar("avatar_url"),
  rating: integer("rating").default(5),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var statistics = pgTable("statistics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creators: integer("creators").default(0),
  ambassadors: integer("ambassadors").default(0),
  contentPieces: integer("content_pieces").default(0),
  eventsHosted: integer("events_hosted").default(0),
  updatedAt: timestamp("updated_at").defaultNow()
});
var usersRelations = relations(users, ({ many }) => ({
  content: many(content),
  events: many(events),
  userBadges: many(userBadges)
}));
var contentRelations = relations(content, ({ one }) => ({
  user: one(users, {
    fields: [content.userId],
    references: [users.id]
  })
}));
var eventsRelations = relations(events, ({ one }) => ({
  organizer: one(users, {
    fields: [events.organizerId],
    references: [users.id]
  })
}));
var badgesRelations = relations(badges, ({ many }) => ({
  userBadges: many(userBadges)
}));
var userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, {
    fields: [userBadges.userId],
    references: [users.id]
  }),
  badge: one(badges, {
    fields: [userBadges.badgeId],
    references: [badges.id]
  })
}));
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertContentSchema = createInsertSchema(content).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true
});
var insertBadgeSchema = createInsertSchema(badges).omit({
  id: true,
  createdAt: true
});
var insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, and, count, sql as sql2 } from "drizzle-orm";
var DatabaseStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    await this.updateStatistics();
    return user;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  async createContent(contentData) {
    const [newContent] = await db.insert(content).values(contentData).returning();
    await this.addPoints(contentData.userId, 10);
    await this.checkAndAwardBadges(contentData.userId);
    await this.updateStatistics();
    return newContent;
  }
  async getContentByUser(userId) {
    return await db.select().from(content).where(eq(content.userId, userId)).orderBy(desc(content.createdAt));
  }
  async updateContentStats(contentId, views, likes, comments) {
    const updates = {};
    if (views !== void 0) updates.views = views;
    if (likes !== void 0) updates.likes = likes;
    if (comments !== void 0) updates.comments = comments;
    if (Object.keys(updates).length > 0) {
      await db.update(content).set(updates).where(eq(content.id, contentId));
    }
  }
  async createEvent(eventData) {
    const [newEvent] = await db.insert(events).values(eventData).returning();
    await this.addPoints(eventData.organizerId, 25);
    await this.checkAndAwardBadges(eventData.organizerId);
    await this.updateStatistics();
    return newEvent;
  }
  async getEventsByOrganizer(organizerId) {
    return await db.select().from(events).where(eq(events.organizerId, organizerId)).orderBy(desc(events.createdAt));
  }
  async getActiveEvents() {
    return await db.select().from(events).where(eq(events.status, "active")).orderBy(desc(events.startDate));
  }
  async getBadges() {
    return await db.select().from(badges);
  }
  async getUserBadges(userId) {
    const result = await db.select({
      id: userBadges.id,
      userId: userBadges.userId,
      badgeId: userBadges.badgeId,
      earnedAt: userBadges.earnedAt,
      badge: badges
    }).from(userBadges).innerJoin(badges, eq(userBadges.badgeId, badges.id)).where(eq(userBadges.userId, userId));
    return result;
  }
  async awardBadge(userId, badgeId) {
    const [existing] = await db.select().from(userBadges).where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, badgeId)));
    if (!existing) {
      await db.insert(userBadges).values({ userId, badgeId });
    }
  }
  async checkAndAwardBadges(userId) {
    const user = await this.getUser(userId);
    if (!user) return;
    const userContent = await this.getContentByUser(userId);
    const userEvents = await this.getEventsByOrganizer(userId);
    const allBadges = await this.getBadges();
    const currentBadges = await this.getUserBadges(userId);
    const currentBadgeIds = currentBadges.map((ub) => ub.badge.id);
    for (const badge of allBadges) {
      if (currentBadgeIds.includes(badge.id)) continue;
      if (badge.role && badge.role !== user.role) continue;
      let shouldAward = false;
      switch (badge.name) {
        case "First Upload":
          shouldAward = userContent.length >= 1;
          break;
        case "Viral Content":
          shouldAward = userContent.some((c) => (c.views || 0) >= 1e3);
          break;
        case "Top Creator":
          shouldAward = userContent.length >= 50;
          break;
        case "Community Hero":
          shouldAward = userContent.reduce((sum, c) => sum + (c.likes || 0), 0) >= 100;
          break;
        case "Mentor":
          shouldAward = user.role === "ambassador" && userContent.length >= 5;
          break;
        case "Event Host":
          shouldAward = userEvents.length >= 10;
          break;
        case "Community Builder":
          shouldAward = userEvents.reduce((sum, e) => sum + (e.participants || 0), 0) >= 50;
          break;
        case "Expert":
          shouldAward = userEvents.length >= 25;
          break;
        case "Global Impact":
          shouldAward = userEvents.length >= 100;
          break;
      }
      if (shouldAward) {
        await this.awardBadge(userId, badge.id);
      }
    }
  }
  async getFeaturedReviews() {
    return await db.select().from(reviews).where(eq(reviews.featured, true)).orderBy(desc(reviews.createdAt));
  }
  async getStatistics() {
    let [stats] = await db.select().from(statistics).limit(1);
    if (!stats) {
      [stats] = await db.insert(statistics).values({
        creators: 0,
        ambassadors: 0,
        contentPieces: 0,
        eventsHosted: 0
      }).returning();
    }
    return stats;
  }
  async updateStatistics() {
    const [creatorCount] = await db.select({ count: count() }).from(users).where(eq(users.role, "creator"));
    const [ambassadorCount] = await db.select({ count: count() }).from(users).where(eq(users.role, "ambassador"));
    const [contentCount] = await db.select({ count: count() }).from(content);
    const [eventCount] = await db.select({ count: count() }).from(events);
    await db.update(statistics).set({
      creators: creatorCount.count,
      ambassadors: ambassadorCount.count,
      contentPieces: contentCount.count,
      eventsHosted: eventCount.count,
      updatedAt: /* @__PURE__ */ new Date()
    });
  }
  async addPoints(userId, points) {
    await db.update(users).set({
      points: sql2`${users.points} + ${points}`,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(users.id, userId));
  }
};
var storage = new DatabaseStorage();

// server/replitAuth.ts
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
var getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };
  for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`
      },
      verify
    );
    passport.use(strategy);
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
var isAuthenticated = async (req, res, next) => {
  const user = req.user;
  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// server/gemini.ts
var GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
async function callGeminiAPI(prompt) {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("Google Gemini API key not found");
    }
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      return data.candidates[0].content.parts[0].text || "I'm here to help with media literacy questions. Could you please rephrase your question?";
    }
    return "I'm here to help with media literacy questions. Could you please rephrase your question?";
  } catch (error) {
    console.error("Google Gemini API error:", error);
    throw error;
  }
}
async function handleAiAssistant(message) {
  try {
    const systemMessage = `You are a helpful AI assistant for MIL-CAN, a Media & Information Literacy platform. 
    You help educators, content creators, and ambassadors with:
    - Content creation strategies for media literacy education
    - Fact-checking techniques and verification methods
    - Digital literacy best practices
    - Educational resource recommendations
    - Community engagement tips
    
    Keep responses concise, helpful, and focused on media literacy education.`;
    const fullPrompt = `${systemMessage}

User question: ${message}`;
    return await callGeminiAPI(fullPrompt);
  } catch (error) {
    console.error("AI Assistant error:", error);
    return "I'm experiencing some technical difficulties. Please try again later or contact support if the issue persists.";
  }
}

// server/routes.ts
async function registerRoutes(app2) {
  await setupAuth(app2);
  app2.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.get("/api/statistics", async (req, res) => {
    try {
      const stats = await storage.getStatistics();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });
  app2.get("/api/reviews", async (req, res) => {
    try {
      const reviews2 = await storage.getFeaturedReviews();
      res.json(reviews2);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });
  app2.post("/api/content", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const contentData = insertContentSchema.parse({
        ...req.body,
        userId
      });
      const newContent = await storage.createContent(contentData);
      res.json(newContent);
    } catch (error) {
      console.error("Error creating content:", error);
      res.status(500).json({ message: "Failed to create content" });
    }
  });
  app2.get("/api/content/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const userContent = await storage.getContentByUser(userId);
      res.json(userContent);
    } catch (error) {
      console.error("Error fetching user content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });
  app2.post("/api/events", isAuthenticated, async (req, res) => {
    try {
      const organizerId = req.user.claims.sub;
      const eventData = insertEventSchema.parse({
        ...req.body,
        organizerId
      });
      const newEvent = await storage.createEvent(eventData);
      res.json(newEvent);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ message: "Failed to create event" });
    }
  });
  app2.get("/api/events/user", isAuthenticated, async (req, res) => {
    try {
      const organizerId = req.user.claims.sub;
      const userEvents = await storage.getEventsByOrganizer(organizerId);
      res.json(userEvents);
    } catch (error) {
      console.error("Error fetching user events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });
  app2.get("/api/events/active", async (req, res) => {
    try {
      const activeEvents = await storage.getActiveEvents();
      res.json(activeEvents);
    } catch (error) {
      console.error("Error fetching active events:", error);
      res.status(500).json({ message: "Failed to fetch active events" });
    }
  });
  app2.get("/api/badges", async (req, res) => {
    try {
      const badges2 = await storage.getBadges();
      res.json(badges2);
    } catch (error) {
      console.error("Error fetching badges:", error);
      res.status(500).json({ message: "Failed to fetch badges" });
    }
  });
  app2.get("/api/badges/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const userBadges2 = await storage.getUserBadges(userId);
      res.json(userBadges2);
    } catch (error) {
      console.error("Error fetching user badges:", error);
      res.status(500).json({ message: "Failed to fetch user badges" });
    }
  });
  app2.post("/api/ai/chat", async (req, res) => {
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
