<template>
  <div
    class="min-h-screen bg-white text-zinc-50 antialiased selection:bg-violet-500/30 selection:text-violet-200"
  >
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-2">
          <span class="text-lg font-semibold tracking-tighter text-zinc-900">doogoo</span>
        </router-link>

        <div class="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          <router-link to="/features" class="hover:text-zinc-900 transition-colors"
            >Fonctionnalités</router-link
          >
          <router-link to="/pricing" class="hover:text-zinc-900 transition-colors"
            >Tarifs</router-link
          >
          <router-link to="/resources" class="text-zinc-900">Ressources</router-link>
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
            class="text-sm font-medium bg-zinc-50 text-zinc-950 px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors"
          >
            Essayer gratuitement
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 md:pt-48 md:pb-24 overflow-hidden">
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15),transparent_50%)] pointer-events-none"
      ></div>

      <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h1
          class="text-5xl md:text-6xl font-semibold tracking-tight mb-6 gradient-text leading-tight"
        >
          Ressources et documentation
        </h1>
        <p
          class="text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
        >
          Tout ce dont vous avez besoin pour maîtriser Doogoo et optimiser votre gestion
          immobilière.
        </p>
      </div>
    </section>

    <!-- Quick Start Guide -->
    <section class="py-16 max-w-6xl mx-auto px-6">
      <div class="mb-16">
        <div class="flex items-center gap-3 mb-8">
          <div
            class="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20"
          >
            <Rocket class="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 class="text-3xl font-semibold text-zinc-900">Guide de démarrage rapide</h2>
            <p class="text-zinc-500 text-sm">Commencez en quelques minutes</p>
          </div>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div class="glass-panel rounded-2xl p-6">
            <div
              class="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4 text-violet-400 font-semibold"
            >
              1
            </div>
            <h3 class="text-lg font-medium text-zinc-900 mb-2">Créez votre compte</h3>
            <p class="text-sm text-zinc-600 leading-relaxed mb-4">
              Inscrivez-vous gratuitement en moins de 2 minutes. Aucune carte bancaire requise.
            </p>
            <router-link
              to="/signup"
              class="text-sm text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
            >
              Commencer <ArrowRight class="w-3 h-3" />
            </router-link>
          </div>

          <div class="glass-panel rounded-2xl p-6">
            <div
              class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 text-blue-400 font-semibold"
            >
              2
            </div>
            <h3 class="text-lg font-medium text-zinc-900 mb-2">Ajoutez vos biens</h3>
            <p class="text-sm text-zinc-600 leading-relaxed mb-4">
              Importez vos propriétés et locataires existants en quelques clics.
            </p>
            <a
              href="#documentation"
              class="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              Voir le guide <ArrowRight class="w-3 h-3" />
            </a>
          </div>

          <div class="glass-panel rounded-2xl p-6">
            <div
              class="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-400 font-semibold"
            >
              3
            </div>
            <h3 class="text-lg font-medium text-zinc-900 mb-2">Gérez en toute simplicité</h3>
            <p class="text-sm text-zinc-600 leading-relaxed mb-4">
              Suivez vos revenus, paiements et alertes depuis votre dashboard.
            </p>
            <router-link
              to="/features"
              class="text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
            >
              Découvrir les fonctionnalités <ArrowRight class="w-3 h-3" />
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Documentation -->
    <section id="documentation" class="py-16 border-t border-zinc-200">
      <div class="max-w-6xl mx-auto px-6">
        <div class="mb-12">
          <div class="flex items-center gap-3 mb-8">
            <div
              class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20"
            >
              <BookOpen class="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 class="text-3xl font-semibold text-zinc-900">Documentation</h2>
              <p class="text-zinc-500 text-sm">Guides détaillés et bonnes pratiques</p>
            </div>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div
            class="glass-panel rounded-2xl p-8 hover:border-violet-500/30 transition-colors cursor-pointer group"
          >
            <Building2 class="w-8 h-8 text-violet-400 mb-4" />
            <h3
              class="text-xl font-medium text-zinc-900 mb-2 group-hover:text-violet-400 transition-colors"
            >
              Gestion des biens
            </h3>
            <p class="text-sm text-zinc-600 leading-relaxed mb-4">
              Comment ajouter, modifier et organiser vos propriétés. Gestion des documents et
              photos.
            </p>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li class="flex items-center gap-2">
                <ChevronRight class="w-4 h-4" />
                Ajouter un nouveau bien
              </li>
              <li class="flex items-center gap-2">
                <ChevronRight class="w-4 h-4" />
                Gérer les documents
              </li>
              <li class="flex items-center gap-2">
                <ChevronRight class="w-4 h-4" />
                Suivre l'occupation
              </li>
            </ul>
          </div>

          <div
            class="glass-panel rounded-2xl p-8 hover:border-emerald-500/30 transition-colors cursor-pointer group"
          >
            <Users class="w-8 h-8 text-emerald-400 mb-4" />
            <h3
              class="text-xl font-medium text-zinc-900 mb-2 group-hover:text-emerald-400 transition-colors"
            >
              Gestion des locataires
            </h3>
            <p class="text-sm text-zinc-600 leading-relaxed mb-4">
              Centraliser les informations, gérer les baux et communiquer efficacement.
            </p>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li class="flex items-center gap-2">
                <ChevronRight class="w-4 h-4" />
                Créer un profil locataire
              </li>
              <li class="flex items-center gap-2">
                <ChevronRight class="w-4 h-4" />
                Gérer les baux
              </li>
              <li class="flex items-center gap-2">
                <ChevronRight class="w-4 h-4" />
                Historique des paiements
              </li>
            </ul>
          </div>

          <div
            class="glass-panel rounded-2xl p-8 hover:border-blue-500/30 transition-colors cursor-pointer group"
          >
            <Wallet class="w-8 h-8 text-blue-400 mb-4" />
            <h3
              class="text-xl font-medium text-zinc-900 mb-2 group-hover:text-blue-400 transition-colors"
            >
              Suivi des paiements
            </h3>
            <p class="text-sm text-zinc-600 leading-relaxed mb-4">
              Enregistrer les loyers, gérer les retards et automatiser les relances.
            </p>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li class="flex items-center gap-2">
                <ChevronRight class="w-4 h-4" />
                Enregistrer un paiement
              </li>
              <li class="flex items-center gap-2">
                <ChevronRight class="w-4 h-4" />
                Gérer les retards
              </li>
              <li class="flex items-center gap-2">
                <ChevronRight class="w-4 h-4" />
                Configurer les alertes
              </li>
            </ul>
          </div>

          <div
            class="glass-panel rounded-2xl p-8 hover:border-rose-500/30 transition-colors cursor-pointer group"
          >
            <BarChart3 class="w-8 h-8 text-rose-400 mb-4" />
            <h3
              class="text-xl font-medium text-zinc-900 mb-2 group-hover:text-rose-400 transition-colors"
            >
              Rapports et analyses
            </h3>
            <p class="text-sm text-zinc-600 leading-relaxed mb-4">
              Générer des rapports, analyser vos performances et exporter vos données.
            </p>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li class="flex items-center gap-2">
                <ChevronRight class="w-4 h-4" />
                Générer un rapport mensuel
              </li>
              <li class="flex items-center gap-2">
                <ChevronRight class="w-4 h-4" />
                Analyser la rentabilité
              </li>
              <li class="flex items-center gap-2">
                <ChevronRight class="w-4 h-4" />
                Exporter en PDF/Excel
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Help Center -->
    <section class="py-16 border-t border-zinc-200">
      <div class="max-w-6xl mx-auto px-6">
        <div class="mb-12">
          <div class="flex items-center gap-3 mb-8">
            <div
              class="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20"
            >
              <HelpCircle class="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 class="text-3xl font-semibold text-zinc-900">Centre d'aide</h2>
              <p class="text-zinc-500 text-sm">Questions fréquentes et dépannage</p>
            </div>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="glass-panel rounded-xl p-6">
            <h3 class="text-lg font-medium text-zinc-900 mb-3">
              Comment importer mes données existantes ?
            </h3>
            <p class="text-sm text-zinc-600 leading-relaxed">
              Vous pouvez importer vos biens et locataires via un fichier CSV ou les ajouter
              manuellement un par un depuis le dashboard.
            </p>
          </div>

          <div class="glass-panel rounded-xl p-6">
            <h3 class="text-lg font-medium text-zinc-900 mb-3">
              Puis-je personnaliser les notifications ?
            </h3>
            <p class="text-sm text-zinc-600 leading-relaxed">
              Oui, accédez aux Paramètres > Notifications pour configurer les alertes selon vos
              préférences (email, push, fréquence).
            </p>
          </div>

          <div class="glass-panel rounded-xl p-6">
            <h3 class="text-lg font-medium text-zinc-900 mb-3">Comment exporter mes rapports ?</h3>
            <p class="text-sm text-zinc-600 leading-relaxed">
              Dans la section Rapports, cliquez sur "Exporter" et choisissez le format souhaité
              (PDF, CSV ou Excel).
            </p>
          </div>

          <div class="glass-panel rounded-xl p-6">
            <h3 class="text-lg font-medium text-zinc-900 mb-3">
              Mes données sont-elles sauvegardées ?
            </h3>
            <p class="text-sm text-zinc-600 leading-relaxed">
              Oui, toutes vos données sont automatiquement sauvegardées en temps réel et stockées de
              manière sécurisée dans le cloud.
            </p>
          </div>

          <div class="glass-panel rounded-xl p-6">
            <h3 class="text-lg font-medium text-zinc-900 mb-3">Comment contacter le support ?</h3>
            <p class="text-sm text-zinc-600 leading-relaxed">
              Utilisez le chat en bas à droite de l'écran ou envoyez-nous un email à
              support@doogoo.app. Réponse sous 24h.
            </p>
          </div>

          <div class="glass-panel rounded-xl p-6">
            <h3 class="text-lg font-medium text-zinc-900 mb-3">
              Puis-je utiliser Doogoo sur mobile ?
            </h3>
            <p class="text-sm text-zinc-600 leading-relaxed">
              Oui, Doogoo est entièrement responsive et fonctionne parfaitement sur smartphone et
              tablette via votre navigateur.
            </p>
          </div>
        </div>

        <div class="mt-12 text-center">
          <p class="text-zinc-600 mb-4">Vous ne trouvez pas la réponse à votre question ?</p>
          <a
            href="mailto:support@doogoo.app?subject=Support%20Doogoo"
            class="h-12 px-8 rounded-full bg-white text-zinc-950 font-medium hover:bg-zinc-200 transition-colors inline-flex items-center gap-2"
          >
            <MessageCircle class="w-4 h-4" />
            Contacter le support
          </a>
        </div>
      </div>
    </section>

    <!-- Legal Resources -->
    <section class="py-16 border-t border-zinc-200">
      <div class="max-w-6xl mx-auto px-6">
        <div class="mb-12">
          <div class="flex items-center gap-3 mb-8">
            <div
              class="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20"
            >
              <Scale class="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <h2 class="text-3xl font-semibold text-zinc-900">Ressources juridiques</h2>
              <p class="text-zinc-500 text-sm">Informations légales pour les propriétaires</p>
            </div>
          </div>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div class="glass-panel rounded-xl p-6">
            <FileText class="w-8 h-8 text-blue-400 mb-4" />
            <h3 class="text-lg font-medium text-zinc-900 mb-2">Droits du bailleur</h3>
            <p class="text-sm text-zinc-600 leading-relaxed mb-4">
              Comprendre vos droits et obligations en tant que propriétaire bailleur en France.
            </p>
            <a
              href="#"
              class="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              En savoir plus <ArrowRight class="w-3 h-3" />
            </a>
          </div>

          <div class="glass-panel rounded-xl p-6">
            <Shield class="w-8 h-8 text-emerald-400 mb-4" />
            <h3 class="text-lg font-medium text-zinc-900 mb-2">Modèles de documents</h3>
            <p class="text-sm text-zinc-600 leading-relaxed mb-4">
              Téléchargez des modèles de baux, états des lieux et quittances conformes.
            </p>
            <a
              href="#"
              class="text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
            >
              Accéder aux modèles <ArrowRight class="w-3 h-3" />
            </a>
          </div>

          <div class="glass-panel rounded-xl p-6">
            <BookOpen class="w-8 h-8 text-violet-400 mb-4" />
            <h3 class="text-lg font-medium text-zinc-900 mb-2">Guides fiscaux</h3>
            <p class="text-sm text-zinc-600 leading-relaxed mb-4">
              Optimisez votre fiscalité immobilière avec nos guides pratiques et conseils.
            </p>
            <a
              href="#"
              class="text-sm text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
            >
              Consulter les guides <ArrowRight class="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="py-24 border-t border-zinc-200">
      <div class="max-w-2xl mx-auto px-6 text-center">
        <Mail class="w-12 h-12 text-violet-400 mx-auto mb-6" />
        <h2 class="text-3xl font-semibold text-zinc-900 mb-4">Restez informé</h2>
        <p class="text-zinc-600 mb-8">
          Recevez nos derniers guides, conseils et mises à jour directement dans votre boîte mail.
        </p>
        <form class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="votre@email.com"
            class="flex-1 h-12 px-4 rounded-xl bg-white/5 border border-zinc-200 text-zinc-900 placeholder-zinc-500 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
          />
          <button
            type="submit"
            class="h-12 px-6 rounded-xl bg-white text-zinc-950 font-medium hover:bg-zinc-200 transition-colors whitespace-nowrap"
          >
            S'abonner
          </button>
        </form>
        <p class="text-xs text-zinc-600 mt-4">Pas de spam. Désabonnement en un clic.</p>
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
  Rocket,
  BookOpen,
  Building2,
  Users,
  Wallet,
  BarChart3,
  HelpCircle,
  Scale,
  FileText,
  Shield,
  Mail,
  MessageCircle,
  ArrowRight,
  ChevronRight
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
