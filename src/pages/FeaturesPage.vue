<template>
  <div
    class="min-h-screen bg-white text-zinc-900 antialiased selection:bg-violet-500/30 selection:text-violet-700"
  >
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-2">
          <span class="text-lg font-semibold tracking-tighter text-zinc-900">doogoo</span>
        </router-link>

        <div class="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          <router-link to="/features" class="text-zinc-900 font-semibold"
            >Fonctionnalités</router-link
          >
          <router-link to="/pricing" class="hover:text-zinc-900 transition-colors"
            >Tarifs</router-link
          >
          <router-link to="/resources" class="hover:text-zinc-900 transition-colors"
            >Ressources</router-link
          >
        </div>

        <div class="flex items-center gap-4">
          <router-link
            to="/login"
            class="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors hidden sm:block"
          >
            Se connecter
          </router-link>
          <router-link
            to="/signup"
            class="text-sm font-medium bg-violet-600 text-zinc-900 px-4 py-2 rounded-full hover:bg-violet-700 transition-colors"
          >
            Essayer gratuitement
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.08),transparent_50%)] pointer-events-none"
      ></div>

      <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h1
          class="text-5xl md:text-6xl font-semibold tracking-tight mb-6 gradient-text leading-tight"
        >
          Toutes les fonctionnalités<br />pour gérer vos biens
        </h1>
        <p
          class="text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
        >
          Une suite complète d'outils professionnels conçue pour simplifier la gestion immobilière
          au quotidien.
        </p>
      </div>
    </section>

    <!-- Feature Categories -->
    <section class="py-16 max-w-6xl mx-auto px-6">
      <!-- Property Management -->
      <div class="mb-32">
        <div class="flex items-center gap-3 mb-8">
          <div
            class="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20"
          >
            <Building2 class="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h2 class="text-3xl font-semibold text-zinc-900">Gestion Multi-biens</h2>
            <p class="text-zinc-500 text-sm">Centralisez tous vos biens en un seul endroit</p>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="glass-panel rounded-2xl p-8">
            <Home class="w-8 h-8 text-emerald-400 mb-4" />
            <h3 class="text-xl font-medium text-zinc-900 mb-3">Profils détaillés</h3>
            <p class="text-zinc-600 leading-relaxed mb-4">
              Créez des fiches complètes pour chaque bien : appartements, maisons, parkings, locaux
              commerciaux. Ajoutez photos, documents et informations clés.
            </p>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-emerald-400" />
                Photos et documents illimités
              </li>
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-emerald-400" />
                Historique complet des modifications
              </li>
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-emerald-400" />
                Géolocalisation automatique
              </li>
            </ul>
          </div>

          <div class="glass-panel rounded-2xl p-8">
            <BarChart3 class="w-8 h-8 text-blue-400 mb-4" />
            <h3 class="text-xl font-medium text-zinc-900 mb-3">Suivi en temps réel</h3>
            <p class="text-zinc-600 leading-relaxed mb-4">
              Visualisez instantanément l'état de votre portefeuille : taux d'occupation, revenus
              mensuels, biens disponibles.
            </p>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-blue-400" />
                Dashboard avec KPIs en direct
              </li>
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-blue-400" />
                Graphiques d'évolution
              </li>
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-blue-400" />
                Alertes personnalisables
              </li>
            </ul>
          </div>

          <div class="glass-panel rounded-2xl p-8">
            <MapPin class="w-8 h-8 text-rose-400 mb-4" />
            <h3 class="text-xl font-medium text-zinc-900 mb-3">Organisation intelligente</h3>
            <p class="text-zinc-600 leading-relaxed mb-4">
              Filtrez et triez vos biens par ville, statut, type ou loyer. Retrouvez n'importe
              quelle information en quelques secondes.
            </p>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-rose-400" />
                Recherche instantanée
              </li>
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-rose-400" />
                Filtres multiples
              </li>
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-rose-400" />
                Vues personnalisées
              </li>
            </ul>
          </div>

          <div class="glass-panel rounded-2xl p-8">
            <FileText class="w-8 h-8 text-amber-400 mb-4" />
            <h3 class="text-xl font-medium text-zinc-900 mb-3">Gestion documentaire</h3>
            <p class="text-zinc-600 leading-relaxed mb-4">
              Stockez tous vos documents importants de manière sécurisée : baux, diagnostics,
              assurances, factures.
            </p>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-amber-400" />
                Stockage cloud sécurisé
              </li>
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-amber-400" />
                Accès depuis n'importe où
              </li>
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-amber-400" />
                Partage sécurisé
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Tenant Management -->
      <div class="mb-32">
        <div class="flex items-center gap-3 mb-8">
          <div
            class="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20"
          >
            <Users class="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 class="text-3xl font-semibold text-zinc-900">Gestion Locataires</h2>
            <p class="text-zinc-500 text-sm">
              Centralisez toutes les informations de vos locataires
            </p>
          </div>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div class="glass-panel rounded-2xl p-8">
            <UserCheck class="w-8 h-8 text-emerald-400 mb-4" />
            <h3 class="text-xl font-medium text-zinc-900 mb-3">Profils complets</h3>
            <p class="text-zinc-600 leading-relaxed">
              Coordonnées, historique de paiements, documents du bail, tout au même endroit.
            </p>
          </div>

          <div class="glass-panel rounded-2xl p-8">
            <Calendar class="w-8 h-8 text-blue-400 mb-4" />
            <h3 class="text-xl font-medium text-zinc-900 mb-3">Suivi des baux</h3>
            <p class="text-zinc-600 leading-relaxed">
              Dates d'entrée et de sortie, renouvellements, préavis - ne ratez plus aucune échéance.
            </p>
          </div>

          <div class="glass-panel rounded-2xl p-8">
            <MessageSquare class="w-8 h-8 text-violet-400 mb-4" />
            <h3 class="text-xl font-medium text-zinc-900 mb-3">Communication</h3>
            <p class="text-zinc-600 leading-relaxed">
              Historique des échanges, relances automatiques, notifications personnalisées.
            </p>
          </div>
        </div>
      </div>

      <!-- Payment Tracking -->
      <div class="mb-32">
        <div class="flex items-center gap-3 mb-8">
          <div
            class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20"
          >
            <Wallet class="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 class="text-3xl font-semibold text-zinc-900">Suivi des Paiements</h2>
            <p class="text-zinc-500 text-sm">Ne perdez plus jamais un loyer</p>
          </div>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="glass-panel rounded-2xl p-6">
            <div
              class="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3"
            >
              <CheckCircle class="w-5 h-5 text-emerald-400" />
            </div>
            <h3 class="text-lg font-medium text-zinc-900 mb-2">Paiements reçus</h3>
            <p class="text-sm text-zinc-600">Enregistrez et suivez tous les paiements effectués</p>
          </div>

          <div class="glass-panel rounded-2xl p-6">
            <div class="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3">
              <Clock class="w-5 h-5 text-amber-400" />
            </div>
            <h3 class="text-lg font-medium text-zinc-900 mb-2">En attente</h3>
            <p class="text-sm text-zinc-600">Visualisez les paiements à venir ce mois</p>
          </div>

          <div class="glass-panel rounded-2xl p-6">
            <div class="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center mb-3">
              <AlertCircle class="w-5 h-5 text-rose-400" />
            </div>
            <h3 class="text-lg font-medium text-zinc-900 mb-2">Retards</h3>
            <p class="text-sm text-zinc-600">Alertes automatiques pour les paiements en retard</p>
          </div>

          <div class="glass-panel rounded-2xl p-6">
            <div
              class="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mb-3"
            >
              <TrendingUp class="w-5 h-5 text-violet-400" />
            </div>
            <h3 class="text-lg font-medium text-zinc-900 mb-2">Historique</h3>
            <p class="text-sm text-zinc-600">Accès complet à l'historique des transactions</p>
          </div>
        </div>
      </div>

      <!-- Analytics & Reporting -->
      <div class="mb-32">
        <div class="flex items-center gap-3 mb-8">
          <div
            class="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20"
          >
            <LineChart class="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <h2 class="text-3xl font-semibold text-zinc-900">Analyses & Rapports</h2>
            <p class="text-zinc-500 text-sm">
              Prenez des décisions éclairées avec des données précises
            </p>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="glass-panel rounded-2xl p-8">
            <h3 class="text-xl font-medium text-zinc-900 mb-4">Tableaux de bord interactifs</h3>
            <p class="text-zinc-600 mb-6 leading-relaxed">
              Visualisez vos performances en temps réel avec des graphiques clairs et des KPIs
              pertinents.
            </p>
            <div class="space-y-3">
              <div
                class="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-zinc-200"
              >
                <span class="text-sm text-zinc-300">Revenus mensuels</span>
                <TrendingUp class="w-4 h-4 text-emerald-400" />
              </div>
              <div
                class="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-zinc-200"
              >
                <span class="text-sm text-zinc-300">Taux d'occupation</span>
                <TrendingUp class="w-4 h-4 text-blue-400" />
              </div>
              <div
                class="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-zinc-200"
              >
                <span class="text-sm text-zinc-300">Rentabilité par bien</span>
                <TrendingUp class="w-4 h-4 text-violet-400" />
              </div>
            </div>
          </div>

          <div class="glass-panel rounded-2xl p-8">
            <h3 class="text-xl font-medium text-zinc-900 mb-4">Export comptable</h3>
            <p class="text-zinc-600 mb-6 leading-relaxed">
              Exportez vos données en un clic pour votre comptable ou votre déclaration fiscale.
            </p>
            <div class="flex flex-wrap gap-3 mb-6">
              <span
                class="px-3 py-1.5 rounded-lg bg-white/5 border border-zinc-200 text-sm text-zinc-300 flex items-center gap-2"
              >
                <FileText class="w-4 h-4" /> PDF
              </span>
              <span
                class="px-3 py-1.5 rounded-lg bg-white/5 border border-zinc-200 text-sm text-zinc-300 flex items-center gap-2"
              >
                <FileText class="w-4 h-4" /> CSV
              </span>
              <span
                class="px-3 py-1.5 rounded-lg bg-white/5 border border-zinc-200 text-sm text-zinc-300 flex items-center gap-2"
              >
                <FileText class="w-4 h-4" /> Excel
              </span>
            </div>
            <p class="text-xs text-zinc-500">
              Formats compatibles avec tous les logiciels comptables
            </p>
          </div>
        </div>
      </div>

      <!-- Alerts & Notifications -->
      <div class="mb-20">
        <div class="flex items-center gap-3 mb-8">
          <div
            class="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20"
          >
            <Bell class="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 class="text-3xl font-semibold text-zinc-900">Alertes & Notifications</h2>
            <p class="text-zinc-500 text-sm">Restez informé en temps réel</p>
          </div>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div class="glass-panel rounded-2xl p-6">
            <AlertTriangle class="w-8 h-8 text-rose-400 mb-4" />
            <h3 class="text-lg font-medium text-zinc-900 mb-2">Retards de paiement</h3>
            <p class="text-sm text-zinc-600">
              Notification immédiate dès qu'un loyer est en retard
            </p>
          </div>

          <div class="glass-panel rounded-2xl p-6">
            <Calendar class="w-8 h-8 text-blue-400 mb-4" />
            <h3 class="text-lg font-medium text-zinc-900 mb-2">Échéances de bail</h3>
            <p class="text-sm text-zinc-600">Rappels automatiques pour les renouvellements</p>
          </div>

          <div class="glass-panel rounded-2xl p-6">
            <TrendingUp class="w-8 h-8 text-emerald-400 mb-4" />
            <h3 class="text-lg font-medium text-zinc-900 mb-2">Objectifs atteints</h3>
            <p class="text-sm text-zinc-600">
              Célébrez vos succès avec des notifications positives
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-32 relative overflow-hidden border-t border-zinc-200">
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.15),transparent_50%)]"
      ></div>

      <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 class="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 mb-6">
          Prêt à simplifier votre gestion ?
        </h2>
        <p class="text-zinc-600 text-lg mb-10 font-light">
          Rejoignez les propriétaires qui ont choisi Doogoo pour gérer leurs biens.
        </p>
        <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
          <router-link
            to="/signup"
            class="h-12 px-8 rounded-full bg-white text-zinc-950 font-medium hover:bg-zinc-200 transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
          >
            Commencer gratuitement
            <ArrowRight class="w-4 h-4" />
          </router-link>
          <router-link
            to="/pricing"
            class="h-12 px-8 rounded-full border border-zinc-200 bg-white/5 hover:bg-white/10 text-zinc-900 font-medium transition-colors w-full sm:w-auto"
          >
            Voir les tarifs
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-zinc-200 bg-white pt-16 pb-8">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div class="col-span-2 md:col-span-1">
            <router-link to="/" class="text-lg font-semibold tracking-tighter text-zinc-900"
              >doogoo</router-link
            >
            <p class="text-zinc-500 text-sm mt-4 font-light">
              L'outil de gestion locative nouvelle génération pour les propriétaires exigeants.
            </p>
          </div>
          <div>
            <h4 class="text-zinc-900 text-sm font-medium mb-4">Produit</h4>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li>
                <router-link to="/features" class="hover:text-zinc-900 transition-colors"
                  >Fonctionnalités</router-link
                >
              </li>
              <li>
                <router-link to="/pricing" class="hover:text-zinc-900 transition-colors"
                  >Tarifs</router-link
                >
              </li>
              <li>
                <router-link to="/coming-soon" class="hover:text-zinc-900 transition-colors"
                  >Mises à jour</router-link
                >
              </li>
            </ul>
          </div>
          <div>
            <h4 class="text-zinc-900 text-sm font-medium mb-4">Ressources</h4>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li>
                <router-link to="/coming-soon" class="hover:text-zinc-900 transition-colors"
                  >Blog</router-link
                >
              </li>
              <li>
                <router-link to="/coming-soon" class="hover:text-zinc-900 transition-colors"
                  >Guide du bailleur</router-link
                >
              </li>
              <li>
                <router-link to="/resources" class="hover:text-zinc-900 transition-colors"
                  >Centre d'aide</router-link
                >
              </li>
            </ul>
          </div>
          <div>
            <h4 class="text-zinc-900 text-sm font-medium mb-4">Légal</h4>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li>
                <router-link to="/privacy" class="hover:text-zinc-900 transition-colors"
                  >Confidentialité</router-link
                >
              </li>
              <li>
                <router-link to="/terms" class="hover:text-zinc-900 transition-colors"
                  >CGU</router-link
                >
              </li>
            </ul>
          </div>
        </div>
        <div
          class="border-t border-zinc-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p class="text-xs text-zinc-600">© 2024 Doogoo Inc. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import {
  Building2,
  Home,
  BarChart3,
  MapPin,
  FileText,
  Users,
  UserCheck,
  Calendar,
  MessageSquare,
  Wallet,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  LineChart,
  Bell,
  AlertTriangle,
  Check,
  ArrowRight
} from 'lucide-vue-next'
</script>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(228, 228, 231, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.gradient-text {
  background: linear-gradient(to right, #18181b, #52525b);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
