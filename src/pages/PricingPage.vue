<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-50 antialiased selection:bg-violet-500/30 selection:text-violet-200">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-2">
          <span class="text-lg font-semibold tracking-tighter text-white">doogoo</span>
        </router-link>

        <div class="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <router-link to="/features" class="hover:text-white transition-colors">Fonctionnalités</router-link>
          <router-link to="/pricing" class="text-white">Tarifs</router-link>
          <router-link to="/resources" class="hover:text-white transition-colors">Ressources</router-link>
        </div>

        <div class="flex items-center gap-4">
          <router-link to="/login" class="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">
            Se connecter
          </router-link>
          <router-link to="/signup" class="text-sm font-medium bg-zinc-50 text-zinc-950 px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors">
            Essayer gratuitement
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 md:pt-48 md:pb-24 overflow-hidden">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15),transparent_50%)] pointer-events-none"></div>
      
      <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h1 class="text-5xl md:text-6xl font-semibold tracking-tight mb-6 gradient-text leading-tight">
          Des tarifs simples,<br>transparents et justes
        </h1>
        <p class="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
          Choisissez le plan qui correspond à vos besoins. Changez ou annulez à tout moment.
        </p>

        <!-- Billing Toggle -->
        <div class="flex items-center justify-center gap-4 mb-12">
          <button 
            @click="billingPeriod = 'monthly'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all text-sm',
              billingPeriod === 'monthly' 
                ? 'bg-white text-zinc-950' 
                : 'text-zinc-400 hover:text-white'
            ]"
          >
            Mensuel
          </button>
          <button 
            @click="billingPeriod = 'annual'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all text-sm flex items-center gap-2',
              billingPeriod === 'annual' 
                ? 'bg-white text-zinc-950' 
                : 'text-zinc-400 hover:text-white'
            ]"
          >
            Annuel
            <span class="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">-20%</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Pricing Cards -->
    <section class="pb-24 max-w-7xl mx-auto px-6">
      <div class="grid md:grid-cols-3 gap-8">
        <!-- Free Plan -->
        <div class="glass-panel rounded-2xl p-8 relative">
          <div class="mb-6">
            <h3 class="text-2xl font-semibold text-white mb-2">Gratuit</h3>
            <p class="text-zinc-400 text-sm">Pour découvrir Doogoo</p>
          </div>

          <div class="mb-8">
            <div class="flex items-baseline gap-2">
              <span class="text-5xl font-semibold text-white">0€</span>
              <span class="text-zinc-500 text-sm">/mois</span>
            </div>
          </div>

          <router-link 
            to="/signup" 
            class="w-full h-12 px-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors flex items-center justify-center mb-8"
          >
            Commencer gratuitement
          </router-link>

          <div class="space-y-4">
            <p class="text-xs font-medium text-zinc-500 uppercase tracking-wider">Inclus :</p>
            <ul class="space-y-3">
              <li class="flex items-start gap-3 text-sm text-zinc-300">
                <Check class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Jusqu'à <strong class="text-white">3 biens</strong></span>
              </li>
              <li class="flex items-start gap-3 text-sm text-zinc-300">
                <Check class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Gestion des locataires</span>
              </li>
              <li class="flex items-start gap-3 text-sm text-zinc-300">
                <Check class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Suivi des paiements</span>
              </li>
              <li class="flex items-start gap-3 text-sm text-zinc-300">
                <Check class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Alertes de retard</span>
              </li>
              <li class="flex items-start gap-3 text-sm text-zinc-300">
                <Check class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Export PDF basique</span>
              </li>
              <li class="flex items-start gap-3 text-sm text-zinc-500">
                <X class="w-5 h-5 shrink-0 mt-0.5" />
                <span>Rapports avancés</span>
              </li>
              <li class="flex items-start gap-3 text-sm text-zinc-500">
                <X class="w-5 h-5 shrink-0 mt-0.5" />
                <span>Support prioritaire</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Pro Plan (Popular) -->
        <div class="glass-panel rounded-2xl p-8 relative border-2 border-violet-500/50 shadow-2xl shadow-violet-500/20">
          <div class="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs font-medium">
            Le plus populaire
          </div>

          <div class="mb-6">
            <h3 class="text-2xl font-semibold text-white mb-2">Pro</h3>
            <p class="text-zinc-400 text-sm">Pour les propriétaires sérieux</p>
          </div>

          <div class="mb-8">
            <div class="flex items-baseline gap-2">
              <span class="text-5xl font-semibold text-white">
                {{ billingPeriod === 'monthly' ? '29€' : '23€' }}
              </span>
              <span class="text-zinc-500 text-sm">/mois</span>
            </div>
            <p v-if="billingPeriod === 'annual'" class="text-xs text-zinc-500 mt-2">
              Soit 276€/an (au lieu de 348€)
            </p>
          </div>

          <router-link 
            to="/signup" 
            class="w-full h-12 px-6 rounded-xl bg-white text-zinc-950 font-medium hover:bg-zinc-200 transition-colors flex items-center justify-center mb-8"
          >
            Commencer l'essai gratuit
          </router-link>

          <div class="space-y-4">
            <p class="text-xs font-medium text-zinc-500 uppercase tracking-wider">Tout du plan Gratuit, plus :</p>
            <ul class="space-y-3">
              <li class="flex items-start gap-3 text-sm text-zinc-300">
                <Check class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong class="text-white">Biens illimités</strong></span>
              </li>
              <li class="flex items-start gap-3 text-sm text-zinc-300">
                <Check class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Rapports mensuels détaillés</span>
              </li>
              <li class="flex items-start gap-3 text-sm text-zinc-300">
                <Check class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Export CSV & Excel</span>
              </li>
              <li class="flex items-start gap-3 text-sm text-zinc-300">
                <Check class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Graphiques d'analyse</span>
              </li>
              <li class="flex items-start gap-3 text-sm text-zinc-300">
                <Check class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Stockage documents illimité</span>
              </li>
              <li class="flex items-start gap-3 text-sm text-zinc-300">
                <Check class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Support prioritaire (24h)</span>
              </li>
              <li class="flex items-start gap-3 text-sm text-zinc-300">
                <Check class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Notifications personnalisées</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Enterprise Plan -->
        <div class="glass-panel rounded-2xl p-8 relative">
          <div class="mb-6">
            <h3 class="text-2xl font-semibold text-white mb-2">Entreprise</h3>
            <p class="text-zinc-400 text-sm">Pour les gestionnaires pros</p>
          </div>

          <div class="mb-8">
            <div class="flex items-baseline gap-2">
              <span class="text-5xl font-semibold text-white">Sur mesure</span>
            </div>
            <p class="text-xs text-zinc-500 mt-2">
              Contactez-nous pour un devis
            </p>
          </div>

          <button 
            class="w-full h-12 px-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors flex items-center justify-center mb-8"
          >
            Nous contacter
          </button>

          <div class="space-y-4">
            <p class="text-xs font-medium text-zinc-500 uppercase tracking-wider">Tout du plan Pro, plus :</p>
            <ul class="space-y-3">
              <li class="flex items-start gap-3 text-sm text-zinc-300">
                <Check class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Comptes utilisateurs multiples</span>
              </li>
              <li class="flex items-start gap-3 text-sm text-zinc-300">
                <Check class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>API d'intégration</span>
              </li>
              <li class="flex items-start gap-3 text-sm text-zinc-300">
                <Check class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Rapports personnalisés</span>
              </li>
              <li class="flex items-start gap-3 text-sm text-zinc-300">
                <Check class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Gestionnaire de compte dédié</span>
              </li>
              <li class="flex items-start gap-3 text-sm text-zinc-300">
                <Check class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Support 24/7</span>
              </li>
              <li class="flex items-start gap-3 text-sm text-zinc-300">
                <Check class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Formation personnalisée</span>
              </li>
              <li class="flex items-start gap-3 text-sm text-zinc-300">
                <Check class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>SLA garanti</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-24 border-t border-white/5">
      <div class="max-w-3xl mx-auto px-6">
        <h2 class="text-3xl font-semibold text-white text-center mb-12">Questions fréquentes</h2>
        
        <div class="space-y-6">
          <div class="glass-panel rounded-xl p-6">
            <h3 class="text-lg font-medium text-white mb-2">Puis-je changer de plan à tout moment ?</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment. Les changements prennent effet immédiatement et nous ajustons la facturation au prorata.
            </p>
          </div>

          <div class="glass-panel rounded-xl p-6">
            <h3 class="text-lg font-medium text-white mb-2">Y a-t-il une période d'essai gratuite ?</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Le plan Gratuit est disponible sans limite de temps. Pour le plan Pro, nous offrons 14 jours d'essai gratuit sans carte bancaire requise.
            </p>
          </div>

          <div class="glass-panel rounded-xl p-6">
            <h3 class="text-lg font-medium text-white mb-2">Quels moyens de paiement acceptez-vous ?</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Nous acceptons toutes les cartes bancaires (Visa, Mastercard, American Express) et les virements SEPA pour les abonnements annuels.
            </p>
          </div>

          <div class="glass-panel rounded-xl p-6">
            <h3 class="text-lg font-medium text-white mb-2">Mes données sont-elles sécurisées ?</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Absolument. Toutes vos données sont chiffrées et stockées sur des serveurs sécurisés en Europe. Nous sommes conformes au RGPD et ne vendons jamais vos données.
            </p>
          </div>

          <div class="glass-panel rounded-xl p-6">
            <h3 class="text-lg font-medium text-white mb-2">Puis-je annuler mon abonnement ?</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Oui, vous pouvez annuler à tout moment depuis vos paramètres. Aucun frais d'annulation. Vous conservez l'accès jusqu'à la fin de votre période de facturation.
            </p>
          </div>

          <div class="glass-panel rounded-xl p-6">
            <h3 class="text-lg font-medium text-white mb-2">Proposez-vous des réductions pour les associations ?</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Oui, nous offrons des tarifs préférentiels pour les associations et organismes à but non lucratif. Contactez-nous pour plus d'informations.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-32 relative overflow-hidden border-t border-white/5">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.15),transparent_50%)]"></div>
      
      <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 class="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6">
          Prêt à commencer ?
        </h2>
        <p class="text-zinc-400 text-lg mb-10 font-light">
          Essayez Doogoo gratuitement. Aucune carte bancaire requise.
        </p>
        <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
          <router-link to="/signup" class="h-12 px-8 rounded-full bg-white text-zinc-950 font-medium hover:bg-zinc-200 transition-colors w-full sm:w-auto flex items-center justify-center gap-2">
            Créer un compte gratuit
            <ArrowRight class="w-4 h-4" />
          </router-link>
          <router-link to="/features" class="h-12 px-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors w-full sm:w-auto">
            Découvrir les fonctionnalités
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-white/5 bg-zinc-950 pt-16 pb-8">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div class="col-span-2 md:col-span-1">
            <router-link to="/" class="text-lg font-semibold tracking-tighter text-white">doogoo</router-link>
            <p class="text-zinc-500 text-sm mt-4 font-light">
              L'outil de gestion locative nouvelle génération pour les propriétaires exigeants.
            </p>
          </div>
          <div>
            <h4 class="text-white text-sm font-medium mb-4">Produit</h4>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li><router-link to="/features" class="hover:text-white transition-colors">Fonctionnalités</router-link></li>
              <li><router-link to="/pricing" class="hover:text-white transition-colors">Tarifs</router-link></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white text-sm font-medium mb-4">Ressources</h4>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li><router-link to="/resources" class="hover:text-white transition-colors">Centre d'aide</router-link></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white text-sm font-medium mb-4">Légal</h4>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li><router-link to="/privacy" class="hover:text-white transition-colors">Confidentialité</router-link></li>
              <li><router-link to="/terms" class="hover:text-white transition-colors">CGU</router-link></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-xs text-zinc-600">© 2024 Doogoo Inc. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Check, X, ArrowRight } from 'lucide-vue-next'

const billingPeriod = ref('monthly')
</script>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.gradient-text {
  background: linear-gradient(to right, #ffffff, #a1a1aa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
