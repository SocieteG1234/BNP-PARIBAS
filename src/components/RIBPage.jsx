import React, { useState } from 'react';
import { 
  ArrowLeft, Download, Share2, Copy, CheckCircle,
  Wallet, Clock, ArrowLeftRight, CreditCard, FileText
} from 'lucide-react';

export default function RIBPage({ user, navigate }) {
  const [activeTab, setActiveTab] = useState('rib');
  const [copied, setCopied] = useState(false);

  // Utilisateur par défaut pour la démo
  const defaultUser = {
    id: 1,
    name: 'MARIE-FRANÇOISE BOIGNON',
    accountNumber: '20250000011',
    rib: {
      iban: 'FR76 3000 4000 0100 0123 4567 890',
      bankCode: '30004',
      branchCode: '00001',
      accountNumber: '00123456789',
      key: '90'
    }
  };

  const currentUser = user || defaultUser;

  const menuItems = [
    { id: 'solde', icon: Wallet, label: 'Solde' },
    { id: 'historique', icon: Clock, label: 'Historique' },
    { id: 'virement', icon: ArrowLeftRight, label: 'Virement' },
    { id: 'cartes', icon: CreditCard, label: 'Cartes' },
    { id: 'rib', icon: FileText, label: 'RIB' },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (navigate) navigate(tabId);
  };

  // Récupérer les informations bancaires de l'utilisateur
  const getBankInfo = (user) => {
    const bankCode = '30004';
    const swift = 'BNPAFRPPXXX';
    const bankName = 'BMCI-BNP Paribas';
    
    if (user.rib && user.rib.iban) {
      return {
        bankName,
        accountHolder: user.name,
        iban: user.rib.iban,
        swift,
        accountNumber: user.accountNumber,
        bankCode: user.rib.bankCode || bankCode,
        branchCode: user.rib.branchCode,
        accountKey: user.rib.key,
        countryCode: user.rib.iban.substring(0, 2)
      };
    }
    
    return {
      bankName,
      accountHolder: user.name,
      iban: 'Non défini',
      swift,
      accountNumber: user.accountNumber,
      bankCode,
      branchCode: 'N/A',
      accountKey: 'N/A',
      countryCode: 'XX'
    };
  };

  const bankInfo = getBankInfo(currentUser);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    // Créer un canvas pour générer le PDF
    const canvas = document.createElement('canvas');
    canvas.width = 595;
    canvas.height = 842;
    const ctx = canvas.getContext('2d');

    // Fond blanc
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header vert avec dégradé
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 120);
    gradient.addColorStop(0, '#059669');
    gradient.addColorStop(1, '#0d9488');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, 120);

    // Titre (sans logo)
    ctx.fillStyle = 'white';
    ctx.font = 'bold 28px Arial';
    ctx.fillText(bankInfo.bankName, 40, 60);
    
    ctx.font = '16px Arial';
    ctx.fillText('Relevé d\'Identité Bancaire', 40, 85);

    // Contenu
    let y = 160;

    // Titulaire
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.fillText('TITULAIRE DU COMPTE', 40, y);
    
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(bankInfo.accountHolder, 40, y + 25);

    y += 60;

    // IBAN
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.fillText('IBAN (INTERNATIONAL BANK ACCOUNT NUMBER)', 40, y);
    
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(40, y + 5, 515, 35);
    ctx.fillStyle = '#1f2937';
    ctx.font = '16px Courier New';
    ctx.fillText(bankInfo.iban, 50, y + 28);

    y += 60;

    // SWIFT
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.fillText('CODE SWIFT/BIC', 40, y);
    
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(40, y + 5, 515, 35);
    ctx.fillStyle = '#1f2937';
    ctx.font = '16px Courier New';
    ctx.fillText(bankInfo.swift, 50, y + 28);

    y += 70;

    // Ligne de séparation
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(555, y);
    ctx.stroke();

    y += 25;

    // Détails du compte
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.fillText('DÉTAILS DU COMPTE', 40, y);

    y += 25;

    // Grid 2x2
    const gridData = [
      { label: 'Code banque', value: bankInfo.bankCode, x: 40 },
      { label: 'Code guichet', value: bankInfo.branchCode, x: 310 },
      { label: 'Numéro de compte', value: bankInfo.accountNumber, x: 40 },
      { label: 'Clé RIB', value: bankInfo.accountKey, x: 310 }
    ];

    gridData.forEach((item, index) => {
      const yPos = y + Math.floor(index / 2) * 50;
      
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px Arial';
      ctx.fillText(item.label, item.x, yPos);
      
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(item.x, yPos + 5, 235, 30);
      ctx.fillStyle = '#1f2937';
      ctx.font = '14px Courier New';
      ctx.fillText(item.value, item.x + 10, yPos + 25);
    });

    y += 130;

    // Footer
    ctx.strokeStyle = '#e5e7eb';
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(555, y);
    ctx.stroke();

    y += 25;

    ctx.fillStyle = '#6b7280';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      `Document généré le ${new Date().toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })}`,
      canvas.width / 2,
      y
    );
    ctx.fillText(
      'Ce RIB peut être utilisé pour effectuer des virements bancaires.',
      canvas.width / 2,
      y + 20
    );

    // Convertir en PNG et télécharger
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `RIB_${currentUser.name.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const handleShare = async () => {
    const text = `RIB - ${bankInfo.accountHolder}\n\nIBAN: ${bankInfo.iban}\nSWIFT: ${bankInfo.swift}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mon RIB',
          text: text,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopy(text);
        }
      }
    } else {
      handleCopy(text);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate && navigate('dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={20} />
              <span>Retour</span>
            </button>
            <h1 className="text-xl font-bold text-gray-800">Mon RIB</h1>
            <div className="flex gap-2">
              <button 
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="Partager"
              >
                <Share2 size={20} className="text-gray-600" />
              </button>
              <button 
                onClick={handleDownload}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="Télécharger"
              >
                <Download size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* RIB Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          {/* En-tête avec logo */}
          <div className="bg-emerald-600 to-teal-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="font-bold text-lg">{bankInfo.bankName}</h2>
                  <p className="text-xs opacity-90">Relevé d'Identité Bancaire</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informations du compte */}
          <div className="p-6 space-y-6">
            {/* Titulaire */}
            <div>
              <p className="text-xs text-gray-500 mb-1 uppercase">Titulaire du compte</p>
              <p className="text-lg font-bold text-gray-800">{bankInfo.accountHolder}</p>
            </div>

            {/* IBAN */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 uppercase">IBAN ({bankInfo.countryCode})</p>
                <button
                  onClick={() => handleCopy(bankInfo.iban)}
                  className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-xs font-medium transition"
                >
                  {copied ? (
                    <>
                      <CheckCircle size={14} />
                      Copié
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copier
                    </>
                  )}
                </button>
              </div>
              <p className="font-mono text-base text-gray-800 bg-gray-50 p-3 rounded-lg">
                {bankInfo.iban}
              </p>
            </div>

            {/* SWIFT */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 uppercase">Code SWIFT/BIC</p>
                <button
                  onClick={() => handleCopy(bankInfo.swift)}
                  className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-xs font-medium transition"
                >
                  <Copy size={14} />
                  Copier
                </button>
              </div>
              <p className="font-mono text-base text-gray-800 bg-gray-50 p-3 rounded-lg">
                {bankInfo.swift}
              </p>
            </div>

            {/* Détails du compte */}
            <div className="border-t pt-4">
              <p className="text-xs text-gray-500 mb-3 uppercase">Détails du compte</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Code banque</p>
                  <p className="font-mono text-sm text-gray-800">{bankInfo.bankCode}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Code guichet</p>
                  <p className="font-mono text-sm text-gray-800">{bankInfo.branchCode}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">N° de compte</p>
                  <p className="font-mono text-sm text-gray-800">{bankInfo.accountNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Clé RIB</p>
                  <p className="font-mono text-sm text-gray-800">{bankInfo.accountKey}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={handleDownload}
            className="bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-medium transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Download size={20} />
            Télécharger
          </button>
          <button 
            onClick={handleShare}
            className="bg-white hover:bg-gray-50 text-gray-800 py-4 rounded-xl font-medium transition flex items-center justify-center gap-2 shadow-sm border border-gray-200"
          >
            <Share2 size={20} />
            Partager
          </button>
        </div>

        {/* Informations supplémentaires */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">

          
        </div>
      </main>

      {/* Navigation inférieure */}
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