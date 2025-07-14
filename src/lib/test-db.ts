import { prisma } from './prisma';

async function testDatabase() {
  try {
    // Test 1: Création d'un utilisateur
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'John Doe',
        position: 'Attaquant',
        club: 'FC Test',
        competitionLevel: 'PLSQ',
        height: 180,
        weight: 75,
      },
    });
    console.log('✅ Utilisateur créé:', user);

    // Test 2: Création d'un match
    const match = await prisma.match.create({
      data: {
        date: new Date(),
        opponent: 'FC Opponent',
        playerId: user.id,
        matchNumber: 1,
        stats: {
          indexP: 85,
          minutes: 90,
          goals: 1,
          assists: 2,
          shots: {
            total: 5,
            onTarget: 3,
          },
          passes: {
            total: 50,
            successful: 45,
            keyPasses: 3,
          },
          duels: {
            ground: {
              total: 10,
              won: 7,
            },
            aerial: {
              total: 5,
              won: 3,
            },
          },
          tackles: {
            total: 4,
            successful: 3,
          },
        },
      },
    });
    console.log('✅ Match créé:', match);

    // Test 3: Création d'une recommandation
    const recommendation = await prisma.recommendation.create({
      data: {
        fromId: user.id,
        toId: user.id,
        content: 'Excellent joueur avec un bon sens du but',
        rating: 5,
      },
    });
    console.log('✅ Recommandation créée:', recommendation);

    // Test 4: Lecture des données
    const userWithRelations = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        matches: true,
        receivedRecommendations: true,
      },
    });
    console.log('✅ Lecture des données complètes:', userWithRelations);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase(); 