const app = document.getElementById("app");

let currentStep = 0;
let currentQuestion = 0;
let influencedCount = 0;
let currentPost = 0;
let radicalityScore = 0;

function renderHome() {
  app.innerHTML = `
    <p><em>“Ce que vous allez vivre est proche de ce que vous vivez chaque jour, sans le remarquer.”</em></p>
    <button onclick="startExperience()">Commencer l’expérience</button>
  `;
}

function startExperience() {
  currentStep = 1;
  renderStep1();
}

function renderStep1() {
  const question = step1Questions[currentQuestion];
  const biasOnLeft = Math.random() < 0.5;

  const left = biasOnLeft ? question.biased : question.neutral;
  const right = biasOnLeft ? question.neutral : question.biased;

  app.innerHTML = `
    <h2>Étape 1 : Choix influencés (${currentQuestion + 1}/5)</h2>
    <p>Quel article attise le plus votre curiosité ?</p>
    <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
      <div class="card" onclick="chooseArticle(${biasOnLeft ? 1 : 0})">
        <h3>${left.title}</h3>
        <p>${left.desc}</p>
      </div>
      <div class="card" onclick="chooseArticle(${biasOnLeft ? 0 : 1})">
        <h3>${right.title}</h3>
        <p>${right.desc}</p>
      </div>
    </div>
  `;
}

function chooseArticle(choiceIndex) {
  if (choiceIndex === 1) {
    influencedCount++;
    userData.influencedCount++;
  }
  

  currentQuestion++;
  if (currentQuestion < step1Questions.length) {
    renderStep1();
  } else {
    renderStep1Summary();
  }
}

function renderStep1Summary() {
  const percent = Math.round((influencedCount / step1Questions.length) * 100);
  app.innerHTML = `
    <h2>Fin de l'étape 1</h2>
    <p>Vous avez choisi <strong>${influencedCount}</strong> article(s) biaisé(s) sur ${step1Questions.length}.</p>
    <p><strong>${percent}%</strong> de vos décisions ont été influencées par l'émotion, la peur ou le framing.</p>
    <button onclick="renderStep2()">Continuer vers l'étape suivante</button>
  `;
}

const step1Questions = [
  {
    neutral: {
      title: "🧬 Une IA identifie des cellules cancéreuses avec 92% de précision",
      desc: "Une étude clinique prometteuse a été menée sur 2 000 patients."
    },
    biased: {
      title: "⚠️ Une IA décide qui vit ou meurt dans les hôpitaux",
      desc: "Certains experts dénoncent une délégation de vie ou de mort aux machines."
    }
  },
  {
    neutral: {
      title: "🌍 La taxe carbone mondiale proposée par l’ONU",
      desc: "Un outil diplomatique pour la régulation environnementale."
    },
    biased: {
      title: "🔥 Vos trajets bientôt surtaxés ? L’ONU veut faire payer les citoyens",
      desc: "Un projet mondial controversé pourrait alourdir vos factures."
    }
  },
  {
    neutral: {
      title: "🔬 Une IA améliore la détection des maladies rares",
      desc: "Elle permet un diagnostic plus rapide et précis pour les médecins."
    },
    biased: {
      title: "💀 L’IA en médecine : vers une surveillance totale de votre santé ?",
      desc: "Certains craignent une dérive vers un fichage médical permanent."
    }
  },
  {
    neutral: {
      title: "📱 L’algorithme de TikTok expliqué : suggestions basées sur vos likes",
      desc: "L’algorithme apprend à vous recommander ce que vous aimez."
    },
    biased: {
      title: "👁️ TikTok vous espionne ? Voici ce que vous ignorez sur l’algorithme",
      desc: "Des révélations inquiètent sur l’utilisation de vos données."
    }
  },
  {
    neutral: {
      title: "🚗 Des voitures autonomes testées sur 1 million de km",
      desc: "Les résultats montrent une baisse des accidents."
    },
    biased: {
      title: "💥 Une voiture sans conducteur tue une femme – et ce n’est pas la première",
      desc: "Les inquiétudes se multiplient sur la sécurité de ces véhicules."
    }
  }
];

const step2Posts = [
    {
      text: "",
      tag: "neutre",
      img: "assets/post_music_robot.png"
    },
    {
        text: "",
        tag: "polarisé",
        img: "assets/post_chatgpt_school.png"
    },
    {
      text: "",
      tag: "radical",
      img: "assets/post_order_robot.png"
    },
    {
      text: "",
      tag: "radical",
      img: "assets/post_analys_robot.png"
    },
    {
      text: "",
      tag: "polarisé",
      img: "assets/post_chatgpt_school.png"
    },
    {
      text: "",
      tag: "extrême",
      img: "assets/post_manip_robot.png"
    }
];

