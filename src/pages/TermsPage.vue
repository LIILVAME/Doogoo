<template>
  <div
    class="min-h-screen bg-zinc-950 text-zinc-50 antialiased selection:bg-violet-500/30 selection:text-violet-200"
  >
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-2">
          <span class="text-lg font-semibold tracking-tighter text-white">doogoo</span>
        </router-link>

        <div class="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <router-link to="/features" class="hover:text-white transition-colors"
            >Fonctionnalités</router-link
          >
          <router-link to="/pricing" class="hover:text-white transition-colors">Tarifs</router-link>
          <router-link to="/resources" class="hover:text-white transition-colors"
            >Ressources</router-link
          >
        </div>

        <div class="flex items-center gap-4">
          <router-link
            to="/login"
            class="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block"
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

    <!-- Content -->
    <div class="pt-24 pb-16 max-w-4xl mx-auto px-6">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-4xl md:text-5xl font-semibold text-white mb-4">
          Conditions Générales d'Utilisation
        </h1>
        <p class="text-zinc-400">Dernière mise à jour : 25 novembre 2024</p>
      </div>

      <!-- Table of Contents -->
      <div class="glass-panel rounded-xl p-6 mb-12">
        <h2 class="text-lg font-medium text-white mb-4">Sommaire</h2>
        <nav class="space-y-2 text-sm">
          <a href="#acceptance" class="block text-zinc-400 hover:text-white transition-colors"
            >1. Acceptation des conditions</a
          >
          <a
            href="#service-description"
            class="block text-zinc-400 hover:text-white transition-colors"
            >2. Description du service</a
          >
          <a href="#account" class="block text-zinc-400 hover:text-white transition-colors"
            >3. Compte utilisateur</a
          >
          <a href="#subscription" class="block text-zinc-400 hover:text-white transition-colors"
            >4. Abonnement et paiement</a
          >
          <a
            href="#user-responsibilities"
            class="block text-zinc-400 hover:text-white transition-colors"
            >5. Responsabilités de l'utilisateur</a
          >
          <a
            href="#intellectual-property"
            class="block text-zinc-400 hover:text-white transition-colors"
            >6. Propriété intellectuelle</a
          >
          <a href="#data-ownership" class="block text-zinc-400 hover:text-white transition-colors"
            >7. Propriété des données</a
          >
          <a
            href="#service-availability"
            class="block text-zinc-400 hover:text-white transition-colors"
            >8. Disponibilité du service</a
          >
          <a href="#liability" class="block text-zinc-400 hover:text-white transition-colors"
            >9. Limitation de responsabilité</a
          >
          <a href="#indemnification" class="block text-zinc-400 hover:text-white transition-colors"
            >10. Indemnisation</a
          >
          <a href="#termination" class="block text-zinc-400 hover:text-white transition-colors"
            >11. Résiliation</a
          >
          <a
            href="#dispute-resolution"
            class="block text-zinc-400 hover:text-white transition-colors"
            >12. Résolution des litiges</a
          >
          <a href="#modifications" class="block text-zinc-400 hover:text-white transition-colors"
            >13. Modifications des CGU</a
          >
          <a href="#contact" class="block text-zinc-400 hover:text-white transition-colors"
            >14. Contact</a
          >
        </nav>
      </div>

      <!-- Content Sections -->
      <div class="prose prose-invert max-w-none space-y-12">
        <!-- Acceptance -->
        <section id="acceptance">
          <h2 class="text-2xl font-semibold text-white mb-4">1. Acceptation des conditions</h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <p>
              En accédant et en utilisant la plateforme Doogoo (le "Service"), vous acceptez d'être
              lié par les présentes Conditions Générales d'Utilisation ("CGU"). Si vous n'acceptez
              pas ces conditions, veuillez ne pas utiliser le Service.
            </p>
            <p>
              Ces CGU constituent un accord juridiquement contraignant entre vous ("Utilisateur",
              "vous", "votre") et Doogoo Inc. ("Doogoo", "nous", "notre", "nos").
            </p>
            <p>
              L'utilisation du Service est également régie par notre
              <router-link to="/privacy" class="text-violet-400 hover:text-violet-300"
                >Politique de confidentialité</router-link
              >, que vous acceptez en utilisant le Service.
            </p>
          </div>
        </section>

        <!-- Service Description -->
        <section id="service-description">
          <h2 class="text-2xl font-semibold text-white mb-4">2. Description du service</h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <p>
              Doogoo est une plateforme SaaS (Software as a Service) de gestion immobilière qui
              permet aux propriétaires de gérer leurs biens, locataires, paiements et documents en
              ligne.
            </p>
            <p>Le Service comprend notamment :</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>La gestion de portefeuilles immobiliers</li>
              <li>Le suivi des locataires et des baux</li>
              <li>Le suivi des paiements et des loyers</li>
              <li>La génération de rapports et d'analyses</li>
              <li>Le stockage sécurisé de documents</li>
              <li>Les alertes et notifications automatiques</li>
            </ul>
            <p>
              Nous nous réservons le droit de modifier, suspendre ou interrompre tout ou partie du
              Service à tout moment, avec ou sans préavis.
            </p>
          </div>
        </section>

        <!-- Account -->
        <section id="account">
          <h2 class="text-2xl font-semibold text-white mb-4">3. Compte utilisateur</h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <h3 class="text-xl font-medium text-white mt-6 mb-3">3.1 Création de compte</h3>
            <p>
              Pour utiliser le Service, vous devez créer un compte en fournissant des informations
              exactes, complètes et à jour. Vous êtes responsable de la confidentialité de vos
              identifiants de connexion.
            </p>

            <h3 class="text-xl font-medium text-white mt-6 mb-3">3.2 Éligibilité</h3>
            <p>
              Vous devez avoir au moins 18 ans pour utiliser le Service. En créant un compte, vous
              déclarez et garantissez que vous avez l'âge légal requis.
            </p>

            <h3 class="text-xl font-medium text-white mt-6 mb-3">3.3 Sécurité du compte</h3>
            <p>
              Vous êtes responsable de toutes les activités effectuées sous votre compte. Vous devez
              immédiatement nous informer de toute utilisation non autorisée de votre compte.
            </p>

            <h3 class="text-xl font-medium text-white mt-6 mb-3">3.4 Un compte par utilisateur</h3>
            <p>
              Vous ne pouvez créer qu'un seul compte. La création de comptes multiples pour
              contourner les limitations du Service est interdite.
            </p>
          </div>
        </section>

        <!-- Subscription -->
        <section id="subscription">
          <h2 class="text-2xl font-semibold text-white mb-4">4. Abonnement et paiement</h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <h3 class="text-xl font-medium text-white mt-6 mb-3">4.1 Plans d'abonnement</h3>
            <p>
              Doogoo propose différents plans d'abonnement (Gratuit, Pro, Entreprise) avec des
              fonctionnalités et limitations variables. Les détails sont disponibles sur notre
              <router-link to="/pricing" class="text-violet-400 hover:text-violet-300"
                >page Tarifs</router-link
              >.
            </p>

            <h3 class="text-xl font-medium text-white mt-6 mb-3">4.2 Facturation</h3>
            <p>
              Les abonnements payants sont facturés mensuellement ou annuellement, selon votre
              choix. Le paiement est prélevé automatiquement au début de chaque période de
              facturation.
            </p>

            <h3 class="text-xl font-medium text-white mt-6 mb-3">4.3 Modifications tarifaires</h3>
            <p>
              Nous nous réservons le droit de modifier nos tarifs à tout moment. Les modifications
              tarifaires prendront effet au début de votre prochaine période de facturation. Nous
              vous informerons au moins 30 jours à l'avance de toute augmentation de prix.
            </p>

            <h3 class="text-xl font-medium text-white mt-6 mb-3">4.4 Remboursements</h3>
            <p>
              Les paiements sont non remboursables, sauf disposition légale contraire ou décision de
              Doogoo à sa seule discrétion. Aucun remboursement ne sera accordé pour les périodes
              d'abonnement partiellement utilisées.
            </p>

            <h3 class="text-xl font-medium text-white mt-6 mb-3">4.5 Essai gratuit</h3>
            <p>
              Nous pouvons offrir des périodes d'essai gratuites pour certains plans. À la fin de la
              période d'essai, votre abonnement sera automatiquement converti en abonnement payant,
              sauf annulation avant la fin de l'essai.
            </p>

            <h3 class="text-xl font-medium text-white mt-6 mb-3">4.6 Taxes</h3>
            <p>
              Les prix affichés sont hors taxes. Les taxes applicables (TVA, etc.) seront ajoutées
              au montant facturé selon votre localisation.
            </p>
          </div>
        </section>

        <!-- User Responsibilities -->
        <section id="user-responsibilities">
          <h2 class="text-2xl font-semibold text-white mb-4">
            5. Responsabilités de l'utilisateur
          </h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <h3 class="text-xl font-medium text-white mt-6 mb-3">5.1 Utilisation acceptable</h3>
            <p>Vous vous engagez à :</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Utiliser le Service conformément aux lois et réglementations applicables</li>
              <li>Fournir des informations exactes et à jour</li>
              <li>Respecter les droits de propriété intellectuelle de Doogoo et des tiers</li>
              <li>Ne pas perturber ou interférer avec le Service</li>
              <li>Ne pas tenter d'accéder de manière non autorisée au Service</li>
            </ul>

            <h3 class="text-xl font-medium text-white mt-6 mb-3">5.2 Utilisations interdites</h3>
            <p>Il est strictement interdit de :</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Utiliser le Service à des fins illégales ou frauduleuses</li>
              <li>Télécharger ou transmettre des virus, malwares ou codes malveillants</li>
              <li>Collecter des données d'autres utilisateurs sans leur consentement</li>
              <li>Usurper l'identité d'une autre personne ou entité</li>
              <li>Vendre, louer ou transférer votre compte à un tiers</li>
              <li>
                Utiliser des robots, scrapers ou autres moyens automatisés pour accéder au Service
              </li>
              <li>
                Tenter de décompiler, désassembler ou faire de l'ingénierie inverse du Service
              </li>
            </ul>

            <h3 class="text-xl font-medium text-white mt-6 mb-3">5.3 Contenu utilisateur</h3>
            <p>
              Vous êtes seul responsable du contenu que vous téléchargez, publiez ou partagez via le
              Service (photos, documents, informations sur les biens et locataires, etc.). Vous
              garantissez que vous disposez de tous les droits nécessaires sur ce contenu.
            </p>
          </div>
        </section>

        <!-- Intellectual Property -->
        <section id="intellectual-property">
          <h2 class="text-2xl font-semibold text-white mb-4">6. Propriété intellectuelle</h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <p>
              Le Service, y compris son code source, son design, ses logos, ses marques et tout
              autre contenu fourni par Doogoo, est protégé par les lois sur la propriété
              intellectuelle et appartient exclusivement à Doogoo Inc. ou à ses concédants de
              licence.
            </p>
            <p>
              Nous vous accordons une licence limitée, non exclusive, non transférable et révocable
              pour utiliser le Service conformément aux présentes CGU. Cette licence ne vous confère
              aucun droit de propriété sur le Service.
            </p>
            <p>
              Toute utilisation non autorisée du Service ou de son contenu constitue une violation
              de nos droits de propriété intellectuelle et peut entraîner des poursuites
              judiciaires.
            </p>
          </div>
        </section>

        <!-- Data Ownership -->
        <section id="data-ownership">
          <h2 class="text-2xl font-semibold text-white mb-4">7. Propriété des données</h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <p>
              Vous conservez tous les droits de propriété sur les données que vous saisissez dans le
              Service (informations sur vos biens, locataires, paiements, documents, etc.).
            </p>
            <p>
              En utilisant le Service, vous nous accordez une licence mondiale, non exclusive et
              gratuite pour héberger, stocker, traiter et afficher vos données uniquement dans le
              but de vous fournir le Service.
            </p>
            <p>
              Nous nous engageons à ne jamais vendre vos données à des tiers. Consultez notre
              <router-link to="/privacy" class="text-violet-400 hover:text-violet-300"
                >Politique de confidentialité</router-link
              >
              pour plus de détails sur l'utilisation de vos données.
            </p>

            <h3 class="text-xl font-medium text-white mt-6 mb-3">7.1 Sauvegarde de vos données</h3>
            <p>
              Bien que nous effectuions des sauvegardes régulières, vous êtes responsable de
              maintenir vos propres copies de sauvegarde de vos données. Nous vous recommandons
              d'exporter régulièrement vos données.
            </p>
          </div>
        </section>

        <!-- Service Availability -->
        <section id="service-availability">
          <h2 class="text-2xl font-semibold text-white mb-4">8. Disponibilité du service</h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <p>
              Nous nous efforçons de maintenir le Service disponible 24h/24 et 7j/7, mais nous ne
              garantissons pas une disponibilité ininterrompue. Le Service peut être temporairement
              indisponible en raison de :
            </p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Maintenance planifiée ou d'urgence</li>
              <li>Pannes techniques ou problèmes d'infrastructure</li>
              <li>Événements hors de notre contrôle (force majeure)</li>
            </ul>
            <p>
              Nous nous efforcerons de vous informer à l'avance des maintenances planifiées et de
              minimiser les interruptions de service.
            </p>
          </div>
        </section>

        <!-- Liability -->
        <section id="liability">
          <h2 class="text-2xl font-semibold text-white mb-4">9. Limitation de responsabilité</h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <p>
              LE SERVICE EST FOURNI "TEL QUEL" ET "SELON DISPONIBILITÉ", SANS GARANTIE D'AUCUNE
              SORTE, EXPRESSE OU IMPLICITE.
            </p>
            <p>
              DANS LES LIMITES AUTORISÉES PAR LA LOI, DOOGOO NE SERA PAS RESPONSABLE DES DOMMAGES
              INDIRECTS, ACCESSOIRES, SPÉCIAUX, CONSÉCUTIFS OU PUNITIFS, Y COMPRIS MAIS SANS S'Y
              LIMITER :
            </p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Perte de profits, de revenus ou de données</li>
              <li>Interruption d'activité</li>
              <li>Perte de clientèle ou d'opportunités commerciales</li>
            </ul>
            <p>
              EN TOUT ÉTAT DE CAUSE, LA RESPONSABILITÉ TOTALE DE DOOGOO ENVERS VOUS NE DÉPASSERA PAS
              LE MONTANT TOTAL DES FRAIS QUE VOUS AVEZ PAYÉS À DOOGOO AU COURS DES 12 DERNIERS MOIS.
            </p>
            <p class="text-sm text-zinc-400">
              Note : Certaines juridictions ne permettent pas l'exclusion ou la limitation de
              certaines garanties ou responsabilités. Dans ce cas, les limitations ci-dessus peuvent
              ne pas s'appliquer à vous.
            </p>
          </div>
        </section>

        <!-- Indemnification -->
        <section id="indemnification">
          <h2 class="text-2xl font-semibold text-white mb-4">10. Indemnisation</h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <p>
              Vous acceptez d'indemniser, de défendre et de dégager de toute responsabilité Doogoo,
              ses dirigeants, employés et partenaires contre toute réclamation, perte,
              responsabilité, dommage, coût ou dépense (y compris les honoraires d'avocat
              raisonnables) découlant de :
            </p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Votre utilisation du Service</li>
              <li>Votre violation des présentes CGU</li>
              <li>Votre violation des droits d'un tiers</li>
              <li>Votre contenu utilisateur</li>
            </ul>
          </div>
        </section>

        <!-- Termination -->
        <section id="termination">
          <h2 class="text-2xl font-semibold text-white mb-4">11. Résiliation</h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <h3 class="text-xl font-medium text-white mt-6 mb-3">11.1 Par l'utilisateur</h3>
            <p>
              Vous pouvez résilier votre compte à tout moment depuis les paramètres de votre compte.
              La résiliation prendra effet à la fin de votre période de facturation en cours. Aucun
              remboursement ne sera accordé pour la période restante.
            </p>

            <h3 class="text-xl font-medium text-white mt-6 mb-3">11.2 Par Doogoo</h3>
            <p>
              Nous nous réservons le droit de suspendre ou de résilier votre compte immédiatement,
              sans préavis ni responsabilité, si :
            </p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Vous violez les présentes CGU</li>
              <li>
                Votre utilisation du Service présente un risque pour Doogoo ou d'autres utilisateurs
              </li>
              <li>Vous ne payez pas les frais dus</li>
              <li>Nous sommes tenus de le faire par la loi</li>
            </ul>

            <h3 class="text-xl font-medium text-white mt-6 mb-3">11.3 Effets de la résiliation</h3>
            <p>Après la résiliation de votre compte :</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Votre accès au Service sera immédiatement révoqué</li>
              <li>
                Vos données seront supprimées dans un délai de 30 jours (sauf obligation légale de
                conservation)
              </li>
              <li>Nous vous recommandons d'exporter vos données avant de résilier votre compte</li>
            </ul>
          </div>
        </section>

        <!-- Dispute Resolution -->
        <section id="dispute-resolution">
          <h2 class="text-2xl font-semibold text-white mb-4">12. Résolution des litiges</h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <h3 class="text-xl font-medium text-white mt-6 mb-3">12.1 Droit applicable</h3>
            <p>
              Les présentes CGU sont régies et interprétées conformément au droit français, sans
              égard aux principes de conflits de lois.
            </p>

            <h3 class="text-xl font-medium text-white mt-6 mb-3">12.2 Résolution amiable</h3>
            <p>
              En cas de litige, nous vous encourageons à nous contacter d'abord à
              <a href="mailto:support@doogoo.app" class="text-violet-400 hover:text-violet-300"
                >support@doogoo.app</a
              >
              pour tenter de résoudre le différend à l'amiable.
            </p>

            <h3 class="text-xl font-medium text-white mt-6 mb-3">12.3 Juridiction compétente</h3>
            <p>
              En cas d'échec de la résolution amiable, tout litige sera soumis à la compétence
              exclusive des tribunaux de Paris, France.
            </p>

            <h3 class="text-xl font-medium text-white mt-6 mb-3">12.4 Médiation (consommateurs)</h3>
            <p>
              Conformément à la législation européenne, les consommateurs ont le droit de recourir à
              un médiateur de la consommation en cas de litige. Vous pouvez contacter la plateforme
              européenne de règlement des litiges en ligne :
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                class="text-violet-400 hover:text-violet-300"
                >https://ec.europa.eu/consumers/odr</a
              >
            </p>
          </div>
        </section>

        <!-- Modifications -->
        <section id="modifications">
          <h2 class="text-2xl font-semibold text-white mb-4">13. Modifications des CGU</h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <p>
              Nous nous réservons le droit de modifier les présentes CGU à tout moment. En cas de
              modification significative, nous vous informerons par email ou via une notification
              dans le Service au moins 30 jours avant l'entrée en vigueur des modifications.
            </p>
            <p>
              Votre utilisation continue du Service après l'entrée en vigueur des modifications
              constitue votre acceptation des nouvelles CGU. Si vous n'acceptez pas les
              modifications, vous devez cesser d'utiliser le Service et résilier votre compte.
            </p>
            <p>
              La date de "Dernière mise à jour" en haut de cette page indique quand les CGU ont été
              modifiées pour la dernière fois.
            </p>
          </div>
        </section>

        <!-- Contact -->
        <section id="contact">
          <h2 class="text-2xl font-semibold text-white mb-4">14. Nous contacter</h2>
          <div class="text-zinc-300 leading-relaxed space-y-4">
            <p>Pour toute question concernant ces CGU, contactez-nous :</p>
            <div class="glass-panel rounded-xl p-6 mt-4">
              <p class="font-medium text-white mb-2">Doogoo Inc.</p>
              <p>
                Email :
                <a href="mailto:legal@doogoo.app" class="text-violet-400 hover:text-violet-300"
                  >legal@doogoo.app</a
                >
              </p>
              <p>
                Support :
                <a href="mailto:support@doogoo.app" class="text-violet-400 hover:text-violet-300"
                  >support@doogoo.app</a
                >
              </p>
            </div>
          </div>
        </section>
      </div>

      <!-- Back to top -->
      <div class="mt-16 text-center">
        <a
          href="#"
          class="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-2"
        >
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
            <router-link to="/" class="text-lg font-semibold tracking-tighter text-white"
              >doogoo</router-link
            >
            <p class="text-zinc-500 text-sm mt-4 font-light">
              L'outil de gestion locative nouvelle génération pour les propriétaires exigeants.
            </p>
          </div>
          <div>
            <h4 class="text-white text-sm font-medium mb-4">Produit</h4>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li>
                <router-link to="/features" class="hover:text-white transition-colors"
                  >Fonctionnalités</router-link
                >
              </li>
              <li>
                <router-link to="/pricing" class="hover:text-white transition-colors"
                  >Tarifs</router-link
                >
              </li>
              <li>
                <router-link to="/coming-soon" class="hover:text-white transition-colors"
                  >Mises à jour</router-link
                >
              </li>
            </ul>
          </div>
          <div>
            <h4 class="text-white text-sm font-medium mb-4">Ressources</h4>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li>
                <router-link to="/coming-soon" class="hover:text-white transition-colors"
                  >Blog</router-link
                >
              </li>
              <li>
                <router-link to="/coming-soon" class="hover:text-white transition-colors"
                  >Guide du bailleur</router-link
                >
              </li>
              <li>
                <router-link to="/resources" class="hover:text-white transition-colors"
                  >Centre d'aide</router-link
                >
              </li>
            </ul>
          </div>
          <div>
            <h4 class="text-white text-sm font-medium mb-4">Légal</h4>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li>
                <router-link to="/privacy" class="hover:text-white transition-colors"
                  >Confidentialité</router-link
                >
              </li>
              <li>
                <router-link to="/terms" class="hover:text-white transition-colors"
                  >CGU</router-link
                >
              </li>
            </ul>
          </div>
        </div>
        <div
          class="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
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
