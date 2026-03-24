import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales — PlanningAPHP',
}

export default function MentionsLegalesPage() {
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

        <h1 className="text-3xl font-bold text-secondary-800 mb-8">
          Mentions légales
        </h1>

        <div className="prose prose-secondary max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-secondary-800">
              1. Éditeur du site
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              Le site PlanningAPHP est édité par le Groupement Hospitalier de
              Territoire (GHT) Yvelines Nord — Service de Réanimation et Soins
              Intensifs Néonataux du Centre Hospitalier Intercommunal de
              Poissy-Saint-Germain-en-Laye (CHIPS).
            </p>
            <ul className="text-secondary-600 space-y-1 mt-3">
              <li><strong>Adresse :</strong> 10 rue du Champ Gaillard, 78300 Poissy</li>
              <li><strong>Téléphone :</strong> 01 39 27 40 00</li>
              <li><strong>Responsable de publication :</strong> Rémy BRILLET, Cadre de santé</li>
              <li><strong>Email :</strong> r.brillet@ghtyvelinesnord.fr</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-secondary-800">
              2. Hébergement
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              Ce site est hébergé par Silver Lining, société spécialisée dans le
              développement et l&apos;hébergement web.
            </p>
            <ul className="text-secondary-600 space-y-1 mt-3">
              <li><strong>Société :</strong> Silver Lining</li>
              <li><strong>Site web :</strong>{' '}
                <a href="https://silverliningcloud.fr" target="_blank" rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700">
                  silverliningcloud.fr
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-secondary-800">
              3. Propriété intellectuelle
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              L&apos;ensemble du contenu de ce site (textes, images, graphismes,
              logo, icônes) est la propriété exclusive du GHT Yvelines Nord ou
              fait l&apos;objet d&apos;une autorisation d&apos;utilisation. Toute
              reproduction, distribution, modification ou utilisation sans
              autorisation préalable est strictement interdite.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-secondary-800">
              4. Protection des données personnelles
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              Conformément au Règlement Général sur la Protection des Données
              (RGPD) et à la loi Informatique et Libertés, vous disposez de
              droits sur vos données personnelles. Pour en savoir plus,
              consultez notre{' '}
              <Link
                href="/politique-confidentialite"
                className="text-primary-600 hover:text-primary-700"
              >
                politique de confidentialité
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-secondary-800">
              5. Cookies
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              Ce site utilise des cookies à des fins de fonctionnement et
              d&apos;analyse statistique. Les cookies d&apos;analyse (Google
              Analytics) ne sont activés qu&apos;après votre consentement
              explicite. L&apos;outil d&apos;analyse Umami est utilisé sans
              cookies et ne nécessite pas de consentement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-secondary-800">
              6. Limitation de responsabilité
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              Le GHT Yvelines Nord s&apos;efforce d&apos;assurer l&apos;exactitude
              des informations diffusées sur ce site. Toutefois, il ne peut
              garantir l&apos;exhaustivité ni l&apos;absence d&apos;erreurs. Les
              informations présentes sur ce site sont fournies à titre indicatif
              et sont susceptibles d&apos;être modifiées à tout moment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-secondary-800">
              7. Crédits
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              Site développé par{' '}
              <a
                href="https://silverliningcloud.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700"
              >
                Silver Lining
              </a>.
              Images : Unsplash (licence libre).
              Icônes : Lucide Icons.
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
