// ========================================
// Génération de 20 équipes festival
// + 100 membres réalistes
// ========================================

// ---------- Teams ----------

db = db.getSiblingDB('radiolog'); 

const activeEventId = db.events.findOne()._id;
const firstUserId = db.users.findOne()._id;

const teamIds = {};

const teamNames = [
  "Accueil Festival",
  "Billetterie",
  "Sécurité Terrain",
  "Scène Principale",
  "Scène Secondaire",
  "Régie Technique",
  "Son",
  "Lumières",
  "Backstage",
  "Loges Artistes",
  "Bars",
  "Food Trucks",
  "Gestion Cashless",
  "Nettoyage Site",
  "Camping Festivalier",
  "Navettes Staff",
  "Prévention & Secours",
  "Communication",
  "Photo & Vidéo",
  "Production Générale"
];

// Génération des IDs
teamNames.forEach((teamName) => {
  teamIds[teamName] = ObjectId();
});

// 10 équipes avec parentTeamId
const parentRelations = {
  "Scène Principale": "Production Générale",
  "Scène Secondaire": "Production Générale",
  "Son": "Régie Technique",
  "Lumières": "Régie Technique",
  "Loges Artistes": "Backstage",
  "Bars": "Accueil Festival",
  "Food Trucks": "Accueil Festival",
  "Gestion Cashless": "Billetterie",
  "Photo & Vidéo": "Communication",
  "Navettes Staff": "Production Générale"
};

// Insertion teams
db.teams.insertMany(
  teamNames.map((teamName, index) => {
    const team = {
      _id: teamIds[teamName],
      eventId: activeEventId,
      canalId: db.canals.findOne({ number: ((index % 5) + 1) })._id,
      name: teamName,
      description: `Equipe ${teamName} du festival`,
      teamLeaders: [firstUserId],
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
      createdById: firstUserId,
      updatedById: firstUserId
    };

    if (parentRelations[teamName]) {
      team.parentTeamId = teamIds[parentRelations[teamName]];
    }

    return team;
  })
);

print("20 équipes festival créées");

// ---------- Members ----------
const firstNames = [
  "Loris", "Maé", "Nolan", "Elena", "Julia",
  "Bastien", "Nora", "Mathéo", "Liam", "Alya",
  "Camélia", "Ethan", "Léonie", "Rayan", "Mila",
  "Kylian", "Soline", "Naël", "Amélie", "Loïc"
];

const lastNames = [
  "Bianchi", "Mercier", "Rossier", "Jordan",
  "Muller", "Rochat", "Aubert", "Gilliéron",
  "Keller", "Zimmermann", "Michaud", "Perrin",
  "Weber", "Brodard", "Gygax"
];

const festivalRoles = [
  "Bénévole",
  "Responsable zone",
  "Runner",
  "Coordinateur",
  "Technicien",
  "Agent sécurité",
  "Accueil artistes",
  "Responsable bar",
  "Staff logistique",
  "Assistant régie"
];

const streets = [
  "Rue des Concerts",
  "Chemin du Festival",
  "Route de la Scène",
  "Avenue des Artistes",
  "Rue du Live",
  "Chemin des Bénévoles"
];

const swissCities = [
  "Genève",
  "Lancy",
  "Carouge",
  "Meyrin",
  "Nyon",
  "Lausanne"
];

const teamIdArray = Object.values(teamIds);

const members = [];

for (let i = 1; i <= 100; i++) {

  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[i % lastNames.length];

  const member = {
    teamId: (() => {
      // shuffle simple
      const shuffled = [...teamIdArray].sort(() => Math.random() - 0.5);
    
      // 1 ou 2 équipes aléatoirement
      const count = Math.random() < 0.5 ? 1 : 2;
    
      return shuffled.slice(0, count);
    })(),

    name: `${firstName} ${lastName}`,

    surnames: [
      `${firstName.toLowerCase()}${i}`,
      `staff${i}`
    ],

    email: [
      `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@plwfestival.ch`
    ],

    phone: [
      `+41 79 ${String(100 + i).padStart(3, "0")} ${String(10 + (i % 90)).padStart(2, "0")} ${String(20 + (i % 70)).padStart(2, "0")}`
    ],

    roleTitles: [
      festivalRoles[i % festivalRoles.length]
    ],

    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    createdById: firstUserId,
    updatedById: firstUserId
  };

  // Adresse pour la moitié des membres
  if (i % 2 === 0) {
    member.address = {
      line1: `${20 + i} ${streets[i % streets.length]}`,
      line2: `Bâtiment ${Math.ceil(i / 10)}`,
      postalCode: `${1200 + (i % 40)}`,
      city: swissCities[i % swissCities.length],
      country: "Suisse"
    };
  }

  members.push(member);
}

db.members.insertMany(members);

print("100 membres festival créés");