function renderStep2() {
  const post = step2Posts[currentPost];
  console.log("Post affiché :", post); 

  app.innerHTML = `
    <div class="tiktok-post">
      <div class="post-text">${post.text}</div>
      ${post.img ? `<img src="${post.img}" alt="image" class="post-img" style="height: 250px;">` : ''}
      <div class="post-buttons">
        <button class="like-btn" onclick="likePost()">Like ❤️</button>
        <button class="skip-btn" onclick="skipPost()">Passer</button>
      </div>
    </div>
  `;
}

function likePost() {
  const tag = step2Posts[currentPost].tag;
  if (tag === "polarisé") radicalityScore += 1;
  if (tag === "radical") radicalityScore += 2;
  if (tag === "extrême") radicalityScore += 3;
  
  if (tag === "polarisé") userData.radicalityScore += 1;
  if (tag === "radical") userData.radicalityScore += 2;
  if (tag === "extrême") userData.radicalityScore += 3;

  userData.likedPosts.push(currentPost);
  
  nextPost();
}

function skipPost() {
  nextPost();
}

function nextPost() {
  currentPost++;
  if (currentPost < step2Posts.length) {
    renderStep2();
  } else {
    renderStep3Question(0);
  }
}

function getPlayerProfile() {
  if (userData.influencedCount >= 4 || userData.radicalityScore >= 10) return "influencé";
  if (userData.influencedCount <= 1 && userData.radicalityScore <= 3) return "critique";
  return "neutre";
}

const userData = {
  influencedCount: 0,
  radicalityScore: 0,
  likedPosts: [],
  quizAnswers: []
};

function renderStep3Question(index) {
  const question = step3Questions[index];
  const profile = getPlayerProfile();

  app.className = "";
  app.classList.add(`profile-${profile}`);

  app.innerHTML = `
    <h2>Étape 3 : Jugement (${index + 1}/${step3Questions.length})</h2>
    <p>${question.question}</p>
    <div style="margin-top: 20px;">
      <button onclick="answerStep3(${index}, 0)">${question.answers[0]}</button><br><br>
      <button onclick="answerStep3(${index}, 1)">${question.answers[1]}</button><br><br>
      <button onclick="answerStep3(${index}, 2)">${question.answers[2]}</button>
    </div>
  `;
}

function answerStep3(index, answerIndex) {
  userData.quizAnswers.push({
    question: step3Questions[index].question,
    answer: step3Questions[index].answers[answerIndex]
  });

  if (index + 1 < step3Questions.length) {
    renderStep3Question(index + 1);
  } else {
    renderStep4();
  }
}

const step3Questions = [
  {
    question: "L’IA devrait-elle avoir le droit de décider qui peut obtenir un crédit ?",
    answers: [
      "Oui, si cela réduit les biais humains.",
      "Non, cela confie trop de pouvoir à des algorithmes.",
      "Seulement si l’IA est supervisée par un comité éthique."
    ]
  },
  {
    question: "Accepteriez-vous qu’une IA prédise les comportements dangereux à l’école ?",
    answers: [
      "Oui, pour prévenir les violences.",
      "Non, les enseignants doivent rester responsables.",
      "Oui, mais uniquement dans les écoles à risques."
    ]
  },
  {
    question: "Faut-il filtrer automatiquement les contenus émotionnellement intenses ?",
    answers: [
      "Oui, pour protéger les plus jeunes.",
      "Non, c’est une forme de censure.",
      "Oui, mais seulement sur demande des utilisateurs."
    ]
  }
];

