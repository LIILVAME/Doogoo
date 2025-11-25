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
          <router-link to="/pricing" class="hover:text-white transition-colors">Tarifs</router-link>
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

    <!-- Content -->
    <div class="pt-24 pb-16 max-w-4xl mx-auto px-6">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-4xl md:text-5xl font-semibold text-white mb-4">Politique de confidentialité</h1>
        <p class="text-zinc-400">Dernière mise à jour : 25 novembre 2024</p>
      </div>

      <!-- Table of Contents -->
      <div class="glass-panel rounded-xl p-6 mb-12">
        <h2 class="text-lg font-medium text-white mb-4">Sommaire</h2>
        <nav class="space-y-2 text-sm">
          <a href="#introduction" class="block text-zinc-400 hover:text-white transition-colors">1. Introduction</a>
          <a href="#data-collected" class="block text-zinc-400 hover:text-white transition-colors">2. Données collectées</a>
          <a href="#data-usage" class="block text-zinc-400 hover:text-white transition-colors">3. Utilisation des données</a>
          <a href="#legal-basis" class="block text-zinc-400 hover:text-white transition-colors">4. Base légale du traitement</a>
          <a href="#data-sharing" class="block text-zinc-400 hover:text-white transition-colors">5. Partage des données</a>
          <a href="#data-retention" class="block text-zinc-400 hover:text-white transition-colors">6. Conservation des données</a>
          <a href="#your-rights" class="block text-zinc-400 hover:text-white transition-colors">7. Vos droits</a>
          <a href="#security" class="block text-zinc-400 hover:text-white transition-colors">8. Sécurité</a>
          <a href="#international-transfers" class="block text-zinc-400 hover:text-white transition-colors">9. Transferts internationaux</a>
          <a href="#cookies" class="block text-zinc-400 hover:text-white transition-colors">10. Cookies</a>
          <a href="#children" class="block text-zinc-400 hover:text-white transition-colors">11. Protection des mineurs</a>
          <a href="#changes" class="block text-zinc-400 hover:text-white transition-colors">12. Modifications</a>
          <a href="#contact" class="block text-zinc-400 hover:text-white transition-colors">13. Contact</a>
        </nav>
      </div>

      <!-- Content Sections -->
      <div class="prose prose-invert max-w-none space-y-12">
        <!-- Introduction -->
        <section id="introduction">
          <h2 class="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <p>
              Doogoo Inc. ("nous", "notre", "nos") s'engage à protéger et respecter votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos données personnelles lorsque vous utilisez notre plateforme de gestion immobilière Doogoo (le "Service").
            </p>
            <p>
              En utilisant notre Service, vous acceptez la collecte et l'utilisation de vos informations conformément à cette politique. Si vous n'acceptez pas cette politique, veuillez ne pas utiliser notre Service.
            </p>
            <p class="font-medium text-white">
              Responsable du traitement des données :<br>
              Doogoo Inc.<br>
              Email : privacy@doogoo.app
            </p>
          </div>
        </section>

        <!-- Data Collected -->
        <section id="data-collected">
          <h2 class="text-2xl font-semibold text-white mb-4">2. Données collectées</h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <h3 class="text-xl font-medium text-white mt-6 mb-3">2.1 Données que vous nous fournissez</h3>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li><strong class="text-white">Informations de compte :</strong> nom, prénom, adresse email, mot de passe (chiffré)</li>
              <li><strong class="text-white">Informations de profil :</strong> photo de profil, préférences de langue et devise</li>
              <li><strong class="text-white">Données immobilières :</strong> informations sur vos biens (adresse, loyer, photos), locataires (nom, coordonnées, dates de bail), paiements</li>
              <li><strong class="text-white">Communications :</strong> messages envoyés via notre support client</li>
            </ul>

            <h3 class="text-xl font-medium text-white mt-6 mb-3">2.2 Données collectées automatiquement</h3>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li><strong class="text-white">Données techniques :</strong> adresse IP, type de navigateur, système d'exploitation, identifiant de l'appareil</li>
              <li><strong class="text-white">Données d'utilisation :</strong> pages visitées, fonctionnalités utilisées, durée des sessions</li>
              <li><strong class="text-white">Cookies et technologies similaires :</strong> voir section 10</li>
            </ul>
          </div>
        </section>

        <!-- Data Usage -->
        <section id="data-usage">
          <h2 class="text-2xl font-semibold text-white mb-4">3. Utilisation des données</h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <p>Nous utilisons vos données personnelles pour :</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Fournir et maintenir notre Service</li>
              <li>Gérer votre compte et vos préférences</li>
              <li>Traiter vos transactions et gérer vos abonnements</li>
              <li>Vous envoyer des notifications importantes (alertes de paiement, mises à jour du Service)</li>
              <li>Améliorer notre Service et développer de nouvelles fonctionnalités</li>
              <li>Assurer la sécurité et prévenir la fraude</li>
              <li>Respecter nos obligations légales</li>
              <li>Vous envoyer des communications marketing (avec votre consentement)</li>
            </ul>
          </div>
        </section>

        <!-- Legal Basis -->
        <section id="legal-basis">
          <h2 class="text-2xl font-semibold text-white mb-4">4. Base légale du traitement (RGPD)</h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <p>Conformément au RGPD, nous traitons vos données personnelles sur les bases légales suivantes :</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li><strong class="text-white">Exécution du contrat :</strong> pour fournir le Service que vous avez demandé</li>
              <li><strong class="text-white">Intérêt légitime :</strong> pour améliorer notre Service, assurer la sécurité, et prévenir la fraude</li>
              <li><strong class="text-white">Consentement :</strong> pour les communications marketing et certains cookies</li>
              <li><strong class="text-white">Obligation légale :</strong> pour respecter les lois applicables (comptabilité, fiscalité)</li>
            </ul>
          </div>
        </section>

        <!-- Data Sharing -->
        <section id="data-sharing">
          <h2 class="text-2xl font-semibold text-white mb-4">5. Partage des données</h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <p>Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos données avec :</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li><strong class="text-white">Prestataires de services :</strong> Supabase (hébergement et base de données), Vercel (hébergement web), fournisseurs d'analytics</li>
              <li><strong class="text-white">Autorités légales :</strong> si requis par la loi ou pour protéger nos droits</li>
              <li><strong class="text-white">En cas de fusion ou acquisition :</strong> vos données peuvent être transférées au nouvel propriétaire</li>
            </ul>
            <p>
              Tous nos prestataires sont contractuellement tenus de protéger vos données et de les utiliser uniquement pour les fins spécifiées.
            </p>
          </div>
        </section>

        <!-- Data Retention -->
        <section id="data-retention">
          <h2 class="text-2xl font-semibold text-white mb-4">6. Conservation des données</h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <p>Nous conservons vos données personnelles aussi longtemps que nécessaire pour :</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Fournir le Service (tant que votre compte est actif)</li>
              <li>Respecter nos obligations légales (ex: conservation comptable de 10 ans)</li>
              <li>Résoudre des litiges et faire respecter nos accords</li>
            </ul>
            <p>
              Après la suppression de votre compte, vos données sont supprimées dans un délai de 30 jours, sauf obligation légale de conservation plus longue.
            </p>
          </div>
        </section>

        <!-- Your Rights -->
        <section id="your-rights">
          <h2 class="text-2xl font-semibold text-white mb-4">7. Vos droits (RGPD)</h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li><strong class="text-white">Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
              <li><strong class="text-white">Droit de rectification :</strong> corriger des données inexactes ou incomplètes</li>
              <li><strong class="text-white">Droit à l'effacement :</strong> demander la suppression de vos données</li>
              <li><strong class="text-white">Droit à la limitation :</strong> restreindre le traitement de vos données</li>
              <li><strong class="text-white">Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
              <li><strong class="text-white">Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
              <li><strong class="text-white">Droit de retirer votre consentement :</strong> à tout moment</li>
            </ul>
            <p>
              Pour exercer ces droits, contactez-nous à <a href="mailto:privacy@doogoo.app" class="text-violet-400 hover:text-violet-300">privacy@doogoo.app</a>. Nous répondrons dans un délai de 30 jours.
            </p>
            <p>
              Vous avez également le droit de déposer une plainte auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) si vous estimez que vos droits ne sont pas respectés.
            </p>
          </div>
        </section>

        <!-- Security -->
        <section id="security">
          <h2 class="text-2xl font-semibold text-white mb-4">8. Sécurité</h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <p>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données :</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Chiffrement des données en transit (HTTPS/TLS) et au repos</li>
              <li>Authentification sécurisée avec hachage des mots de passe (bcrypt)</li>
              <li>Contrôles d'accès stricts et principe du moindre privilège</li>
              <li>Sauvegardes régulières et plan de reprise d'activité</li>
              <li>Surveillance et détection des incidents de sécurité</li>
              <li>Audits de sécurité réguliers</li>
            </ul>
            <p>
              Cependant, aucune méthode de transmission sur Internet n'est totalement sécurisée. Nous ne pouvons garantir une sécurité absolue.
            </p>
          </div>
        </section>

        <!-- International Transfers -->
        <section id="international-transfers">
          <h2 class="text-2xl font-semibold text-white mb-4">9. Transferts internationaux</h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <p>
              Vos données sont principalement stockées sur des serveurs situés dans l'Union Européenne (via Supabase). Certains de nos prestataires peuvent être situés en dehors de l'UE.
            </p>
            <p>
              Dans ce cas, nous nous assurons que des garanties appropriées sont en place (clauses contractuelles types de la Commission Européenne, Privacy Shield, etc.) pour protéger vos données conformément au RGPD.
            </p>
          </div>
        </section>

        <!-- Cookies -->
        <section id="cookies">
          <h2 class="text-2xl font-semibold text-white mb-4">10. Cookies et technologies similaires</h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <p>Nous utilisons des cookies et technologies similaires pour :</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li><strong class="text-white">Cookies essentiels :</strong> nécessaires au fonctionnement du Service (session, authentification)</li>
              <li><strong class="text-white">Cookies de performance :</strong> pour analyser l'utilisation et améliorer le Service</li>
              <li><strong class="text-white">Cookies de préférences :</strong> pour mémoriser vos choix (langue, devise)</li>
            </ul>
            <p>
              Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur. Notez que désactiver certains cookies peut affecter le fonctionnement du Service.
            </p>
          </div>
        </section>

        <!-- Children -->
        <section id="children">
          <h2 class="text-2xl font-semibold text-white mb-4">11. Protection des mineurs</h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <p>
              Notre Service n'est pas destiné aux personnes de moins de 18 ans. Nous ne collectons pas sciemment de données personnelles auprès de mineurs. Si vous êtes parent ou tuteur et que vous pensez que votre enfant nous a fourni des données personnelles, contactez-nous pour que nous puissions les supprimer.
            </p>
          </div>
        </section>

        <!-- Changes -->
        <section id="changes">
          <h2 class="text-2xl font-semibold text-white mb-4">12. Modifications de cette politique</h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <p>
              Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous informerons de tout changement significatif par email ou via une notification dans le Service. La date de "Dernière mise à jour" en haut de cette page indique quand la politique a été modifiée pour la dernière fois.
            </p>
            <p>
              Nous vous encourageons à consulter régulièrement cette politique pour rester informé de la manière dont nous protégeons vos données.
            </p>
          </div>
        </section>

        <!-- Contact -->
        <section id="contact">
          <h2 class="text-2xl font-semibold text-white mb-4">13. Nous contacter</h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <p>Pour toute question concernant cette politique de confidentialité ou vos données personnelles, contactez-nous :</p>
            <div class="glass-panel rounded-xl p-6 mt-4">
              <p class="font-medium text-white mb-2">Doogoo Inc.</p>
              <p>Email : <a href="mailto:privacy@doogoo.app" class="text-violet-400 hover:text-violet-300">privacy@doogoo.app</a></p>
              <p>Support : <a href="mailto:support@doogoo.app" class="text-violet-400 hover:text-violet-300">support@doogoo.app</a></p>
            </div>
          </div>
        </section>
      </div>

      <!-- Back to top -->
      <div class="mt-16 text-center">
        <a href="#" class="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-2">
          <ArrowUp class="w-4 h-4" />
          Retour en haut
        </a>
      </div>
    </div>

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
import { ArrowUp } from 'lucide-vue-next'
</script>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.prose {
  color: #d4d4d8;
}

.prose h2 {
  scroll-margin-top: 6rem;
}

.prose h3 {
  scroll-margin-top: 6rem;
}
</style>
