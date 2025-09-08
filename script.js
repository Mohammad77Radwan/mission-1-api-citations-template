// ===== GÉNÉRATEUR DE CITATIONS - GUIDE ÉTAPE PAR ÉTAPE =====
// Projet : Assignment 1 - API REST avec JavaScript
// Objectif : Apprendre à utiliser fetch() et manipuler le DOM

// Configuration de l'API
const API_URL = 'https://api.quotable.io/random';

// 🎯 ÉTAPE 0 : RÉCUPÉRATION DES ÉLÉMENTS DOM
// Ces éléments sont définis ici pour être utilisés dans tout le script
const loadingElement = document.getElementById('loading');
const citationContainer = document.getElementById('citation-container');
const errorContainer = document.getElementById('error-container');
const errorText = document.getElementById('error-text');
const citationText = document.getElementById('citation-text');
const citationAuthor = document.getElementById('citation-author');
const btnNouvelle = document.getElementById('nouvelle-citation');
const btnRetry = document.getElementById('retry-btn');

// ===== FONCTIONS PRINCIPALES =====

/**
 * 🎯 ÉTAPE 1 : APPEL API AVEC FETCH
 * 
 * OBJECTIF : Récupérer une citation depuis l'API quotable.io
 * 
 * 📚 CE QUE VOUS ALLEZ APPRENDRE :
 * - Utiliser fetch() pour les appels API
 * - Gérer les Promises avec async/await
 * - Traiter les réponses JSON
 * - Gérer les erreurs réseau
 * 
 * 💡 INDICE : L'API retourne un objet JSON comme :
 * {
 *   "content": "Le succès c'est d'aller d'échec en échec sans perdre son enthousiasme.",
 *   "author": "Winston Churchill",
 *   "length": 65
 * }
 */
