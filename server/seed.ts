import { db } from "./db";
import { 
  users, 
  badges, 
  reviews, 
  statistics, 
  userBadges, 
  content, 
  events 
} from "@shared/schema";

export async function seedDatabase() {
  console.log("🌱 Starting database seed...");

  try {
    // Clear existing data
    await db.delete(userBadges);
    await db.delete(content);
    await db.delete(events);
    await db.delete(reviews);
    await db.delete(badges);
    await db.delete(users);
    await db.delete(statistics);

    // Create badges
    const badgeData = [
      // Creator badges
      {
        name: '⭐ First Upload',
        description: 'Upload your first piece of content',
        icon: 'star',
        requirement: 'Upload 1 content piece',
        requiredPoints: 0,
        role: 'creator' as const,
      },
      {
        name: '🔥 Viral Content',
        description: 'Create content that reaches 1000+ views',
        icon: 'fire',
        requirement: '1K+ views on any content',
        requiredPoints: 50,
        role: 'creator' as const,
      },
      {
        name: '🏆 Top Creator',
        description: 'Upload 50 pieces of content',
        icon: 'trophy',
        requirement: '50 uploads needed',
        requiredPoints: 500,
        role: 'creator' as const,
      },
      {
        name: '👥 Community Hero',
        description: 'Receive 100 likes across all content',
        icon: 'users',
        requirement: '100 likes needed',
        requiredPoints: 100,
        role: 'creator' as const,
      },
      // Ambassador badges
      {
        name: '🤝 Mentor',
        description: 'Guide and support 5 content creators',
        icon: 'handshake',
        requirement: '5 creators guided',
        requiredPoints: 50,
        role: 'ambassador' as const,
      },
      {
        name: '📅 Event Host',
        description: 'Successfully organize 10 events',
        icon: 'calendar-alt',
        requirement: '10 events hosted',
        requiredPoints: 250,
        role: 'ambassador' as const,
      },
      {
        name: '🌍 Community Builder',
        description: 'Reach 50+ attendees across all events',
        icon: 'users',
        requirement: '50+ attendees reached',
        requiredPoints: 200,
        role: 'ambassador' as const,
      },
      {
        name: '👑 Expert',
        description: 'Host 25 successful events',
        icon: 'crown',
        requirement: '25 events needed',
        requiredPoints: 625,
        role: 'ambassador' as const,
      },
      {
        name: '🌐 Global Impact',
        description: 'Make worldwide impact with 100 events',
        icon: 'globe',
        requirement: '100 events needed',
        requiredPoints: 2500,
        role: 'ambassador' as const,
      },
    ];

    const createdBadges = await db.insert(badges).values(badgeData).returning();
    console.log(`✅ Created ${createdBadges.length} badges`);

    // Create test users
    const testUsers = [
      {
        id: 'test-creator-1',
        email: 'creator@milcan.edu',
        firstName: 'Sarah',
        lastName: 'Chen',
        profileImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b353?w=150&h=150&fit=crop&crop=face',
        role: 'creator' as const,
        points: 85,
        institution: 'Digital University',
      },
      {
        id: 'test-ambassador-1',
        email: 'ambassador@milcan.edu',
        firstName: 'Dr. Michael',
        lastName: 'Rodriguez',
        profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        role: 'ambassador' as const,
        points: 320,
        institution: 'Media Literacy Institute',
      },
      {
        id: 'test-ambassador-2',
        email: 'maria.santos@milcan.edu',
        firstName: 'Maria',
        lastName: 'Santos',
        profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        role: 'ambassador' as const,
        points: 150,
        institution: 'Community College Network',
      },
    ];

    const createdUsers = await db.insert(users).values(testUsers).returning();
    console.log(`✅ Created ${createdUsers.length} test users`);

    // Create sample content for creator
    const sampleContent = [
      {
        userId: 'test-creator-1',
        title: 'Spotting Fake News: A Beginner\'s Guide',
        description: 'Learn the essential techniques for identifying misinformation in your daily news consumption.',
        category: 'fact-checking',
        type: 'post',
        contentUrl: 'https://example.com/content/1',
        views: 1250,
        likes: 89,
        comments: 23,
      },
      {
        userId: 'test-creator-1',
        title: 'Digital Footprints and Privacy',
        description: 'Understanding how your online activity creates a digital footprint and protecting your privacy.',
        category: 'digital-literacy',
        type: 'video',
        contentUrl: 'https://example.com/content/2',
        views: 890,
        likes: 67,
        comments: 15,
      },
      {
        userId: 'test-creator-1',
        title: 'Safe Social Media Practices',
        description: 'Best practices for staying safe and maintaining privacy on social media platforms.',
        category: 'safety-ethics',
        type: 'reel',
        contentUrl: 'https://example.com/content/3',
        views: 2100,
        likes: 156,
        comments: 41,
      },
    ];

    const createdContent = await db.insert(content).values(sampleContent).returning();
    console.log(`✅ Created ${createdContent.length} sample content pieces`);

    // Create sample events for ambassadors
    const sampleEvents = [
      {
        organizerId: 'test-ambassador-1',
        title: 'Digital Literacy Week Challenge',
        description: 'Create content highlighting key dimensions of media literacy in modern education',
        category: 'digital-literacy',
        startDate: new Date('2024-12-01'),
        endDate: new Date('2024-12-07'),
        participants: 47,
        status: 'active',
      },
      {
        organizerId: 'test-ambassador-2',
        title: 'Misinformation Awareness Campaign',
        description: 'Develop educational materials about identifying misinformation',
        category: 'fact-checking',
        startDate: new Date('2024-12-10'),
        endDate: new Date('2024-12-20'),
        participants: 32,
        status: 'active',
      },
      {
        organizerId: 'test-ambassador-1',
        title: 'Youth Media Literacy Month',
        description: 'Connect specifically designed resources for younger learners',
        category: 'safety-ethics',
        startDate: new Date('2024-11-01'),
        endDate: new Date('2024-11-30'),
        participants: 68,
        status: 'completed',
      },
    ];

    const createdEvents = await db.insert(events).values(sampleEvents).returning();
    console.log(`✅ Created ${createdEvents.length} sample events`);

    // Award some badges to test users
    const firstUploadBadge = createdBadges.find(b => b.name === 'First Upload');
    const viralContentBadge = createdBadges.find(b => b.name === 'Viral Content');
    const mentorBadge = createdBadges.find(b => b.name === 'Mentor');
    const eventHostBadge = createdBadges.find(b => b.name === 'Event Host');

    const userBadgeData = [];
    
    if (firstUploadBadge) {
      userBadgeData.push({
        userId: 'test-creator-1',
        badgeId: firstUploadBadge.id,
      });
    }
    
    if (viralContentBadge) {
      userBadgeData.push({
        userId: 'test-creator-1',
        badgeId: viralContentBadge.id,
      });
    }
    
    if (mentorBadge) {
      userBadgeData.push({
        userId: 'test-ambassador-1',
        badgeId: mentorBadge.id,
      });
    }
    
    if (eventHostBadge) {
      userBadgeData.push({
        userId: 'test-ambassador-2',
        badgeId: eventHostBadge.id,
      });
    }

    if (userBadgeData.length > 0) {
      await db.insert(userBadges).values(userBadgeData);
      console.log(`✅ Awarded ${userBadgeData.length} badges to test users`);
    }

    // Create featured reviews
    const reviewData = [
      {
        name: 'Dr. Sarah Chen',
        role: 'Digital Literacy Ambassador',
        content: 'MIL-CAN transformed how I teach media literacy. The creator resources are incredible and my students are more engaged than ever.',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        rating: 5,
        featured: true,
      },
      {
        name: 'Alex Rodriguez',
        role: 'Content Creator',
        content: 'The badge system keeps me motivated and the AI assistant helps me create better educational content. Love this community!',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        rating: 5,
        featured: true,
      },
      {
        name: 'Maria Santos',
        role: 'Campus Ambassador',
        content: 'Running MIL events on campus has been amazing. The templates and resources make it so easy to engage students effectively.',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        rating: 5,
        featured: true,
      },
      {
        name: 'David Kim',
        role: 'Student Creator',
        content: 'Started as a student, now I\'m helping others identify misinformation. The point system and badges make learning fun!',
        avatarUrl: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
        rating: 5,
        featured: true,
      },
      {
        name: 'Prof. Jennifer Wong',
        role: 'Media Studies Professor',
        content: 'This platform has revolutionized how we approach media literacy education. The community support is outstanding.',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b353?w=150&h=150&fit=crop&crop=face',
        rating: 5,
        featured: true,
      },
      {
        name: 'Carlos Martinez',
        role: 'High School Teacher',
        content: 'My students love the interactive content and real-world applications. Finally, media literacy that actually engages!',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        rating: 5,
        featured: true,
      },
    ];

    const createdReviews = await db.insert(reviews).values(reviewData).returning();
    console.log(`✅ Created ${createdReviews.length} featured reviews`);

    // Create initial statistics
    const statsData = {
      creators: 1247,
      ambassadors: 368,
      contentPieces: 15420,
      eventsHosted: 892,
    };

    await db.insert(statistics).values(statsData);
    console.log(`✅ Created initial statistics`);

    console.log("🎉 Database seeding completed successfully!");
    
    // Log test user credentials
    console.log("\n📝 Test User Credentials:");
    console.log("Creator: creator@milcan.edu");
    console.log("Ambassador 1: ambassador@milcan.edu"); 
    console.log("Ambassador 2: maria.santos@milcan.edu");
    console.log("(Use Replit Auth to sign in)");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url.startsWith('file:') && process.argv[1] && import.meta.url.includes(process.argv[1])) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
