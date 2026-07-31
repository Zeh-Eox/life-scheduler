-- CreateEnum
CREATE TYPE "TypeRecurrence" AS ENUM ('PRECISE', 'APPROXIMATIVE');

-- CreateEnum
CREATE TYPE "Frequence" AS ENUM ('QUOTIDIENNE', 'HEBDOMADAIRE', 'MENSUELLE', 'ANNUELLE');

-- CreateEnum
CREATE TYPE "JourSemaine" AS ENUM ('LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE');

-- CreateEnum
CREATE TYPE "UniteTemps" AS ENUM ('JOURS', 'SEMAINES', 'MOIS');

-- CreateEnum
CREATE TYPE "StatutNotification" AS ENUM ('EN_ATTENTE', 'ENVOYEE', 'ECHOUEE');

-- CreateEnum
CREATE TYPE "Plateforme" AS ENUM ('IOS', 'ANDROID');

-- CreateTable
CREATE TABLE "utilisateurs" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasseHash" TEXT NOT NULL,
    "dateInscription" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "couleur" TEXT,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utilisateurId" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evenements" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categorieId" TEXT NOT NULL,

    CONSTRAINT "evenements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recurrences" (
    "id" TEXT NOT NULL,
    "type" "TypeRecurrence" NOT NULL,
    "frequence" "Frequence",
    "jourSemaine" "JourSemaine",
    "jourMois" INTEGER,
    "heure" TEXT,
    "intervalleEstime" INTEGER,
    "uniteTemps" "UniteTemps",
    "dateDernierRappel" TIMESTAMP(3),
    "prochainRappelEstime" TIMESTAMP(3),
    "evenementId" TEXT NOT NULL,

    CONSTRAINT "recurrences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "dateEnvoiPrevue" TIMESTAMP(3) NOT NULL,
    "dateEnvoiReelle" TIMESTAMP(3),
    "statut" "StatutNotification" NOT NULL DEFAULT 'EN_ATTENTE',
    "message" TEXT,
    "evenementId" TEXT NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appareils" (
    "id" TEXT NOT NULL,
    "tokenPush" TEXT NOT NULL,
    "plateforme" "Plateforme" NOT NULL,
    "dateEnregistrement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utilisateurId" TEXT NOT NULL,

    CONSTRAINT "appareils_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_email_key" ON "utilisateurs"("email");

-- CreateIndex
CREATE INDEX "categories_utilisateurId_idx" ON "categories"("utilisateurId");

-- CreateIndex
CREATE INDEX "evenements_categorieId_idx" ON "evenements"("categorieId");

-- CreateIndex
CREATE UNIQUE INDEX "recurrences_evenementId_key" ON "recurrences"("evenementId");

-- CreateIndex
CREATE INDEX "notifications_evenementId_idx" ON "notifications"("evenementId");

-- CreateIndex
CREATE INDEX "notifications_dateEnvoiPrevue_idx" ON "notifications"("dateEnvoiPrevue");

-- CreateIndex
CREATE UNIQUE INDEX "appareils_tokenPush_key" ON "appareils"("tokenPush");

-- CreateIndex
CREATE INDEX "appareils_utilisateurId_idx" ON "appareils"("utilisateurId");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evenements" ADD CONSTRAINT "evenements_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurrences" ADD CONSTRAINT "recurrences_evenementId_fkey" FOREIGN KEY ("evenementId") REFERENCES "evenements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_evenementId_fkey" FOREIGN KEY ("evenementId") REFERENCES "evenements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appareils" ADD CONSTRAINT "appareils_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
