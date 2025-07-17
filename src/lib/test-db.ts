import { prisma } from './prisma';

async function testDatabase() {
  try {
    // Test 1: Création d'un utilisateur
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'John Doe',
      },
    });
    console.log('✅ Utilisateur créé:', user);

    // Test 2: Création d'un profil
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        name: 'John Doe',
        position: 'Attaquant',
        club: 'FC Test',
        competitionLevel: 'PLSQ',
        height: '180cm',
        weight: '75kg',
      },
    });
    console.log('✅ Profil créé:', profile);
    console.log('✅ Utilisateur créé:', user);

    // Test 3: Lecture des données
    const userWithProfile = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        profile: true,
      },
    });
    console.log('✅ Lecture des données complètes:', userWithProfile);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase(); 