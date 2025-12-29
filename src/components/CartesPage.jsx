import React, { useState } from 'react';
import { 
  ArrowLeft, CreditCard, Lock, Unlock, Eye, EyeOff, 
  Settings, Plus, AlertCircle, Check, Globe, Key,
  Wallet, Clock, ArrowLeftRight, FileText
} from 'lucide-react';

export default function CartesPage({ user, navigate: navigateProp }) {
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [currentPage, setCurrentPage] = useState('cartes');
  const [cardStatus, setCardStatus] = useState('active');
  const [plafondRetrait, setPlafondRetrait] = useState(user?.cards?.[0]?.dailyWithdrawalLimit || 0);
  const [plafondPaiement, setPlafondPaiement] = useState(user?.cards?.[0]?.weeklyPaymentLimit || 0);
  const [paiementEtranger, setPaiementEtranger] = useState(user?.cards?.[0]?.internationalPaymentEnabled || false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('cartes');

  // Vérifier que l'utilisateur existe
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="text-red-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600 text-lg">Erreur : utilisateur non trouvé</p>
        </div>
      </div>
    );
  }

  const currentUser = user;

  const navigate = (page) => {
    if (navigateProp && (page === 'dashboard' || page === 'solde' || page === 'historique' || page === 'virement' || page === 'rib')) {
      navigateProp(page);
    } else {
      setCurrentPage(page);
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'cartes') {
      setCurrentPage('cartes');
    } else if (navigateProp) {
      navigateProp(tabId);
    }
  };

  const generateCardNumber = (userId) => {
    const baseNumber = '4532';
    const userPart = String(userId).padStart(4, '0');
    const randomPart = '7892';
    const lastFour = String(1234 + userId).padStart(4, '0');
    return `${baseNumber} ${userPart} ${randomPart} ${lastFour}`;
  };

  // Utiliser la vraie carte de l'utilisateur ou générer une par défaut
  const fullCardNumber = currentUser.cards?.[0]?.cardNumber || generateCardNumber(currentUser.id);
  const card = {
    id: 1,
    type: currentUser.cards?.[0]?.type || 'Carte Bancaire',
    number: currentUser.cards?.[0]?.maskedNumber || `${fullCardNumber.split(' ')[0]} **** **** ${fullCardNumber.split(' ')[3]}`,
    fullNumber: fullCardNumber,
    expiry: currentUser.cards?.[0]?.expiryDate || '12/27',
    color: 'from-emerald-600 to-teal-700'
  };

  const menuItems = [
    { id: 'solde', icon: Wallet, label: 'Solde' },
    { id: 'historique', icon: Clock, label: 'Historique' },
    { id: 'virement', icon: ArrowLeftRight, label: 'Virement' },
    { id: 'cartes', icon: CreditCard, label: 'Cartes' },
    { id: 'rib', icon: FileText, label: 'RIB' },
  ];

  const renderBloquerPage = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center mb-6">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
            cardStatus === 'active' ? 'bg-red-100' : 'bg-green-100'
          }`}>
            {cardStatus === 'active' ? (
              <Lock className="text-red-600" size={40} />
            ) : (
              <Unlock className="text-green-600" size={40} />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {cardStatus === 'active' ? 'Bloquer votre carte' : 'Débloquer votre carte'}
          </h2>
          <p className="text-gray-600">
            {cardStatus === 'active' 
              ? 'Votre carte sera immédiatement bloquée et inutilisable'
              : 'Votre carte sera réactivée immédiatement'}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-amber-600" size={24} />
            <div className="text-sm text-gray-700">
              {cardStatus === 'active' ? (
                <>
                  <p className="font-medium mb-2">En bloquant votre carte :</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Tous les paiements seront refusés</li>
                    <li>Les retraits seront impossibles</li>
                    <li>Vous pourrez la débloquer à tout moment</li>
                  </ul>
                </>
              ) : (
                <>
                  <p className="font-medium mb-2">En débloquant votre carte :</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Les paiements seront à nouveau autorisés</li>
                    <li>Les retraits seront possibles</li>
                    <li>Vos plafonds habituels s'appliqueront</li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>

        <button 
          onClick={() => {
            setCardStatus(cardStatus === 'active' ? 'blocked' : 'active');
            setTimeout(() => navigate('cartes'), 1500);
          }}
          className={`w-full py-4 rounded-xl font-medium transition flex items-center justify-center gap-2 ${
            cardStatus === 'active' 
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {cardStatus === 'active' ? <Lock size={20} /> : <Unlock size={20} />}
          {cardStatus === 'active' ? 'Bloquer ma carte' : 'Débloquer ma carte'}
        </button>

        <button 
          onClick={() => navigate('cartes')}
          className="w-full mt-3 py-3 text-gray-600 hover:text-gray-800 font-medium"
        >
          Annuler
        </button>
      </div>
    </div>
  );

  const renderPlafondsPage = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Gérer les plafonds</h2>
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="text-lg font-medium text-gray-700">Plafond de retrait</label>
            <span className="text-2xl font-bold text-emerald-600">{plafondRetrait}€</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1000" 
            step="50"
            value={plafondRetrait}
            onChange={(e) => setPlafondRetrait(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>0€</span>
            <span>1000€</span>
          </div>
          <p className="text-sm text-gray-600 mt-3">Limite par jour</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="text-lg font-medium text-gray-700">Plafond de paiement</label>
            <span className="text-2xl font-bold text-emerald-600">{plafondPaiement}€</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="5000" 
            step="100"
            value={plafondPaiement}
            onChange={(e) => setPlafondPaiement(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>0€</span>
            <span>5000€</span>
          </div>
          <p className="text-sm text-gray-600 mt-3">Limite par semaine</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600" size={20} />
            <p className="text-sm text-blue-900">
              Les modifications sont appliquées immédiatement. Vous pouvez ajuster vos plafonds à tout moment.
            </p>
          </div>
        </div>

        <button 
          onClick={() => navigate('cartes')}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-medium transition flex items-center justify-center gap-2"
        >
          <Check size={20} />
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );

  const renderPaiementEtrangerPage = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-blue-100 mx-auto rounded-full flex items-center justify-center mb-4">
            <Globe className="text-blue-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Paiement à l'étranger</h2>
          <p className="text-gray-600">Gérez l'utilisation de votre carte hors zone euro</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Paiements internationaux</h3>
              <p className="text-sm text-gray-600">
                {paiementEtranger ? 'Activés' : 'Désactivés'}
              </p>
            </div>
            <button 
              onClick={() => setPaiementEtranger(!paiementEtranger)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                paiementEtranger ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                paiementEtranger ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-amber-50 rounded-lg p-4">
            <h4 className="font-medium text-amber-900 mb-2">Frais applicables</h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Paiements : 2% du montant (min 2€)</li>
              <li>• Retraits : 3% du montant (min 3€)</li>
              <li>• Taux de change : selon cours interbancaire</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Zones couvertes</h4>
            <p className="text-sm text-blue-800">
              Plus de 200 pays acceptent votre carte. Les paiements sont automatiquement convertis dans la devise locale.
            </p>
          </div>
        </div>

        <button 
          onClick={() => navigate('cartes')}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-medium transition"
        >
          Retour à mes cartes
        </button>
      </div>
    </div>
  );

  const renderCodePinPage = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-purple-100 mx-auto rounded-full flex items-center justify-center mb-4">
            <Key className="text-purple-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Code PIN</h2>
          <p className="text-gray-600">Gérez le code secret de votre carte</p>
        </div>

        <div className="space-y-4">
          <button className="w-full bg-gray-50 hover:bg-gray-100 p-6 rounded-xl transition text-left">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Eye size={24} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Consulter mon code PIN</h3>
                <p className="text-sm text-gray-600">Recevez votre code par SMS sécurisé</p>
              </div>
            </div>
          </button>

          <button className="w-full bg-gray-50 hover:bg-gray-100 p-6 rounded-xl transition text-left">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Settings size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Modifier mon code PIN</h3>
                <p className="text-sm text-gray-600">Changez votre code à 4 chiffres</p>
              </div>
            </div>
          </button>

          <button className="w-full bg-gray-50 hover:bg-gray-100 p-6 rounded-xl transition text-left">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertCircle size={24} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Code oublié ?</h3>
                <p className="text-sm text-gray-600">Demandez un nouveau code PIN</p>
              </div>
            </div>
          </button>
        </div>

        <div className="bg-red-50 rounded-lg p-4 mt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600" size={20} />
            <div className="text-sm text-red-900">
              <p className="font-medium mb-1">Sécurité</p>
              <p>Ne partagez jamais votre code PIN. Votre banque ne vous le demandera jamais par téléphone ou email.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('cartes')}
          className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-medium transition"
        >
          Retour à mes cartes
        </button>
      </div>
    </div>
  );

  const renderCommanderCartePage = () => (
    <div className="space-y-6">
      {!orderSuccess ? (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-emerald-100 mx-auto rounded-full flex items-center justify-center mb-4">
              <CreditCard className="text-emerald-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Commander une nouvelle carte</h2>
            <p className="text-gray-600">Choisissez le type de carte que vous souhaitez</p>
          </div>

          <div className="space-y-4 mb-6">
            <button className="w-full bg-gray-50 hover:bg-gray-100 p-6 rounded-xl transition text-left border-2 border-transparent hover:border-emerald-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="text-white" size={32} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Carte Standard</h3>
                    <p className="text-sm text-gray-600">Carte internationale</p>
                    <p className="text-xs text-emerald-600 mt-1 font-medium">Gratuite</p>
                  </div>
                </div>
                <ArrowLeft className="text-gray-400 transform rotate-180" size={20} />
              </div>
            </button>

            <button className="w-full bg-gray-50 hover:bg-gray-100 p-6 rounded-xl transition text-left border-2 border-transparent hover:border-emerald-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                    <CreditCard className="text-white" size={32} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Carte Gold</h3>
                    <p className="text-sm text-gray-600">Carte prestige avec services exclusifs</p>
                    <p className="text-xs text-gray-600 mt-1 font-medium">15€/an</p>
                  </div>
                </div>
                <ArrowLeft className="text-gray-400 transform rotate-180" size={20} />
              </div>
            </button>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-blue-600" size={20} />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-2">Informations importantes :</p>
                <ul className="space-y-1">
                  <li>• Délai de livraison : 5-7 jours ouvrés</li>
                  <li>• Livraison à votre adresse postale</li>
                  <li>• Code PIN envoyé séparément par courrier</li>
                  <li>• Activation immédiate dès réception</li>
                </ul>
              </div>
            </div>
          </div>

          <button 
            onClick={() => {
              setOrderSuccess(true);
              setTimeout(() => {
                setOrderSuccess(false);
                navigate('cartes');
              }, 3000);
            }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-medium transition flex items-center justify-center gap-2"
          >
            <Check size={20} />
            Confirmer la commande
          </button>

          <button 
            onClick={() => navigate('cartes')}
            className="w-full mt-3 py-3 text-gray-600 hover:text-gray-800 font-medium"
          >
            Annuler
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 mx-auto rounded-full flex items-center justify-center mb-4">
              <Check className="text-green-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Commande confirmée !</h2>
            <p className="text-gray-600 mb-6">
              Votre nouvelle carte sera livrée sous 5-7 jours ouvrés à l'adresse suivante :
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="font-medium text-gray-800">{currentUser.name}</p>
              <p className="text-sm text-gray-600 mt-1">Adresse postale enregistrée</p>
            </div>
            <p className="text-sm text-gray-600">
              Vous recevrez un email de confirmation avec le suivi de votre commande.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderCartesPage = () => (
    <>
      {/* Carte bancaire */}
      <div className="space-y-6 mb-6 max-w-md mx-auto">
        <div className="relative">
          <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16"></div>
            
            {/* Badge Bloquée si compte bloqué */}
            {currentUser.isBlocked && (
              <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg z-20">
                <Lock size={12} />
                BLOQUÉE
              </div>
            )}
            
            <div className="relative z-10">
              {/* Logo BNP en haut */}
              <div className="flex items-start justify-between mb-12">
                <img 
                  src="/images/logo bnp.jpeg" 
                  alt="BNP Paribas" 
                  className="h-12 object-contain"
                />
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <p className="font-mono text-xl tracking-wider">
                    {showCardNumber ? card.fullNumber : card.number}
                  </p>
                </div>
                <button 
                  onClick={() => setShowCardNumber(!showCardNumber)}
                  className="p-2 hover:bg-white/20 rounded-lg transition ml-2"
                >
                  {showCardNumber ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-70 mb-1">Titulaire</p>
                  <p className="font-medium">{currentUser.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-70 mb-1">Expire</p>
                  <p className="font-medium">{card.expiry}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 -mt-4 pt-8">
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('bloquer-carte')}
                className="flex flex-col items-center gap-3 p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition"
              >
                {cardStatus === 'active' ? (
                  <Lock className="text-emerald-700" size={40} />
                ) : (
                  <Unlock className="text-emerald-700" size={40} />
                )}
                <span className="text-base font-medium text-gray-800">
                  {cardStatus === 'active' ? 'Bloquer' : 'Débloquer'}
                </span>
              </button>
              
              <button 
                onClick={() => navigate('plafonds')}
                className="flex flex-col items-center gap-3 p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition"
              >
                <Settings className="text-emerald-700" size={40} />
                <span className="text-base font-medium text-gray-800">Plafonds</span>
              </button>
              
              <button 
                onClick={() => navigate('paiement-etranger')}
                className="flex flex-col items-center gap-3 p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition"
              >
                <Globe className="text-emerald-700" size={40} />
                <span className="text-base font-medium text-gray-800 text-center">Paiement à l'étranger</span>
              </button>
              
              <button 
                onClick={() => navigate('code-pin')}
                className="flex flex-col items-center gap-3 p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition"
              >
                <Key className="text-emerald-700" size={40} />
                <span className="text-base font-medium text-gray-800">Code PIN</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={() => navigate('commander-carte')}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-medium transition flex items-center justify-center gap-2 shadow-sm"
      >
        <Plus size={20} />
        Commander une nouvelle carte
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => currentPage === 'cartes' ? (navigateProp ? navigateProp('dashboard') : null) : navigate('cartes')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={20} />
              <span>Retour</span>
            </button>
            <h1 className="text-xl font-bold text-gray-800">Mes cartes</h1>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Plus size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 mt-20 pb-24">
        {currentPage === 'cartes' && renderCartesPage()}
        {currentPage === 'bloquer-carte' && renderBloquerPage()}
        {currentPage === 'plafonds' && renderPlafondsPage()}
        {currentPage === 'paiement-etranger' && renderPaiementEtrangerPage()}
        {currentPage === 'code-pin' && renderCodePinPage()}
        {currentPage === 'commander-carte' && renderCommanderCartePage()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
        <div className="max-w-4xl mx-auto px-2">
          <div className="flex items-center justify-around">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex flex-col items-center gap-1 py-3 px-4 transition ${
                  activeTab === item.id
                    ? 'text-emerald-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <item.icon size={24} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}