function renderFinalSummary() {
  const profile = getPlayerProfile();

  let message = "";
  let color = "";
  switch (profile) {
    case "influencé":
      message = `
        <p>Votre parcours a révélé une forte réceptivité aux contenus émotionnels, polarisés ou radicaux.</p>
        <p>Il semble que vos choix aient été guidés plus par l’instinct ou la peur que par l’analyse critique.</p>
        <p><strong>Faites attention aux bulles algorithmiques et à la manipulation émotionnelle.</strong></p>
      `;
      color = "#ff5555";
      break;
    case "critique":
      message = `
        <p>Vous avez su garder une distance critique face aux contenus orientés et polarisés.</p>
        <p>Vos choix sont restés nuancés, même lorsque l’émotion était mise en avant.</p>
        <p><strong>Restez vigilant, mais continuez à questionner l’information.</strong></p>
      `;
      color = "#66ff66";
      break;
    case "neutre":
      message = `
        <p>Vous avez été parfois influencé, parfois critique, comme beaucoup de personnes.</p>
        <p>Votre profil montre une sensibilité au contexte, mais aussi une volonté de réfléchir.</p>
        <p><strong>Développer votre esprit critique est un atout précieux à l’ère numérique.</strong></p>
      `;
      color = "#ffaa00";
      break;
  }
  
  app.className = "";
  app.classList.add(`profile-${profile}`);

  app.innerHTML = `
    <h2 style="color: ${color};">🎓 Résultat final</h2>
    ${message}
    <h3>Vos réponses au jugement :</h3>
    <ul style="text-align: left; max-width: 600px; margin: 20px auto;">
      ${userData.quizAnswers.map(r => `<li><strong>${r.question}</strong><br><em>${r.answer}</em></li>`).join('')}
    </ul>
    <button onclick="location.reload()">Recommencer</button>
  `;
}

let step4CurrentPrompt = 0;
let step4Accepted = 0;
let step4DarkPatternsUsed = 0;

function spawnRealisticPopup(text, className) {
  const popup = document.createElement("div");
  popup.className = "popup-window " + className;
  popup.innerHTML = `<strong>${text}</strong><br><button onclick="this.parentElement.remove()">Fermer</button>`;
  popup.style.top = Math.random() * 80 + "%";
  popup.style.left = Math.random() * 80 + "%";
  document.body.appendChild(popup);
}

const step4Prompts = [
  {
    message: "✅ Ce site améliore votre confort en activant les cookies intelligents.",
    acceptEffect: () => {
      document.body.style.backgroundImage = "url('https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif')";
      document.body.style.backgroundSize = "cover";
      spawnRealisticPopup("🍪 Vos cookies intelligents sont activés !", "popup-green");
    },
    refuseEffect: () => {},
    buttons: ["Activer les cookies", "Refuser"],
    darkPattern: true
  },
  {
    message: "🚀 Pour une vitesse maximale, activez nos options de performance IA.",
    acceptEffect: () => {
      spawnRealisticPopup("⚡ Mode Turbo activé", "popup-blue");
      spawnRealisticPopup("🔧 Configuration IA optimisée", "popup-blue");

      const notif = document.createElement("div");
      notif.innerText = "🔔 Notifications IA intelligentes activées !";
      notif.className = "fake-notif";
      document.body.appendChild(notif);
    },
    refuseEffect: () => {},
    buttons: ["Booster maintenant", "Plus tard"],
    darkPattern: true
  },
  {
    message: "🔔 Souhaitez-vous recevoir nos alertes exclusives ?",
    acceptEffect: () => {
      spawnRealisticPopup("📣 Restez informé ! Abonnement prioritaire validé.", "popup-red");

      const alert = document.createElement("div");
      alert.className = "contacts-alert";
      alert.innerHTML = "<strong>📤 152 contacts partagés avec la plateforme</strong>";
      document.body.appendChild(alert);
    },
    refuseEffect: () => {},
    buttons: ["Oui, je veux être informé", "Non merci"],
    darkPattern: true
  },
  {
    message: "🎯 Autorisez l’analyse comportementale pour une personnalisation maximale.",
    acceptEffect: () => {
      spawnRealisticPopup("👁️ Analyse en temps réel activée", "popup-yellow");

      const ad = document.createElement("div");
      ad.className = "ad-banner";
      ad.innerHTML = "🛍️ Publicités ultra-personnalisées activées – Cliquez ici !";
      document.body.appendChild(ad);
    },
    refuseEffect: () => {},
    buttons: ["Accepter", "Gérer plus tard"],
    darkPattern: true
  },
  {
    message: "🎁 Obtenez un bonus exclusif en acceptant nos conditions améliorées.",
    acceptEffect: () => {
      spawnRealisticPopup("🎁 Félicitations ! Bonus débloqué.", "popup-purple");
      spawnRealisticPopup("🎮 Téléchargement de votre récompense en cours...", "popup-purple");
    },
    refuseEffect: () => {},
    buttons: ["Je veux mon bonus", "Non, merci"],
    darkPattern: true
  }
];

