import { prisma } from './prisma';

async function main() {
  // Test création d'un utilisateur
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      position: 'Attaquant',
      club: 'Test FC',
      competitionLevel: 'Amateur',
    },
  });

  // Test création d'un match
  const match = await prisma.match.create({
    data: {
      date: new Date(),
      opponent: 'Opponent FC',
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

  // Test création d'une recommandation
  const recommendation = await prisma.recommendation.create({
    data: {
      fromId: user.id, // Pour le test, l'utilisateur se recommande lui-même
      toId: user.id,
      content: 'Excellent joueur !',
      rating: 5,
    },
  });

  console.log('Tests réussis !');
  console.log('User:', user);
  console.log('Match:', match);
  console.log('Recommendation:', recommendation);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 