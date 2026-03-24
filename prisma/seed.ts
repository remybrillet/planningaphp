import { PrismaClient, Role, Competence, ShiftType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// 60 agents réalistes pour le service de réanimation néonatale
const AGENTS: { firstName: string; lastName: string; competence: Competence; workPercentage: number }[] = [
  // === INFIRMIÈRES (40) ===
  { firstName: 'Alice', lastName: 'MARTIN', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Laura', lastName: 'PETIT', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Emma', lastName: 'MOREAU', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Chloé', lastName: 'LEROY', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Léa', lastName: 'FOURNIER', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Manon', lastName: 'GIRARD', competence: Competence.INF, workPercentage: 80 },
  { firstName: 'Julie', lastName: 'BONNET', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Clara', lastName: 'MERCIER', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Sarah', lastName: 'LAMBERT', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Camille', lastName: 'FONTAINE', competence: Competence.INF, workPercentage: 80 },
  { firstName: 'Marie', lastName: 'ROUSSEAU', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Pauline', lastName: 'VINCENT', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Océane', lastName: 'MULLER', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Anaïs', lastName: 'LEFEBVRE', competence: Competence.INF, workPercentage: 50 },
  { firstName: 'Charlotte', lastName: 'MOREL', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Margaux', lastName: 'SIMON', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Inès', lastName: 'LAURENT', competence: Competence.INF, workPercentage: 80 },
  { firstName: 'Lucie', lastName: 'MICHEL', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Jade', lastName: 'GARCIA', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Amandine', lastName: 'DAVID', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Nathalie', lastName: 'BERTRAND', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Élodie', lastName: 'ROUX', competence: Competence.INF, workPercentage: 80 },
  { firstName: 'Audrey', lastName: 'BLANC', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Céline', lastName: 'GUERIN', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Justine', lastName: 'FAURE', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Mathilde', lastName: 'ANDRE', competence: Competence.INF, workPercentage: 50 },
  { firstName: 'Marion', lastName: 'LEFEVRE', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Estelle', lastName: 'MASSON', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Noémie', lastName: 'MARCHAND', competence: Competence.INF, workPercentage: 80 },
  { firstName: 'Mélanie', lastName: 'DUVAL', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Isabelle', lastName: 'DENIS', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Sandrine', lastName: 'LEMOINE', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Laure', lastName: 'PICARD', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Agathe', lastName: 'ROLLAND', competence: Competence.INF, workPercentage: 80 },
  { firstName: 'Virginie', lastName: 'CLEMENT', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Aurélie', lastName: 'GAUTHIER', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Béatrice', lastName: 'PERRIN', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Florence', lastName: 'HENRY', competence: Competence.INF, workPercentage: 50 },
  { firstName: 'Anne', lastName: 'CHEVALIER', competence: Competence.INF, workPercentage: 100 },
  { firstName: 'Delphine', lastName: 'RENARD', competence: Competence.INF, workPercentage: 100 },
  // === PUÉRICULTRICES (20) ===
  { firstName: 'Sophie', lastName: 'BERNARD', competence: Competence.PUERICULTRCE, workPercentage: 80 },
  { firstName: 'Camille', lastName: 'ROBERT', competence: Competence.PUERICULTRCE, workPercentage: 100 },
  { firstName: 'Émilie', lastName: 'RICHARD', competence: Competence.PUERICULTRCE, workPercentage: 100 },
  { firstName: 'Célia', lastName: 'DUMONT', competence: Competence.PUERICULTRCE, workPercentage: 100 },
  { firstName: 'Marine', lastName: 'THOMAS', competence: Competence.PUERICULTRCE, workPercentage: 80 },
  { firstName: 'Hélène', lastName: 'DUBOIS', competence: Competence.PUERICULTRCE, workPercentage: 100 },
  { firstName: 'Stéphanie', lastName: 'MOREAU', competence: Competence.PUERICULTRCE, workPercentage: 100 },
  { firstName: 'Alexandra', lastName: 'NICOLAS', competence: Competence.PUERICULTRCE, workPercentage: 100 },
  { firstName: 'Valérie', lastName: 'MATHIEU', competence: Competence.PUERICULTRCE, workPercentage: 50 },
  { firstName: 'Fanny', lastName: 'ROBIN', competence: Competence.PUERICULTRCE, workPercentage: 100 },
  { firstName: 'Caroline', lastName: 'HUBERT', competence: Competence.PUERICULTRCE, workPercentage: 100 },
  { firstName: 'Laurence', lastName: 'GARNIER', competence: Competence.PUERICULTRCE, workPercentage: 80 },
  { firstName: 'Myriam', lastName: 'CHEVALIER', competence: Competence.PUERICULTRCE, workPercentage: 100 },
  { firstName: 'Nadia', lastName: 'PARIS', competence: Competence.PUERICULTRCE, workPercentage: 100 },
  { firstName: 'Sabrina', lastName: 'ADAM', competence: Competence.PUERICULTRCE, workPercentage: 100 },
  { firstName: 'Karine', lastName: 'COLIN', competence: Competence.PUERICULTRCE, workPercentage: 80 },
  { firstName: 'Patricia', lastName: 'ARNAUD', competence: Competence.PUERICULTRCE, workPercentage: 100 },
  { firstName: 'Catherine', lastName: 'LEGRAND', competence: Competence.PUERICULTRCE, workPercentage: 100 },
  { firstName: 'Véronique', lastName: 'BARBIER', competence: Competence.PUERICULTRCE, workPercentage: 100 },
  { firstName: 'Christine', lastName: 'GIRAUD', competence: Competence.PUERICULTRCE, workPercentage: 50 },
]

async function main() {
  console.log('Seeding database...')

  // ============================================
  // SHIFT TEMPLATES
  // ============================================
  const shiftJour = await prisma.shiftTemplate.upsert({
    where: { id: 'shift-jour' },
    update: {},
    create: {
      id: 'shift-jour',
      name: 'Jour',
      type: ShiftType.JOUR,
      startTime: '07:00',
      endTime: '19:00',
      duration: 12,
      breakTime: 30,
    },
  })

  const shiftNuit = await prisma.shiftTemplate.upsert({
    where: { id: 'shift-nuit' },
    update: {},
    create: {
      id: 'shift-nuit',
      name: 'Nuit',
      type: ShiftType.NUIT,
      startTime: '19:00',
      endTime: '07:00',
      duration: 12,
      breakTime: 30,
    },
  })

  console.log('Shift templates created:', shiftJour.name, shiftNuit.name)

  // ============================================
  // ADMIN + GESTIONNAIRES
  // ============================================
  const adminPassword = await bcrypt.hash('Admin2024!', 12)
  await prisma.user.upsert({
    where: { email: 'r.brillet@ghtyvelinesnord.fr' },
    update: {},
    create: {
      email: 'r.brillet@ghtyvelinesnord.fr',
      password: adminPassword,
      firstName: 'Rémy',
      lastName: 'BRILLET',
      role: Role.ADMIN,
      competence: Competence.INF,
      workPercentage: 100,
      phone: '0619926093',
    },
  })
  console.log('Admin created: r.brillet@ghtyvelinesnord.fr')

  const gestionnairePassword = await bcrypt.hash('Gestionnaire2024!', 12)
  const gestionnaires = [
    { email: 'gestionnaire@ghtyvelinesnord.fr', firstName: 'Marie', lastName: 'DUPONT', competence: Competence.PUERICULTRCE },
    { email: 'm.lefevre@ghtyvelinesnord.fr', firstName: 'Margot', lastName: 'LEFEVRE', competence: Competence.INF },
    { email: 'n.blanc@ghtyvelinesnord.fr', firstName: 'Nathalie', lastName: 'BLANC', competence: Competence.PUERICULTRCE },
  ]

  for (const g of gestionnaires) {
    await prisma.user.upsert({
      where: { email: g.email },
      update: {},
      create: {
        ...g,
        password: gestionnairePassword,
        role: Role.GESTIONNAIRE,
        workPercentage: 100,
      },
    })
  }
  console.log(`${gestionnaires.length} gestionnaires created`)

  // ============================================
  // 60 AGENTS
  // ============================================
  const employeePassword = await bcrypt.hash('Employe2024!', 12)

  for (const agent of AGENTS) {
    const email = `${agent.firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}.${agent.lastName.toLowerCase()}@ghtyvelinesnord.fr`
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: employeePassword,
        firstName: agent.firstName,
        lastName: agent.lastName,
        role: Role.EMPLOYE,
        competence: agent.competence,
        workPercentage: agent.workPercentage,
      },
    })
  }
  console.log(`${AGENTS.length} agents created`)

  // ============================================
  // CONFIGURATIONS — Règles métier modifiables
  // ============================================
  const configs = [
    // --- Infos service ---
    { key: 'service_name', value: 'Réanimation Néonatale', label: 'Nom du service', type: 'string', category: 'general' },
    { key: 'hospital_name', value: 'CHIPS — Hôpital de Poissy', label: 'Nom de l\'établissement', type: 'string', category: 'general' },
    { key: 'planning_horizon_months', value: '3', label: 'Horizon de planification (mois)', type: 'number', category: 'general' },

    // --- Capacité du service ---
    { key: 'total_beds', value: '18', label: 'Nombre total de lits dans le service', type: 'number', category: 'capacite' },
    { key: 'default_open_beds', value: '12', label: 'Nombre de lits ouverts par défaut', type: 'number', category: 'capacite' },

    // --- Ratios agents / lits — JOUR ---
    { key: 'ratio_agent_beds_jour', value: '3', label: 'Nombre de lits par agent en jour', type: 'number', category: 'effectifs' },
    { key: 'min_staff_jour_base', value: '3', label: 'Effectif plancher en jour (même si peu de lits)', type: 'number', category: 'effectifs' },
    { key: 'max_staff_jour', value: '10', label: 'Effectif plafond en jour', type: 'number', category: 'effectifs' },
    { key: 'min_puer_jour', value: '2', label: 'Puéricultrices minimum en jour', type: 'number', category: 'effectifs' },

    // --- Ratios agents / lits — NUIT ---
    { key: 'ratio_agent_beds_nuit', value: '3', label: 'Nombre de lits par agent en nuit', type: 'number', category: 'effectifs' },
    { key: 'min_staff_nuit_base', value: '2', label: 'Effectif plancher en nuit (même si peu de lits)', type: 'number', category: 'effectifs' },
    { key: 'max_staff_nuit', value: '8', label: 'Effectif plafond en nuit', type: 'number', category: 'effectifs' },
    { key: 'min_puer_nuit', value: '1', label: 'Puéricultrices minimum en nuit', type: 'number', category: 'effectifs' },

    // --- Règles de repos ---
    { key: 'min_rest_hours', value: '11', label: 'Repos minimum entre deux gardes (heures)', type: 'number', category: 'regles' },
    { key: 'max_consecutive_shifts', value: '3', label: 'Gardes consécutives maximum', type: 'number', category: 'regles' },
    { key: 'max_consecutive_nights', value: '2', label: 'Nuits consécutives maximum', type: 'number', category: 'regles' },
    { key: 'min_rest_after_night', value: '24', label: 'Repos minimum après une nuit (heures)', type: 'number', category: 'regles' },
    { key: 'max_hours_per_week', value: '48', label: 'Heures maximum par semaine', type: 'number', category: 'regles' },
    { key: 'min_days_off_per_week', value: '2', label: 'Jours de repos minimum par semaine', type: 'number', category: 'regles' },
    { key: 'max_weekends_per_month', value: '2', label: 'Week-ends travaillés maximum par mois', type: 'number', category: 'regles' },
    { key: 'forbid_jour_after_nuit', value: 'true', label: 'Interdire un shift jour après une nuit', type: 'boolean', category: 'regles' },
    { key: 'shifts_per_month_full_time', value: '13', label: 'Nombre de gardes/mois pour un temps plein', type: 'number', category: 'regles' },

    // --- Application ---
    { key: 'app_name', value: 'PlanningAPHP', label: 'Nom de l\'application', type: 'string', category: 'application' },
    { key: 'organization_name', value: 'GHT Yvelines Nord', label: 'Nom de l\'organisation (copyright)', type: 'string', category: 'application' },
    { key: 'email_from_name', value: 'PlanningAPHP', label: 'Nom d\'expéditeur des emails', type: 'string', category: 'application' },
    { key: 'email_from_address', value: 'noreply@ghtyvelinesnord.fr', label: 'Adresse d\'expéditeur des emails', type: 'string', category: 'application' },
  ]

  for (const config of configs) {
    await prisma.configuration.upsert({
      where: { key: config.key },
      update: { value: config.value, label: config.label },
      create: config,
    })
  }
  console.log(`${configs.length} configurations created (with scheduling rules)`)

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
