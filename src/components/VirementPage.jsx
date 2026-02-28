// components/VirementPage.jsx - AVEC VÉRIFICATION DE BLOCAGE

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/UserService';
import emailjs from '@emailjs/browser';
import { 
  ArrowLeft, Send, User, CreditCard, Euro, MessageSquare,
  Wallet, Clock, ArrowLeftRight, FileText, Mail, Building2, AlertCircle, Loader2, Lock
} from 'lucide-react';

export default function VirementPage({ navigate, onVirementSuccess }) {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('virement');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  
  const [formData, setFormData] = useState({
    beneficiaire: '',
    iban: '',
    bic: '',
    email: '',
    montant: '',
    motif: '',
  });

  useEffect(() => {
    console.log('🔒 Vérification utilisateur:', user);
    if (!user) {
      console.warn('⚠️ Pas d\'utilisateur connecté, redirection vers login');
      navigate('login');
    }
  }, []);

  const menuItems = [
    { id: 'solde', icon: Wallet, label: 'Solde' },
    { id: 'historique', icon: Clock, label: 'Historique' },
    { id: 'virement', icon: ArrowLeftRight, label: 'Virement' },
    { id: 'cartes', icon: CreditCard, label: 'Cartes' },
    { id: 'rib', icon: FileText, label: 'RIB' },
  ];

  const handleTabClick = (tabId) => {
    console.log('📍 Navigation vers:', tabId);
    setActiveTab(tabId);
    if (tabId === 'solde') {
      navigate('dashboard');
    } else {
      navigate(tabId);
    }
  };

  const validateIBAN = (iban) => {
    const cleanIban = iban.replace(/\s/g, '');
    const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/;
    
    if (!ibanRegex.test(cleanIban)) return false;
    
    const countryLengths = {
      'FR': 27, 'CI': 28, 'BE': 16, 'DE': 22, 
      'ES': 24, 'IT': 27, 'GB': 22,
    };
    
    const country = cleanIban.substring(0, 2);
    const expectedLength = countryLengths[country];
    
    if (expectedLength && cleanIban.length !== expectedLength) return false;
    
    return true;
  };

  const validateBIC = (bic) => {
    const bicRegex = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
    const cleanBic = bic.replace(/\s/g, '').toUpperCase();
    return bicRegex.test(cleanBic);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 === DÉBUT DU VIREMENT ===');
    console.log('👤 User actuel:', user);
    console.log('🔒 Compte bloqué ?', user?.isBlocked);
    console.log('✅ Peut virer même bloqué ?', user?.canTransferWhenBlocked);
    
    // ⚡ VÉRIFICATION DU BLOCAGE : bloqué ET pas d'autorisation spéciale
    if (user?.isBlocked && !user?.canTransferWhenBlocked) {
      console.log('❌ Compte bloqué sans autorisation ! Affichage du modal');
      setShowBlockedModal(true);
      return;
    }
    
    const newErrors = {};

    // Validations
    if (!formData.beneficiaire.trim()) {
      newErrors.beneficiaire = 'Le nom du bénéficiaire est requis';
    } else if (formData.beneficiaire.trim().length < 3) {
      newErrors.beneficiaire = 'Le nom doit contenir au moins 3 caractères';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.iban.trim()) {
      newErrors.iban = 'L\'IBAN est requis';
    } else if (!validateIBAN(formData.iban)) {
      newErrors.iban = 'Format d\'IBAN invalide';
    }

    if (!formData.bic.trim()) {
      newErrors.bic = 'Le code BIC/SWIFT est requis';
    } else if (!validateBIC(formData.bic)) {
      newErrors.bic = 'Format de BIC/SWIFT invalide (8 ou 11 caractères)';
    }

    const montant = parseFloat(formData.montant);
    if (!formData.montant) {
      newErrors.montant = 'Le montant est requis';
    } else if (isNaN(montant) || montant <= 0) {
      newErrors.montant = 'Le montant doit être supérieur à 0';
    } else if (montant > (user?.balance || 0)) {
      newErrors.montant = 'Solde insuffisant';
    }

    if (Object.keys(newErrors).length > 0) {
      console.log('❌ Erreurs de validation:', newErrors);
      setErrors(newErrors);
      return;
    }

    console.log('✅ Validation OK');
    setLoading(true);

    try {
      console.log('💾 Appel UserService.createTransfer()...');
      
      const transferResult = await userService.createTransfer(user.id, {
        amount: montant,
        iban: formData.iban,
        bic: formData.bic,
        beneficiary: formData.beneficiaire,
        email: formData.email,
        motif: formData.motif
      });

      console.log('✅ Virement enregistré dans UserService:', transferResult);

      const updatedUser = await userService.getUserById(user.id);
      console.log('👤 Utilisateur mis à jour récupéré:', updatedUser);

      if (updateUser) {
        updateUser(updatedUser);
        console.log('✅ Contexte mis à jour');
      }

      const reference = `VIR${Date.now()}${Math.floor(Math.random() * 1000)}`;
      const transactionDate = new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const virementData = {
        reference: reference,
        senderName: user?.name || user?.username || 'Client',
        beneficiary: formData.beneficiaire,
        email: formData.email,
        iban: formData.iban,
        bic: formData.bic,
        amount: montant.toFixed(2),
        message: formData.motif || '',
        date: transactionDate
      };

      console.log('💾 Données du virement pour le reçu:', virementData);

      try {
        const templateParams = {
          beneficiaire_nom: formData.beneficiaire,
          beneficiaire_email: formData.email,
          emetteur_nom: virementData.senderName,
          montant: `${montant.toLocaleString('fr-FR', {minimumFractionDigits: 2})} €`,
          reference: reference,
          date: new Date().toLocaleDateString('fr-FR'),
          heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          motif: formData.motif || 'Virement bancaire',
          iban: formData.iban,
          bic: formData.bic,
          frais: '0.00 €',
          total: `${montant.toLocaleString('fr-FR', {minimumFractionDigits: 2})} €`
        };

        console.log('📧 Tentative d\'envoi email...');
        
        await emailjs.send(
          'service_6lnids6',
          'template_kszelhf',
          templateParams,
          's0N4AR3th7wPYUFyy'
        );
        
        console.log('✅ Email envoyé avec succès');
      } catch (emailError) {
        console.warn('⚠️ Erreur EmailJS (non bloquante):', emailError.message);
      }

      console.log('🧹 Réinitialisation du formulaire');
      setFormData({
        beneficiaire: '',
        iban: '',
        bic: '',
        email: '',
        montant: '',
        motif: '',
      });

      console.log('🔄 Exécution du callback...');
      if (onVirementSuccess && typeof onVirementSuccess === 'function') {
        try {
          onVirementSuccess(virementData);
          console.log('✅ Callback exécuté avec succès');
        } catch (callbackError) {
          console.error('❌ Erreur dans le callback:', callbackError);
        }
      }

      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('🚀 Navigation vers la page reçu...');
      navigate('recu');
      
      console.log('✅ === FIN DU VIREMENT (succès) ===');

    } catch (error) {
      console.error('❌ === ERREUR CRITIQUE ===');
      console.error('Type:', error.name);
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
      alert(`❌ Erreur lors du virement: ${error.message}\n\nVeuillez réessayer.`);
    } finally {
      setLoading(false);
      console.log('🏁 Loading terminé');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirection...</p>
        </div>
      </div>
    );
  }

  const recentBeneficiaries = [
    { 
      id: 1, 
      name: 'Sophie Martin', 
      email: 'sophie.martin@example.com',
      iban: 'FR76 3000 4000 0100 0123 4567 657', 
      bic: 'BNPAFRPPXXX',
      avatar: 'SM' 
    },
    { 
      id: 2, 
      name: 'Jean Dupont', 
      email: 'jean.dupont@example.com',
      iban: 'FR89 3000 4000 0200 0234 5678 234', 
      bic: 'BNPAFRPPXXX',
      avatar: 'JD' 
    },
    { 
      id: 3, 
      name: 'Marie Leroux', 
      email: 'marie.leroux@example.com',
      iban: 'FR45 3000 4000 0300 0345 6789 891', 
      bic: 'BNPAFRPPXXX',
      avatar: 'ML' 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ⚡ MODAL DE BLOCAGE — affiché uniquement si bloqué SANS autorisation spéciale */}
      {showBlockedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                  <Lock className="text-red-600" size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Compte bloqué</h2>
                  <p className="text-sm text-gray-500">Virement impossible</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Bonjour <span className="font-semibold">{user.name}</span>,
              </p>
              <p className="text-gray-600 mb-4">
                Votre compte est actuellement <span className="font-bold text-red-600">bloqué</span>. Vous ne pouvez pas effectuer de virement pour le moment.
              </p>

              {user.blockReason && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-blue-900 mb-1">Raison :</p>
                  <p className="text-sm text-blue-800">{user.blockReason}</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Frais de déblocage :</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    {user.unlockFee?.toLocaleString('fr-FR', { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2 
                    })} €
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowBlockedModal(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition"
              >
                J'ai compris
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Contactez votre conseiller pour débloquer votre compte
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={20} />
              <span>Retour</span>
            </button>
            <h1 className="text-xl font-bold text-gray-800">Virement</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Contenu */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Solde disponible */}
        <div className="bg-emerald-600 rounded-xl p-6 text-white mb-6 shadow-lg">
          <p className="text-emerald-100 text-sm mb-1">Solde disponible</p>
          <h2 className="text-3xl font-bold">
            {user?.balance?.toLocaleString('fr-FR', { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 
            })} €
          </h2>
        </div>

        {/* ⚡ Bannière info si compte bloqué mais autorisé à virer */}
        {user?.isBlocked && user?.canTransferWhenBlocked && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-yellow-500 mt-0.5 shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-yellow-800">Compte en cours de vérification</p>
              <p className="text-xs text-yellow-700 mt-1">
                Votre compte est temporairement restreint, mais les virements restent disponibles.
              </p>
            </div>
          </div>
        )}

        {/* Bénéficiaires récents */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Bénéficiaires récents</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {recentBeneficiaries.map(beneficiary => (
              <button
                key={beneficiary.id}
                onClick={() => setFormData({ 
                  beneficiaire: beneficiary.name,
                  email: beneficiary.email,
                  iban: beneficiary.iban,
                  bic: beneficiary.bic,
                  montant: '',
                  motif: ''
                })}
                className="flex flex-col items-center gap-2 min-w-80px hover:opacity-80 transition"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-bold">{beneficiary.avatar}</span>
                </div>
                <span className="text-xs text-gray-600 text-center">{beneficiary.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Nouveau virement</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Bénéficiaire */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline mr-2" size={16} />
                Bénéficiaire *
              </label>
              <input
                type="text"
                name="beneficiaire"
                value={formData.beneficiaire}
                onChange={handleChange}
                placeholder="Nom du bénéficiaire"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.beneficiaire ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.beneficiaire && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.beneficiaire}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline mr-2" size={16} />
                Email du destinataire *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="exemple@email.com"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.email}
                </p>
              )}
            </div>

            {/* IBAN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="inline mr-2" size={16} />
                IBAN *
              </label>
              <input
                type="text"
                name="iban"
                value={formData.iban}
                onChange={handleChange}
                placeholder="FR76 3000 4000 0100 0123 4567 890"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono ${
                  errors.iban ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.iban && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.iban}
                </p>
              )}
            </div>

            {/* BIC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 className="inline mr-2" size={16} />
                Code BIC/SWIFT *
              </label>
              <input
                type="text"
                name="bic"
                value={formData.bic}
                onChange={handleChange}
                placeholder="BNPAFRPPXXX"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono uppercase ${
                  errors.bic ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength="11"
              />
              {errors.bic && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.bic}
                </p>
              )}
            </div>

            {/* Montant */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Euro className="inline mr-2" size={16} />
                Montant *
              </label>
              <input
                type="number"
                name="montant"
                value={formData.montant}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                max={user?.balance || 0}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.montant ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.montant && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.montant}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Maximum: {user?.balance?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
              </p>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="inline mr-2" size={16} />
                Message (optionnel)
              </label>
              <textarea
                name="motif"
                value={formData.motif}
                onChange={handleChange}
                placeholder="Motif du virement"
                rows="3"
                maxLength="140"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              />
              <p className="mt-1 text-xs text-gray-500 text-right">
                {formData.motif.length}/140
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Effectuer le virement
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Navigation */}
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

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}