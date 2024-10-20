import React from 'react';

const TermsPage = () => {
  return (
    <div className="p-6 lg:p-12 bg-gray-50 text-gray-800">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-4 border-blue-500 pb-2">
        Conditions d'utilisation
      </h1>
      <p className="mb-8 leading-relaxed">
        Bienvenue sur Thumbs ! En utilisant notre site, vous acceptez les présentes conditions 
        d'utilisation. Veuillez les lire attentivement.
      </p>

      <h2 className="text-3xl font-semibold mb-6 text-blue-600">1. Introduction</h2>
      <p className="mb-6 leading-relaxed">
        L'utilisation de Thumbs est soumise aux conditions suivantes. Thumbs est une plateforme 
        permettant la mise en relation de personnes en situation d'isolement avec des associations 
        et d'autres utilisateurs via des événements basés sur des intérêts communs (ex. : yoga, 
        pêche, programmation, football, etc.).
      </p>

      <h2 className="text-3xl font-semibold mb-6 text-blue-600">2. Inscription et Utilisation</h2>
      <p className="mb-6 leading-relaxed">
        En vous inscrivant sur Thumbs, que ce soit en tant qu'association ou utilisateur, vous 
        acceptez de fournir des informations exactes et à jour. Vous vous engagez à ne pas 
        utiliser la plateforme à des fins frauduleuses ou illégales.
      </p>

      <h2 className="text-3xl font-semibold mb-6 text-blue-600">3. Profils publics</h2>
      <p className="mb-6 leading-relaxed">
        En vous inscrivant sur Thumbs, vous reconnaissez que les informations de votre profil 
        (nom, image, centres d'intérêt, et autres détails publics) seront visibles par tous les 
        utilisateurs. Les profils des associations 
        sont également publics afin de permettre aux utilisateurs de découvrir les événements 
        et les activités qu'elles proposent.
      </p>

      <h2 className="text-3xl font-semibold mb-6 text-blue-600">4. Création et Participation aux Événements</h2>
      <p className="mb-6 leading-relaxed">
        Les associations peuvent créer des événements en rapport avec leurs activités, tandis que 
        les utilisateurs peuvent s'inscrire ou participer à ces événements en fonction de leurs 
        centres d'intérêt et de leur localisation.
      </p>

      <h2 className="text-3xl font-semibold mb-6 text-blue-600">5. Messagerie</h2>
      <p className="mb-6 leading-relaxed">
        Thumbs propose une fonctionnalité de messagerie qui permet aux utilisateurs et aux 
        associations de communiquer. Les messages sont privés et ne peuvent être lus que par 
        les destinataires concernés. Cependant, en cas de signalement d'abus, Thumbs se réserve 
        le droit d'examiner les messages afin de garantir la sécurité des utilisateurs.
      </p>

      <h2 className="text-3xl font-semibold mb-6 text-blue-600">6. Politique de Confidentialité</h2>
      <div className="space-y-4 mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">6.1 Collecte des données</h3>
        <p className="leading-relaxed">
          Nous collectons des informations personnelles lorsque vous vous inscrivez sur Thumbs, 
          y compris votre nom, adresse e-mail, localisation, centres d'intérêt et les messages 
          échangés via la messagerie.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800">6.2 Utilisation des données</h3>
        <p className="leading-relaxed">
          Vos données sont utilisées pour personnaliser votre expérience sur Thumbs, vous permettre 
          de participer aux événements, communiquer avec d'autres utilisateurs et améliorer nos 
          services. Les informations de votre profil sont publiques par défaut, accessibles à 
          tout utilisateur.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800">6.3 Messagerie et confidentialité</h3>
        <p className="leading-relaxed">
          Les messages échangés via la messagerie sont stockés temporairement pour permettre la 
          communication. Ils ne sont pas visibles par les autres utilisateurs, sauf en cas de 
          signalement d'abus. Les messages sont supprimés après un délai raisonnable ou lors de 
          la suppression du compte.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800">6.4 Partage des données</h3>
        <p className="leading-relaxed">
          Vos données ne sont partagées qu'avec les utilisateurs et associations dans le cadre des 
          événements ou de la messagerie. Nous ne vendons pas vos informations à des tiers.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800">6.5 Sécurité des données</h3>
        <p className="leading-relaxed">
          Nous prenons des mesures pour protéger vos données, mais nous ne pouvons garantir une 
          sécurité absolue. Il est important de noter que la transmission de données sur Internet 
          comporte toujours des risques.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800">6.6 Droits des utilisateurs et suppression de compte</h3>
        <p className="leading-relaxed">
          Conformément au RGPD (Règlement Général sur la Protection des Données) en Europe, vous 
          avez le droit d'accéder, de rectifier ou de supprimer vos données personnelles à tout 
          moment. En cas de suppression de compte, Thumbs s'engage à effacer toutes les informations 
          personnelles et les messages associés dans un délai raisonnable.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800">6.7 Conservation des données</h3>
        <p className="leading-relaxed">
          Nous conservons vos données aussi longtemps que votre compte est actif ou tant que cela 
          est nécessaire pour vous fournir nos services.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800">6.8 RGPD</h3>
        <p className="leading-relaxed">
          Conformément au RGPD, vous disposez de plusieurs droits : accès, rectification, 
          suppression, portabilité des données, et opposition. Vous pouvez exercer ces droits en 
          nous contactant.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800">6.8 Cookie</h3>
        <p className="leading-relaxed">

        </p>
      </div>

      <div className="flex justify-end">
        <a href="#top" className="text-blue-600 hover:underline">
          Retour en haut
        </a>
      </div>
    </div>
  );
};

export default TermsPage;
