import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Politique de confidentialité — PlanningAPHP',
}

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>

        <h1 className="text-3xl font-bold text-secondary-800 mb-2">
          Politique de confidentialité
        </h1>
        <p className="text-secondary-500 mb-8">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </p>

        <div className="prose prose-secondary max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-secondary-800">
              1. Responsable de traitement
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              Le responsable du traitement des données est le GHT Yvelines Nord,
              représenté par Rémy BRILLET, Cadre de santé du service de
              Réanimation Néonatale du CHIPS.
            </p>
            <ul className="text-secondary-600 space-y-1 mt-3">
              <li><strong>Email :</strong> r.brillet@ghtyvelinesnord.fr</li>
              <li><strong>Téléphone :</strong> 06 19 92 60 93</li>
              <li><strong>Adresse :</strong> 10 rue du Champ Gaillard, 78300 Poissy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-secondary-800">
              2. Données collectées
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              Dans le cadre de la gestion des plannings du service, nous
              collectons les données suivantes :
            </p>
            <ul className="text-secondary-600 space-y-1 mt-3">
              <li>Données d&apos;identification : nom, prénom, email professionnel, téléphone</li>
              <li>Données professionnelles : compétence (INF/puéricultrice), temps de travail</li>
              <li>Données de planning : affectations, shifts, dates de congés</li>
              <li>Données de connexion : adresse IP, horodatage, navigateur</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-secondary-800">
              3. Base légale et finalités
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              Le traitement des données repose sur l&apos;intérêt légitime de
              l&apos;employeur pour la gestion des plannings de son personnel
              (article 6.1.f du RGPD), ainsi que sur l&apos;exécution du contrat
              de travail (article 6.1.b).
            </p>
            <p className="text-secondary-600 leading-relaxed mt-3">
              Les finalités du traitement sont :
            </p>
            <ul className="text-secondary-600 space-y-1 mt-2">
              <li>Organisation et gestion des plannings de travail</li>
              <li>Gestion des congés et absences</li>
              <li>Gestion des remplacements</li>
              <li>Suivi des heures travaillées</li>
              <li>Communication interne (notifications)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-secondary-800">
              4. Durée de conservation
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              Les données de planning sont conservées pendant la durée
              d&apos;emploi de l&apos;agent, augmentée de 5 ans pour les
              obligations légales de conservation. Les données de connexion (logs
              d&apos;audit) sont conservées pendant 1 an.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-secondary-800">
              5. Destinataires des données
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              Les données sont accessibles uniquement au personnel habilité :
              cadre de santé, gestionnaires de planning. Aucune donnée n&apos;est
              transmise à des tiers en dehors de l&apos;hébergeur (Silver
              Lining) pour les besoins techniques d&apos;hébergement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-secondary-800">
              6. Vos droits
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="text-secondary-600 space-y-1 mt-3">
              <li><strong>Droit d&apos;accès :</strong> obtenir la confirmation que vos données sont traitées et en obtenir une copie</li>
              <li><strong>Droit de rectification :</strong> corriger des données inexactes</li>
              <li><strong>Droit à l&apos;effacement :</strong> demander la suppression de vos données (sous réserve des obligations légales)</li>
              <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
              <li><strong>Droit d&apos;opposition :</strong> vous opposer au traitement de vos données</li>
              <li><strong>Droit à la limitation :</strong> demander la restriction du traitement</li>
            </ul>
            <p className="text-secondary-600 leading-relaxed mt-3">
              Pour exercer ces droits, contactez le responsable de traitement à
              l&apos;adresse r.brillet@ghtyvelinesnord.fr.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-secondary-800">
              7. Cookies et traceurs
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              <strong>Cookies essentiels :</strong> un cookie de session
              (auth-token) est utilisé pour maintenir votre connexion. Il est
              strictement nécessaire au fonctionnement de l&apos;application.
            </p>
            <p className="text-secondary-600 leading-relaxed mt-3">
              <strong>Analyse statistique (Umami) :</strong> nous utilisons Umami,
              un outil d&apos;analyse respectueux de la vie privée qui ne dépose
              aucun cookie et ne collecte aucune donnée personnelle.
            </p>
            <p className="text-secondary-600 leading-relaxed mt-3">
              <strong>Google Analytics :</strong> cet outil n&apos;est activé
              qu&apos;après votre consentement explicite via le bandeau cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-secondary-800">
              8. Sécurité
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              Nous mettons en œuvre les mesures techniques et
              organisationnelles appropriées pour protéger vos données :
              chiffrement des mots de passe, connexions sécurisées (HTTPS),
              journalisation des accès, contrôle des rôles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-secondary-800">
              9. Réclamation
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              Si vous estimez que le traitement de vos données constitue une
              violation du RGPD, vous pouvez introduire une réclamation auprès
              de la CNIL (Commission Nationale de l&apos;Informatique et des
              Libertés) sur{' '}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700"
              >
                www.cnil.fr
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-secondary-200 text-center text-xs text-secondary-400">
          &copy; {new Date().getFullYear()} GHT Yvelines Nord. Tous droits réservés.
          {' | '}
          Développé par{' '}
          <a href="https://silverliningcloud.fr" target="_blank" rel="noopener noreferrer"
            className="hover:text-secondary-500">
            Silver Lining
          </a>
        </div>
      </div>
    </div>
  )
}
