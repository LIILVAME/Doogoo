<template>
  <div class="lease-template print:block hidden">
    <div class="lease-content max-w-4xl mx-auto p-8 print:p-12 font-serif text-xs print:text-sm">
      <!-- En-tête -->
      <div class="text-center mb-8 print:mb-12">
        <h1 class="text-xl print:text-2xl font-bold mb-2 print:mb-4">
          CONTRAT DE LOCATION DE LOGEMENT NU
        </h1>
        <p class="text-xs print:text-sm text-gray-700 font-semibold">
          Soumis au titre Ier de la loi n° 89-462 du 6 juillet 1989
        </p>
        <p class="text-xs print:text-sm text-gray-600 mt-1">
          tendant à améliorer les rapports locatifs
        </p>
      </div>

      <!-- I. DÉSIGNATION DES PARTIES -->
      <section class="mb-6 print:mb-8">
        <h2 class="text-base print:text-lg font-bold mb-4 print:mb-6 uppercase">
          I. DÉSIGNATION DES PARTIES
        </h2>
        
        <div class="space-y-4 print:space-y-5">
          <div>
            <h3 class="font-semibold mb-2 print:mb-3 text-sm print:text-base">Le BAILLEUR :</h3>
            <p class="text-xs print:text-sm leading-relaxed">
              <strong>{{ ownerData.fullName || ownerData.name || 'Non renseigné' }}</strong>
            </p>
            
            <!-- Adresse structurée (nouveaux champs) ou fallback sur address -->
            <p v-if="ownerData.addressLine || ownerData.postalCode || ownerData.city || ownerData.address" class="text-xs print:text-sm leading-relaxed">
              Adresse : 
              <template v-if="ownerData.addressLine || ownerData.postalCode || ownerData.city">
                <template v-if="ownerData.addressLine">{{ ownerData.addressLine }}</template>
                <template v-if="ownerData.postalCode || ownerData.city">
                  <template v-if="ownerData.addressLine">, </template>
                  {{ [ownerData.postalCode, ownerData.city].filter(Boolean).join(' ') }}
                </template>
              </template>
              <template v-else-if="ownerData.address">{{ ownerData.address }}</template>
            </p>
            
            <p v-if="ownerData.phone" class="text-xs print:text-sm leading-relaxed">
              Téléphone : {{ ownerData.phone }}
            </p>
            <p v-if="ownerData.email" class="text-xs print:text-sm leading-relaxed">
              Email : {{ ownerData.email }}
            </p>
            
            <!-- Informations juridiques (uniquement si société) -->
            <template v-if="ownerData.landlordType === 'company'">
              <p v-if="ownerData.company" class="text-xs print:text-sm leading-relaxed font-semibold mt-2">
                {{ ownerData.company }}
                <template v-if="ownerData.legalForm"> ({{ ownerData.legalForm }})</template>
              </p>
              <p v-if="ownerData.siret" class="text-xs print:text-sm leading-relaxed">
                SIRET : {{ ownerData.siret }}
              </p>
              <p v-if="ownerData.rcs" class="text-xs print:text-sm leading-relaxed">
                RCS : {{ ownerData.rcs }}
              </p>
              <p v-if="ownerData.capitalSocial" class="text-xs print:text-sm leading-relaxed">
                Capital social : {{ ownerData.capitalSocial }}
              </p>
            </template>
          </div>

          <div>
            <h3 class="font-semibold mb-2 print:mb-3 text-sm print:text-base">Le LOCATAIRE :</h3>
            <p class="text-xs print:text-sm leading-relaxed">
              <strong>{{ tenantData.name || 'Non renseigné' }}</strong>
            </p>
            <p v-if="tenantData.email" class="text-xs print:text-sm leading-relaxed">
              Email : {{ tenantData.email }}
            </p>
            <p v-if="tenantData.birthDate && tenantData.birthPlace" class="text-xs print:text-sm leading-relaxed">
              Né(e) le {{ formatDate(tenantData.birthDate) }} à {{ tenantData.birthPlace }}
            </p>
            <p v-else-if="tenantData.birthDate" class="text-xs print:text-sm leading-relaxed">
              Né(e) le {{ formatDate(tenantData.birthDate) }}
            </p>
            <p v-else-if="tenantData.birthPlace" class="text-xs print:text-sm leading-relaxed">
              Né(e) à {{ tenantData.birthPlace }}
            </p>
          </div>
        </div>
      </section>

      <!-- II. OBJET DU CONTRAT -->
      <section class="mb-6 print:mb-8">
        <h2 class="text-base print:text-lg font-bold mb-4 print:mb-6 uppercase">
          II. OBJET DU CONTRAT
        </h2>
        
        <div class="space-y-3 print:space-y-4">
          <p class="text-xs print:text-sm leading-relaxed">
            Le présent contrat a pour objet la location d'un logement situé :
          </p>
          <div class="pl-4 print:pl-6 border-l-2 border-gray-400 my-3 print:my-4">
            <p class="text-xs print:text-sm font-medium leading-relaxed">
              {{ propertyData.address || 'Adresse non renseignée' }}
            </p>
            <p v-if="propertyData.zip || propertyData.city" class="text-xs print:text-sm leading-relaxed">
              {{ [propertyData.zip, propertyData.city].filter(Boolean).join(' ') }}
            </p>
          </div>

          <div class="mt-4 print:mt-6 space-y-2 print:space-y-3">
            <p class="text-xs print:text-sm leading-relaxed">
              <strong>Type de logement :</strong> {{ getPropertyTypeLabel(propertyData.type) }}
            </p>
            <p v-if="propertyData.surface" class="text-xs print:text-sm leading-relaxed">
              <strong>Surface habitable :</strong> {{ propertyData.surface }} m²
            </p>
            <p v-if="propertyData.pieces" class="text-xs print:text-sm leading-relaxed">
              <strong>Nombre de pièces :</strong> {{ propertyData.pieces }}
            </p>
            <p class="text-xs print:text-sm leading-relaxed">
              <strong>Chauffage :</strong> {{ propertyData.heatingType || 'Individuel' }}
            </p>
            <p v-if="propertyData.description" class="text-xs print:text-sm leading-relaxed mt-2 print:mt-3">
              <strong>Description :</strong> {{ propertyData.description }}
            </p>
          </div>
        </div>
      </section>

      <!-- III. DATE DE PRISE D'EFFET ET DURÉE -->
      <section class="mb-6 print:mb-8">
        <h2 class="text-base print:text-lg font-bold mb-4 print:mb-6 uppercase">
          III. DATE DE PRISE D'EFFET ET DURÉE
        </h2>
        
        <div class="space-y-3 print:space-y-4">
          <p class="text-xs print:text-sm leading-relaxed">
            <strong>Date de prise d'effet :</strong> {{ formatDate(tenantData.entryDate) }}
          </p>
          <p class="text-xs print:text-sm leading-relaxed">
            <strong>Durée :</strong> 3 ans, reconductible par tacite reconduction par périodes de 3 ans, sauf dénonciation par l'une ou l'autre des parties 3 mois avant l'expiration de chaque période<template v-if="ownerData.landlordType === 'individual'"> (bailleur personne physique)</template><template v-else> (bailleur personne morale)</template>.
          </p>
        </div>
      </section>

      <!-- IV. CONDITIONS FINANCIÈRES -->
      <section class="mb-6 print:mb-8">
        <h2 class="text-base print:text-lg font-bold mb-4 print:mb-6 uppercase">
          IV. CONDITIONS FINANCIÈRES
        </h2>
        
        <div class="space-y-3 print:space-y-4">
          <p class="text-xs print:text-sm leading-relaxed">
            <strong>Loyer mensuel hors charges :</strong> {{ formatCurrency(propertyData.rentAmount || propertyData.rent) }}
          </p>
          <p v-if="propertyData.chargesAmount" class="text-xs print:text-sm leading-relaxed">
            <strong>Provisions sur charges (mensuelles) :</strong> {{ formatCurrency(propertyData.chargesAmount) }}
          </p>
          <p v-if="propertyData.chargesAmount" class="text-xs print:text-sm leading-relaxed italic text-gray-700">
            Ce montant inclut notamment la taxe d'enlèvement des ordures ménagères récupérable.
          </p>
          <p v-if="propertyData.chargesAmount" class="text-xs print:text-sm leading-relaxed font-semibold">
            <strong>Total mensuel :</strong> {{ formatCurrency((propertyData.rentAmount || propertyData.rent || 0) + (propertyData.chargesAmount || 0)) }}
          </p>
          <p class="text-xs print:text-sm leading-relaxed">
            <strong>Dépôt de garantie :</strong> {{ formatCurrency(propertyData.rentAmount || propertyData.rent) }}
            <span class="text-xs print:text-sm text-gray-600 italic">(équivalent à un mois de loyer hors charges)</span>
          </p>
        </div>
      </section>

      <!-- V. CLAUSES LÉGALES OBLIGATOIRES -->
      <section class="mb-6 print:mb-8">
        <h2 class="text-base print:text-lg font-bold mb-4 print:mb-6 uppercase">
          V. CLAUSES LÉGALES OBLIGATOIRES
        </h2>
        
        <div class="space-y-3 print:space-y-4 text-xs print:text-sm leading-relaxed">
          <div class="bg-gray-50 print:bg-transparent p-3 print:p-0 border-l-4 border-gray-400 pl-4 print:pl-4">
            <p class="font-semibold mb-2 print:mb-2">Clause de Solidarité :</p>
            <p class="text-xs print:text-sm leading-relaxed italic">
              "En cas de colocation, les locataires sont tenus solidairement et indivisiblement à l'exécution des obligations du présent bail."
            </p>
          </div>

          <div class="bg-gray-50 print:bg-transparent p-3 print:p-0 border-l-4 border-gray-400 pl-4 print:pl-4">
            <p class="font-semibold mb-2 print:mb-2">Clause Résolutoire :</p>
            <p class="text-xs print:text-sm leading-relaxed italic">
              "Le bail sera résilié de plein droit, un mois après un commandement de payer demeuré infructueux, à défaut de paiement du loyer, des charges, ou du dépôt de garantie."
            </p>
          </div>
        </div>
      </section>

      <!-- VI. SIGNATURES -->
      <section class="mt-12 print:mt-16">
        <h2 class="text-base print:text-lg font-bold mb-6 print:mb-8 uppercase">
          VI. SIGNATURES
        </h2>
        
        <div class="grid grid-cols-2 gap-8 print:gap-12 mt-8 print:mt-12">
          <div class="text-center">
            <p class="text-xs print:text-sm font-semibold mb-4 print:mb-6">LE BAILLEUR</p>
            <div class="border-t-2 border-gray-400 pt-2 print:pt-4 mt-16 print:mt-24">
              <!-- Affiche la signature uploadée si disponible, sinon placeholder -->
              <div v-if="ownerData.signatureUrl" class="mb-2">
                <img :src="ownerData.signatureUrl" alt="Signature bailleur" class="max-w-[200px] mx-auto h-auto opacity-90" />
              </div>
              <template v-else>
                <p class="text-xs print:text-sm text-gray-600 italic mb-1">Signature précédée de la mention</p>
                <p class="text-xs print:text-sm text-gray-700 font-semibold">"Lu et approuvé"</p>
              </template>
            </div>
          </div>

          <div class="text-center">
            <p class="text-xs print:text-sm font-semibold mb-4 print:mb-6">LE LOCATAIRE</p>
            <div class="border-t-2 border-gray-400 pt-2 print:pt-4 mt-16 print:mt-24">
              <p class="text-xs print:text-sm text-gray-600 italic mb-1">Signature précédée de la mention</p>
              <p class="text-xs print:text-sm text-gray-700 font-semibold">"Lu et approuvé"</p>
            </div>
          </div>
        </div>

        <div class="mt-8 print:mt-12 text-center">
          <p class="text-xs print:text-sm text-gray-600">
            Fait à {{ propertyData.city || '...' }}, le {{ formatDate(new Date().toISOString()) }}
          </p>
          <p class="text-xs print:text-sm text-gray-500 mt-2">
            En double exemplaire, chaque partie reconnaît avoir reçu un exemplaire.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { formatCurrency, formatDate } from '@/utils/formatters'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  ownerData: {
    type: Object,
    required: true,
    default: () => ({
      fullName: '',
      name: '',
      // Adresse structurée (nouveaux champs)
      address: '',
      addressLine: '',
      postalCode: '',
      city: '',
      phone: '',
      email: '',
      // Type de bailleur
      landlordType: 'individual',
      // Informations juridiques (si société)
      company: '',
      legalForm: '',
      siret: '',
      rcs: '',
      capitalSocial: '',
      // Informations bancaires
      iban: '',
      bic: '',
      bankName: '',
      // Signature
      signatureUrl: null
    })
  },
  tenantData: {
    type: Object,
    required: true,
    default: () => ({
      name: '',
      birthDate: null,
      birthPlace: null,
      entryDate: '',
      email: ''
    })
  },
  propertyData: {
    type: Object,
    required: true,
    default: () => ({
      address: '',
      zip: '',
      city: '',
      type: 'apartment',
      surface: null,
      pieces: null,
      heatingType: 'Individuel',
      description: '',
      rentAmount: 0,
      rent: 0,
      chargesAmount: null
    })
  }
})

/**
 * Retourne le libellé du type de bien
 */
const getPropertyTypeLabel = (type) => {
  const types = {
    apartment: 'Appartement',
    house: 'Maison',
    parking: 'Parking',
    commercial: 'Local commercial',
    other: 'Autre'
  }
  return types[type] || 'Logement'
}
</script>

<style scoped>
/* Styles pour l'impression uniquement */
@media print {
  .lease-template {
    display: block !important;
  }

  .lease-content {
    font-family: 'Times New Roman', Times, serif;
    color: #000;
    background: #fff;
    font-size: 11px;
    line-height: 1.5;
  }

  /* Masque les éléments non nécessaires à l'impression */
  .lease-template :deep(button),
  .lease-template :deep(.no-print) {
    display: none !important;
  }

  /* Optimise les sauts de page */
  section {
    page-break-inside: avoid;
  }

  h1, h2 {
    page-break-after: avoid;
  }

  /* Assure que le contenu tient sur peu de pages */
  .lease-content {
    max-width: 100%;
    padding: 1cm;
  }
}

/* Masque le template à l'écran */
@media screen {
  .lease-template {
    display: none;
  }
}
</style>
