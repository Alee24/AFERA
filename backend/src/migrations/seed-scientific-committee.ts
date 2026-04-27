import { User, Post } from '../models';
import sequelize from '../models';

const seed = async () => {
  try {
    await sequelize.authenticate();
    
    const admin = await User.findOne({ where: { email: 'admin@aferainnov.africa' } });
    if (!admin) {
      console.error('Admin user not found. Run main seed first.');
      process.exit(1);
    }

    const content_en = `
      <p>The Scientific Committee of the AFERA Innov Academy brings together six distinguished African leaders from academia, public institutions, and road funds.</p>
      <ul>
        <li><strong>Prof. Macuacua (Mozambique)</strong> – PhD in Business Administration, CEO of Mozambique’s Road Fund and Treasurer of ARMFA, with over 35 years of expertise in public finance, academia, and research.</li>
        <li><strong>Dr. Ali Alkassoum (Niger)</strong> – PhD in Business Administration, Master’s in Project Management, Engineer in Telecommunications, Executive Secretary of ARMFA and former CEO of Niger’s Road Fund, specialist in PPPs and strategic management.</li>
        <li><strong>Stewart Lucky Gray Malata (Malawi)</strong> – Graduate of the University of Stirling (UK) and the University of Malawi, CEO of Malawi Roads Fund Administration, with extensive experience in governance and corporate leadership.</li>
        <li><strong>Abdel Djoubar Fotor (Central African Republic)</strong> – Master’s in Public Law, Postgraduate Diploma in General Administration, Administrator of CAR Road Fund, former CEO and senior government official in public works and infrastructure.</li>
        <li><strong>Rashid Mohamed, MBS (Kenya)</strong> – Bachelor of Commerce, Certified Public Accountant (ICPAK), Director General of Kenya Roads Board, with over 28 years in finance, governance, and infrastructure policy.</li>
        <li><strong>Mrs. Soukeye Diop (Senegal)</strong> – Civil Engineer, MBA in Business Administration, Director General of Senegal’s Road Fund (FERA) and Chair of ARMFA’s West Africa Focal Group, with more than 20 years in infrastructure and project management.</li>
      </ul>
      <p>Together, they ensure the scientific rigor, relevance, and quality of the Academy’s programs, guiding research, validating training content, and promoting innovation in road infrastructure financing and maintenance across Africa.</p>
    `;

    const content_fr = `
      <p>L’Association Africaine des Fonds d’Entretien Routier (AFERA) continue de démontrer son engagement envers l’innovation et l’excellence dans la gestion routière à travers la création du Comité Scientifique AFERA INNOV.</p>
      
      <h3 style="color: #1e3a8a; margin-top: 20px;">Présidence du Comité</h3>
      <p>Le Professeur Ângelo António Macuácua, Trésorier d’ARMFA-AFERA et PDG du Fonds Routier du Mozambique, préside ce comité. Son leadership visionnaire inspire une approche scientifique et collaborative pour relever les défis de la durabilité et de la modernisation du réseau routier africain.</p>

      <h3 style="color: #1e3a8a; margin-top: 20px;">Rapporteur du Comité</h3>
      <p>Le Dr. Ali Alkassoum, Secrétaire Exécutif d’ARMFA-AFERA (siège au Kenya), occupe le rôle de Rapporteur du Comité Scientifique. Il assure la coordination stratégique et la mise en œuvre des programmes de recherche et d’innovation à travers le continent.</p>

      <h3 style="color: #1e3a8a; margin-top: 20px;">Membres du Comité Scientifique</h3>
      <ul>
        <li><strong>M. Rashid Mohamed</strong> – Président du Groupe Focal de l’Afrique de l’Est et Directeur Général du Kenya Roads Board</li>
        <li><strong>M. Fotor Abdel-Djoubar</strong> – Président du Groupe Focal de l’Afrique Centrale et Administrateur du Fonds Routier de la République Centrafricaine</li>
        <li><strong>Mme. Soukeye Diop</strong> – Présidente du Groupe Focal de l’Afrique de l’Ouest et Directrice Générale du Fonds Routier Autonome du Sénégal</li>
        <li><strong>M. Stewart Malata</strong> – Président du Groupe Focal de l’Afrique Australe et PDG du Malawi Road Fund</li>
      </ul>

      <h3 style="color: #1e3a8a; margin-top: 20px;">Une Vision Commune pour l’Avenir</h3>
      <p>Le Comité Scientifique AFERA INNOV symbolise une nouvelle ère de coopération entre les fonds routiers africains. Ensemble, ils aspirent à :</p>
      <ul>
        <li>Stimuler l’innovation technologique dans la gestion et le financement des routes.</li>
        <li>Promouvoir la recherche scientifique pour des infrastructures durables et résilientes.</li>
        <li>Faciliter l’échange d’expériences et de bonnes pratiques entre les pays membres.</li>
      </ul>
      <p>Grâce à cette collaboration panafricaine, AFERA INNOV se positionne comme un moteur essentiel du développement routier et économique du continent.</p>
    `;

    await Post.findOrCreate({
      where: { title_en: 'The Scientific Committee of the AFERA Innov Academy' },
      defaults: {
        title_en: 'The Scientific Committee of the AFERA Innov Academy',
        title_fr: 'Le Comité Scientifique de l’AFERA Innov Academy',
        title_pt: 'O Comité Científico da AFERA Innov Academy',
        title_sw: 'Kamati ya Kisayansi ya AFERA Innov Academy',
        content_en: content_en,
        content_fr: content_fr,
        content_pt: content_en, // Default to EN for now
        content_sw: content_en, // Default to EN for now
        author_id: admin.id
      }
    });

    console.log('Scientific Committee blog seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