async function obtenirCitation() {
    try {
        // 🎯 TODO 1.1 : Afficher l'état de chargement
        console.log('🔄 Début du chargement...');
        afficherLoading();
        
        // 🎯 TODO 1.2 : Faire l'appel API avec fetch()
        console.log('📡 Appel API vers:', API_URL);
        const response = await fetch(API_URL);
        
        // 🧪 CHECKPOINT 1 : Vérifiez dans la console Network de votre navigateur
        console.log('📥 Réponse reçue:', response);
        
        // 🎯 TODO 1.3 : Vérifier si la réponse est correcte
        if (!response.ok) {
            // Gestion spécifique selon le type d'erreur
            if (response.status === 404) {
                throw new Error('Citation non trouvée (404)');
            } else if (response.status >= 500) {
                throw new Error('Problème serveur. Réessayez dans quelques instants.');
            } else {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
        }
        
        // 🎯 TODO 1.4 : Convertir la réponse en JSON
        const data = await response.json();
        
        // 🧪 CHECKPOINT 2 : Examinez la structure des données
        console.log('✅ Données reçues:', data);
        console.log('📝 Citation:', data.content);
        console.log('👤 Auteur:', data.author);
        
        // 🎯 TODO 1.5 : Afficher la citation
        afficherCitation(data);
        
    } catch (error) {
        // 🎯 TODO 1.6 : Gérer les erreurs
        console.error('❌ Erreur capturée:', error);
        gererErreur(error);
    }
}

/**
 * 🎯 ÉTAPE 2 : AFFICHAGE DES DONNÉES
 * 
 * OBJECTIF : Mettre à jour l'interface utilisateur avec les données reçues
 * 
 * 📚 CE QUE VOUS ALLEZ APPRENDRE :
 * - Manipulation du DOM avec JavaScript
 * - Gestion des classes CSS pour l'affichage
 * - Accessibilité et expérience utilisateur
 * 
 * @param {Object} data - Données reçues de l'API
 * @param {string} data.content - Le texte de la citation
 * @param {string} data.author - L'auteur de la citation
 * @param {number} data.length - La longueur de la citation
 */
function afficherCitation(data) {
    // 🎯 TODO 2.1 : Masquer les états de chargement et d'erreur
    masquerLoading();
    masquerErreur();
    
    // 🎯 TODO 2.2 : Remplir le contenu textuel
    // ASTUCE : Utilisez textContent pour éviter les injections XSS
    citationText.textContent = data.content;
    citationAuthor.textContent = data.author;
    
    // 🧪 CHECKPOINT 3 : Vérifiez que le texte apparaît correctement
    console.log('📄 Citation affichée:', citationText.textContent);
    console.log('👤 Auteur affiché:', citationAuthor.textContent);
    
    // 🎯 TODO 2.3 : Afficher le conteneur de citation
    citationContainer.classList.remove('hidden');
    
    // 🎯 TODO 2.4 : Réactiver le bouton pour la prochaine citation
    btnNouvelle.disabled = false;
    btnNouvelle.textContent = '🔄 Nouvelle Citation';
    
    // 🎯 BONUS : Afficher les fonctionnalités bonus si implémentées
    const bonusSection = document.getElementById('bonus-features');
    if (bonusSection) {
        bonusSection.classList.remove('hidden');
    }
    
    // 🎯 BONUS : Animer l'apparition (optionnel)
    citationContainer.style.opacity = '0';
    citationContainer.style.transform = 'translateY(20px)';
    setTimeout(() => {
        citationContainer.style.transition = 'all 0.5s ease';
        citationContainer.style.opacity = '1';
        citationContainer.style.transform = 'translateY(0)';
    }, 100);
}

/**
 * 🎯 ÉTAPE 3 : GESTION DES ERREURS
 * 
 * OBJECTIF : Informer l'utilisateur en cas de problème
 * 
 * 📚 CE QUE VOUS ALLEZ APPRENDRE :
 * - Gestion robuste des erreurs
 * - Communication claire avec l'utilisateur
 * - Récupération gracieuse après erreur
 * 
 * @param {Error} error - L'erreur à traiter
 */
function gererErreur(error) {
    // 🎯 TODO 3.1 : Masquer les autres états
    masquerLoading();
    citationContainer.classList.add('hidden');
    
    // 🎯 TODO 3.2 : Personnaliser le message d'erreur
    let messageErreur = 'Une erreur inattendue s\'est produite.';
    
    if (error.message.includes('Failed to fetch')) {
        messageErreur = 'Problème de connexion. Vérifiez votre accès internet.';
    } else if (error.message.includes('404')) {
        messageErreur = 'Citation introuvable. Réessayons avec une autre.';
    } else if (error.message.includes('500')) {
        messageErreur = 'Le serveur rencontre des difficultés. Veuillez patienter.';
    } else {
        messageErreur = error.message;
    }
    
    // 🎯 TODO 3.3 : Afficher le message d'erreur
    errorText.textContent = messageErreur;
    errorContainer.classList.remove('hidden');
    
    // 🎯 TODO 3.4 : Réactiver les boutons
    btnNouvelle.disabled = false;
    btnNouvelle.textContent = '🔄 Réessayer';
    
    // 🧪 CHECKPOINT 4 : L'erreur est-elle bien affichée ?
    console.log('⚠️ Erreur affichée à l\'utilisateur:', messageErreur);
}

// ===== FONCTIONS UTILITAIRES =====

/**
 * Affiche l'état de chargement
 */
function afficherLoading() {
    loadingElement.classList.remove('hidden');
    citationContainer.classList.add('hidden');
    errorContainer.classList.add('hidden');
    btnNouvelle.disabled = true;
    btnNouvelle.textContent = '⏳ Chargement...';
}

/**
 * Masque l'état de chargement
 */
function masquerLoading() {
    loadingElement.classList.add('hidden');
}

/**
 * Masque l'état d'erreur
 */
function masquerErreur() {
    errorContainer.classList.add('hidden');
}

// ===== ÉVÉNEMENTS =====

/**
 * 🎯 ÉTAPE 4 : GESTION DES ÉVÉNEMENTS
 * 
 * OBJECTIF : Rendre l'interface interactive
 * 
 * 📚 CE QUE VOUS ALLEZ APPRENDRE :
 * - addEventListener pour l'interactivité
 * - Événements DOM (click, DOMContentLoaded)
 * - Cycle de vie d'une page web
 */

// 🎯 TODO 4.1 : Événement pour le bouton "Nouvelle citation"
btnNouvelle.addEventListener('click', () => {
    console.log('🖱️ Clic sur "Nouvelle citation"');
    obtenirCitation();
});

// 🎯 TODO 4.2 : Événement pour le bouton "Réessayer" (en cas d'erreur)
if (btnRetry) {
    btnRetry.addEventListener('click', () => {
        console.log('🖱️ Clic sur "Réessayer"');
        obtenirCitation();
    });
}

// 🎯 TODO 4.3 : Chargement automatique au démarrage de la page
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Page chargée, récupération de la première citation...');
    // ASTUCE : Petit délai pour que l'utilisateur voie l'animation de chargement
    setTimeout(() => {
        obtenirCitation();
    }, 500);
});

// 🎯 TODO 4.4 : Raccourci clavier (bonus)
document.addEventListener('keydown', (event) => {
    // Appuyer sur Espace pour une nouvelle citation
    if (event.code === 'Space' && !btnNouvelle.disabled && !event.target.matches('input, textarea')) {
        event.preventDefault(); // Empêche le scroll de la page
        console.log('⌨️ Raccourci clavier détecté (Espace)');
        obtenirCitation();
    }
});