function renderStep4() {
  const prompt = step4Prompts[step4CurrentPrompt];
  const html = `
    <div class="step4-container">
      <h2>Étape 4 : Le jeu du consentement</h2>
      <p>${prompt.message}</p>
      <div class="button-row">
        <button onclick="step4Respond(true)">${prompt.buttons[0]}</button>
        <button onclick="step4Respond(false)">${prompt.buttons[1]}</button>
      </div>
    </div>
  `;
  document.getElementById("app").innerHTML = html;
}

function step4Respond(accepted) {
  const prompt = step4Prompts[step4CurrentPrompt];

  if (accepted) {
    step4Accepted++;
    prompt.acceptEffect();
  } else {
    prompt.refuseEffect();
  }

  if (prompt.darkPattern && accepted) {
    step4DarkPatternsUsed++;
  }

  step4CurrentPrompt++;
  if (step4CurrentPrompt < step4Prompts.length) {
    setTimeout(renderStep4, 500);
  } else {
    renderStep4Summary();
  }
}

function renderStep4Summary() {
  let profile;
  if (step4DarkPatternsUsed >= 3) profile = "influencé";
  else if (step4DarkPatternsUsed === 0) profile = "vigilant";
  else profile = "modéré";

  document.getElementById("app").innerHTML = `
    <div class="step4-summary">
      <h2>🎯 Résultat de l'étape 4</h2>
      <p>Vous avez accepté <strong>${step4Accepted}</strong> fois.</p>
      <p>Vous avez été influencé par <strong>${step4DarkPatternsUsed}</strong> dark patterns.</p>
      <p>Votre profil : <strong>${profile}</strong></p>
      <button onclick="renderStep5()">Passer à l'étape suivante</button>
    </div>
  `;
}

function renderStep5() {
  const profile = getPlayerProfile();

  document.body.style.backgroundImage = "none";
  document.querySelectorAll('.popup-window, .fake-notif, .contacts-alert, .ad-banner').forEach(el => el.remove());

  const data = {
    influencedPercent: Math.round((userData.influencedCount / step1Questions.length) * 100),
    radicalityScore: userData.radicalityScore,
    darkPatternAccepts: step4DarkPatternsUsed,
    quizAnswers: userData.quizAnswers.map(r => r.answer)
  };

  let traits = [];
  let conseils = [];

  if (data.influencedPercent >= 60) traits.push("attiré(e) par le sensationnel");
  else if (data.influencedPercent <= 20) traits.push("plutôt rationnel(le)");
  else traits.push("influencé(e) par le contexte");

  if (data.radicalityScore >= 8) traits.push("tendance à cliquer sur du contenu polarisant");
  else if (data.radicalityScore <= 3) traits.push("recherche de nuance");
  else traits.push("sensibilité au contenu émotionnel");

  if (data.darkPatternAccepts >= 3) traits.push("réceptif(ve) aux interfaces manipulatrices");
  else if (data.darkPatternAccepts === 0) traits.push("méfiant(e) face aux stratégies numériques");
  else traits.push("soumis(e) à l’influence subtile des interfaces");

  if (data.influencedPercent >= 60 || data.radicalityScore >= 8)
    conseils.push("Prenez du recul face aux titres choc. Ce qui attire l’œil n’est pas toujours ce qui éclaire.");

  if (data.darkPatternAccepts >= 3)
    conseils.push("Apprenez à repérer les « dark patterns » : ils sont conçus pour biaiser votre consentement.");

  if (traits.includes("recherche de nuance"))
    conseils.push("Continuez à développer votre esprit critique : c’est votre meilleure défense.");

  if (conseils.length === 0)
    conseils.push("Restez alerte : même les esprits critiques peuvent être influencés à leur insu.");

  app.innerHTML = `
    <div class="step5">
      <h2>Étape 5 : Profil comportemental</h2>
      <p>Voici ce que votre parcours révèle de vous :</p>
      <ul>
        ${traits.map(trait => `<li>🧠 ${trait}</li>`).join('')}
      </ul>

      <h3>Conseils pour l’avenir :</h3>
      <ul>
        ${conseils.map(c => `<li>✅ ${c}</li>`).join('')}
      </ul>

      <p class="conclusion" style="margin-top: 40px; font-size: 18px;">
        <em>“À l’ère numérique, l’information vous façonne autant que vous la consommez.”</em><br>
        <strong>Mieux vaut prévenir que guérir.</strong>
      </p>

      <button onclick="renderFinalSummary()">📊 Voir le bilan final</button>
    </div>
  `;
}

renderHome();