// ===== FONCTIONNALITÉS BONUS (OPTIONNELLES) =====

/**
 * 🎯 BONUS 1 : PARTAGE SUR LES RÉSEAUX SOCIAUX
 * 
 * Utilise l'API Web Share moderne ou fallback vers le presse-papiers
 */
function partagerCitation() {
    const citation = citationText.textContent;
    const auteur = citationAuthor.textContent;
    const texte = `"${citation}" — ${auteur}`;
    
    if (navigator.share) {
        // API Web Share (principalement mobile)
        navigator.share({
            title: 'Citation Inspirante',
            text: texte,
            url: window.location.href
        }).then(() => {
            console.log('📤 Citation partagée avec succès');
        }).catch((error) => {
            console.log('❌ Erreur de partage:', error);
            copierDansPressePapier(texte);
        });
    } else {
        // Fallback : copier dans le presse-papiers
        copierDansPressePapier(texte);
    }
}

/**
 * 🎯 BONUS 2 : SAUVEGARDE EN FAVORIS (localStorage)
 * 
 * Stocke les citations favorites dans le navigateur
 */
function ajouterAuxFavoris() {
    const citation = {
        content: citationText.textContent,
        author: citationAuthor.textContent,
        date: new Date().toISOString(),
        id: Date.now() // ID unique simple
    };
    
    // Récupérer les favoris existants
    const favoris = JSON.parse(localStorage.getItem('citations-favoris') || '[]');
    
    // Vérifier si la citation n'est pas déjà en favoris
    const dejaEnFavoris = favoris.some(fav => 
        fav.content === citation.content && fav.author === citation.author
    );
    
    if (dejaEnFavoris) {
        alert('⭐ Cette citation est déjà dans vos favoris !');
        return;
    }
    
    // Ajouter la nouvelle citation
    favoris.push(citation);
    
    // Limiter à 50 favoris pour éviter de surcharger localStorage
    if (favoris.length > 50) {
        favoris.shift(); // Supprime le plus ancien
    }
    
    // Sauvegarder
    localStorage.setItem('citations-favoris', JSON.stringify(favoris));
    
    console.log('⭐ Citation ajoutée aux favoris:', citation);
    alert(`⭐ Citation ajoutée aux favoris ! (${favoris.length} au total)`);
}

/**
 * Fonction utilitaire pour copier du texte dans le presse-papiers
 */
function copierDansPressePapier(texte) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(texte).then(() => {
            console.log('📋 Texte copié dans le presse-papiers');
            alert('📋 Citation copiée dans le presse-papiers !');
        }).catch((error) => {
            console.error('❌ Erreur de copie:', error);
        });
    } else {
        // Fallback pour les navigateurs plus anciens
        const textArea = document.createElement('textarea');
        textArea.value = texte;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            alert('📋 Citation copiée !');
        } catch (error) {
            console.error('❌ Copie impossible:', error);
        }
        document.body.removeChild(textArea);
    }
}

// 🎯 BONUS : Événements pour les fonctionnalités bonus
document.addEventListener('DOMContentLoaded', () => {
    const btnPartager = document.getElementById('partager-btn');
    const btnFavoris = document.getElementById('favoris-btn');
    
    if (btnPartager) {
        btnPartager.addEventListener('click', partagerCitation);
    }
    
    if (btnFavoris) {
        btnFavoris.addEventListener('click', ajouterAuxFavoris);
    }
});

// ===== SYSTÈME DE LOGS POUR LE DEBUG =====

/**
 * 🎯 AIDE AU DEBUGGING
 * 
 * Tapez dans la console du navigateur :
 * - debugCitations() : Affiche l'état actuel
 * - clearFavoris() : Vide les favoris localStorage
 * - showFavoris() : Affiche tous les favoris
 */
window.debugCitations = function() {
    console.log('🔍 État actuel du générateur de citations:');
    console.log('- Loading visible:', !loadingElement.classList.contains('hidden'));
    console.log('- Citation visible:', !citationContainer.classList.contains('hidden'));
    console.log('- Erreur visible:', !errorContainer.classList.contains('hidden'));
    console.log('- Bouton activé:', !btnNouvelle.disabled);
    
    if (!citationContainer.classList.contains('hidden')) {
        console.log('- Citation actuelle:', citationText.textContent);
        console.log('- Auteur actuel:', citationAuthor.textContent);
    }
};

window.clearFavoris = function() {
    localStorage.removeItem('citations-favoris');
    console.log('🗑️ Favoris supprimés');
};

window.showFavoris = function() {
    const favoris = JSON.parse(localStorage.getItem('citations-favoris') || '[]');
    console.log(`⭐ ${favoris.length} citation(s) en favoris:`, favoris);
};