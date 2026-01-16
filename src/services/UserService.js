// services/UserService.js - AVEC SYSTÈME DE VERSION
// ⚡ Changez DATA_VERSION chaque fois que vous modifiez getDefaultUsers()

const DEV_MODE = true;
const STORAGE_KEY = 'bnp_users_data';
const DATA_VERSION = 7  ; // ⚡ INCRÉMENTER CE NUMÉRO À CHAQUE MODIFICATION

class UserService {
  constructor() {
    if (DEV_MODE) console.log('🔧 UserService initialisé - Version', DATA_VERSION);
    this.loadFromStorage();
    this.managers = [
      'Charles Fortunato',
      'Sophie Martin', 
      'Pierre Dubois',
      'Marie Lefebvre',
      'Thomas Bernard',
      'Claire Rousseau',
      'Lucien Vollet',
      'Luc Vollet'
    ];
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedVersion = localStorage.getItem(STORAGE_KEY + '_version');
      
      // ⚡ Vérifier la version - Si différente, réinitialiser automatiquement
      if (stored && storedVersion === String(DATA_VERSION)) {
        this.users = JSON.parse(stored);
        if (DEV_MODE) console.log('📦 Chargé depuis localStorage:', this.users.length, 'utilisateurs');
      } else {
        if (storedVersion && storedVersion !== String(DATA_VERSION)) {
          if (DEV_MODE) console.log('🔄 Nouvelle version détectée (' + storedVersion + ' → ' + DATA_VERSION + '), réinitialisation...');
        } else {
          if (DEV_MODE) console.log('🆕 Première initialisation');
        }
        this.users = this.getDefaultUsers();
        this.saveToStorage();
      }
    } catch (error) {
      if (DEV_MODE) console.error('❌ Erreur chargement:', error);
      this.users = this.getDefaultUsers();
      this.saveToStorage();
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.users));
      localStorage.setItem(STORAGE_KEY + '_version', String(DATA_VERSION));
      if (DEV_MODE) console.log('💾 Sauvegardé (version ' + DATA_VERSION + ')');
    } catch (error) {
      if (DEV_MODE) console.error('❌ Erreur sauvegarde:', error);
    }
  }

  resetToDefault() {
    if (DEV_MODE) console.log('🔄 Réinitialisation manuelle des données');
    this.users = this.getDefaultUsers();
    this.saveToStorage();
  }

  getDefaultUsers() {
    return [
      { 
        id: 1, 
        username: '07014860451', 
        password: '260823', 
        name: 'Delphine Broussard', 
        email: 'tendrea447@gmail.com',
        phone: '+33 07 74 52 52 87',
        accountNumber: '20250000002',
        country: 'France',
        city: 'Brest',
        location: 'Brest, France',
        manager: 'Lucien Vollet',
        balance: 3500000.00,
        isBlocked: false,
        unlockFee: 25000.00,
        blockReason: null,
        rib: {
          iban: 'FR76 3000 5000 0102 0123 4567 880',
          bankCode: '30004',
          branchCode: '00001',
          accountNumber: '00123456789',
          key: '80'
        },
        cards: [
          {
            id: 1,
            type: 'Visa Premier',
            cardNumber: '4532 0001 7892 2345',
            maskedNumber: '4532 **** **** 2345',
            cvv: '123',
            expiryDate: '10/27',
            status: 'active',
            dailyWithdrawalLimit: 500,
            weeklyPaymentLimit: 2000,
            internationalPaymentEnabled: true,
            issueDate: '12/2022',
            cardHolder: 'DELPHINE BROUSSARD'
          }
        ],
        accounts: [
          { id: 1, type: 'Compte Courant', number: 'N°*******2284', balance: 3500000.00, icon: 'wallet' },
          { id: 2, type: 'Livret A', number: 'N°*******5462', balance: 30000.40, icon: 'piggybank' },
          { id: 3, type: 'Plan Épargne', number: 'N°*******8891', balance: 50000.17, icon: 'trending' }
        ],
        transactions: [
          { id: 1, type: 'Virement entrant', date: '02 Déc 2025', reference: 'IE28 *** 513', amount: 40000.00, isCredit: true },
          { id: 2, type: 'Achat carte', date: '04 Déc 2025', reference: 'CARREFOUR BREST', amount: 85.50, isCredit: false },
          { id: 3, type: 'Virement sortant', date: '25 Nov 2025', reference: 'FR76 *** 657', amount: 1200.00, isCredit: false },
          { id: 4, type: 'Virement entrant', date: '12 Nov 2025', reference: 'US45 *** 234', amount: 3000.00, isCredit: true },
          { id: 5, type: 'Achat carte', date: '11 Déc 2024', reference: 'UBER BREST', amount: 45.20, isCredit: false },
          { id: 6, type: 'Retrait ATM', date: '10 Déc 2024', reference: 'ATM BNP BREST', amount: 100.00, isCredit: false },
          { id: 7, type: 'Virement entrant', date: '08 Déc 2024', reference: 'FR45 *** 891', amount: 500.00, isCredit: true },
          { id: 8, type: 'Achat carte', date: '07 Déc 2024', reference: 'FNAC BREST', amount: 156.80, isCredit: false },
          { id: 9, type: 'Retrait ATM', date: '05 Déc 2024', reference: 'ATM BNP GARE', amount: 200.00, isCredit: false },
          { id: 10, type: 'Achat carte', date: '03 Déc 2024', reference: 'AMAZON FRANCE', amount: 67.99, isCredit: false }
        ],
        expenses: {
          month: 'Décembre 2024',
          categories: [
            { name: 'Logement', value: 45, color: '#3B82F6' },
            { name: 'Alimentation', value: 25, color: '#10B981' },
            { name: 'Transport', value: 10, color: '#F97316' },
            { name: 'Loisirs', value: 12, color: '#6366F1' },
            { name: 'Autres', value: 8, color: '#D1D5DB' }
          ]
        },
        chequier: 5,
        virementRapide: 10,
        virementProgramme: 3
      },
      { 
        id: 2, 
        username: '07014860452', 
        password: '260823', 
        name: 'Caroline Dupont', 
        email: 'coraline.dupont7708@gmail.com',
        phone: '+33 07 74 52 52 87',
        accountNumber: '20250000002',
        country: 'France',
        city: 'Brest',
        location: 'Brest, France',
        manager: 'Lucien Vollet',
        balance: 800000.00,
        isBlocked: true,
        unlockFee: 8000.00,
        blockReason: null,
        rib: {
          iban: 'FR76 3000 5000 0102 0123 4567 880',
          bankCode: '30004',
          branchCode: '00001',
          accountNumber: '00123456789',
          key: '80'
        },
        cards: [
          {
            id: 1,
            type: 'Visa Premier',
            cardNumber: '4532 0001 7892 2345',
            maskedNumber: '4532 **** **** 2345',
            cvv: '123',
            expiryDate: '10/27',
            status: 'active',
            dailyWithdrawalLimit: 500,
            weeklyPaymentLimit: 2000,
            internationalPaymentEnabled: true,
            issueDate: '12/2022',
            cardHolder: 'Caroline Dupont'
          }
        ],
        accounts: [
          { id: 1, type: 'Compte Courant', number: 'N°*******2284', balance: 800000.00, icon: 'wallet' },
          { id: 2, type: 'Livret A', number: 'N°*******5462', balance: 30000.40, icon: 'piggybank' },
          { id: 3, type: 'Plan Épargne', number: 'N°*******8891', balance: 40000.17, icon: 'trending' }
        ],
        transactions: [
          { id: 1, type: 'Virement entrant', date: '02 Déc 2024', reference: 'IE28 *** 513', amount: 4000.00, isCredit: true },
          { id: 2, type: 'Achat carte', date: '04 Déc 2024', reference: 'CARREFOUR BREST', amount: 85.50, isCredit: false },
          { id: 3, type: 'Virement sortant', date: '25 Nov 2024', reference: 'FR76 *** 657', amount: 1200.00, isCredit: false },
          { id: 4, type: 'Virement entrant', date: '12 Nov 2024', reference: 'US45 *** 234', amount: 3000.00, isCredit: true },
          { id: 5, type: 'Achat carte', date: '11 Déc 2024', reference: 'UBER BREST', amount: 45.20, isCredit: false },
          { id: 6, type: 'Retrait ATM', date: '10 Déc 2023', reference: 'ATM BNP BREST', amount: 100.00, isCredit: false },
          { id: 7, type: 'Virement entrant', date: '08 Déc 2023', reference: 'FR45 *** 891', amount: 500.00, isCredit: true },
          { id: 8, type: 'Achat carte', date: '07 Déc 2023', reference: 'FNAC BREST', amount: 156.80, isCredit: false },
          { id: 9, type: 'Retrait ATM', date: '05 Déc 2023', reference: 'ATM BNP GARE', amount: 200.00, isCredit: false },
          { id: 10, type: 'Achat carte', date: '03 Déc 2023', reference: 'AMAZON FRANCE', amount: 67.99, isCredit: false }
        ],
        expenses: {
          month: 'Décembre 2024',
          categories: [
            { name: 'Logement', value: 45, color: '#3B82F6' },
            { name: 'Alimentation', value: 25, color: '#10B981' },
            { name: 'Transport', value: 10, color: '#F97316' },
            { name: 'Loisirs', value: 12, color: '#6366F1' },
            { name: 'Autres', value: 8, color: '#D1D5DB' }
          ]
        },
        chequier: 5,
        virementRapide: 10,
        virementProgramme: 3
      },
      { 
        id: 2, 
        username: '07014860455', 
        password: '260821', 
        name: 'Bernadette Lucette', 
        email: 'bernadettelucette445@gmail.com',
        phone: '+33 07 44 52 52 87',
        accountNumber: '20250000002',
        country: 'France',
        city: 'Brest',
        location: 'Brest, France',
        manager: 'Lucien Vollet',
        balance: 894000.00,
        isBlocked: false,
        unlockFee: 8000.00,
        blockReason: null,
        rib: {
          iban: 'FR76 3000 5000 0102 0123 4567 880',
          bankCode: '30004',
          branchCode: '00001',
          accountNumber: '00123456789',
          key: '80'
        },
        cards: [
          {
            id: 1,
            type: 'Visa Premier',
            cardNumber: '4532 0001 7892 2345',
            maskedNumber: '4532 **** **** 2345',
            cvv: '123',
            expiryDate: '10/27',
            status: 'active',
            dailyWithdrawalLimit: 500,
            weeklyPaymentLimit: 2000,
            internationalPaymentEnabled: true,
            issueDate: '12/2022',
            cardHolder: 'Caroline Dupont'
          }
        ],
        accounts: [
          { id: 1, type: 'Compte Courant', number: 'N°*******2284', balance: 894000.00, icon: 'wallet' },
          { id: 2, type: 'Livret A', number: 'N°*******5462', balance: 30000.40, icon: 'piggybank' },
          { id: 3, type: 'Plan Épargne', number: 'N°*******8891', balance: 40000.17, icon: 'trending' }
        ],
        transactions: [
          { id: 1, type: 'Virement entrant', date: '02 Déc 2024', reference: 'IE28 *** 513', amount: 4000.00, isCredit: true },
          { id: 2, type: 'Achat carte', date: '04 Déc 2024', reference: 'CARREFOUR BREST', amount: 85.50, isCredit: false },
          { id: 3, type: 'Virement sortant', date: '25 Nov 2024', reference: 'FR76 *** 657', amount: 1200.00, isCredit: false },
          { id: 4, type: 'Virement entrant', date: '12 Nov 2024', reference: 'US45 *** 234', amount: 3000.00, isCredit: true },
          { id: 5, type: 'Achat carte', date: '11 Déc 2024', reference: 'UBER BREST', amount: 45.20, isCredit: false },
          { id: 6, type: 'Retrait ATM', date: '10 Déc 2023', reference: 'ATM BNP BREST', amount: 100.00, isCredit: false },
          { id: 7, type: 'Virement entrant', date: '08 Déc 2023', reference: 'FR45 *** 891', amount: 500.00, isCredit: true },
          { id: 8, type: 'Achat carte', date: '07 Déc 2023', reference: 'FNAC BREST', amount: 156.80, isCredit: false },
          { id: 9, type: 'Retrait ATM', date: '05 Déc 2023', reference: 'ATM BNP GARE', amount: 200.00, isCredit: false },
          { id: 10, type: 'Achat carte', date: '03 Déc 2023', reference: 'AMAZON FRANCE', amount: 67.99, isCredit: false }
        ],
        expenses: {
          month: 'Décembre 2024',
          categories: [
            { name: 'Logement', value: 45, color: '#3B82F6' },
            { name: 'Alimentation', value: 25, color: '#10B981' },
            { name: 'Transport', value: 10, color: '#F97316' },
            { name: 'Loisirs', value: 12, color: '#6366F1' },
            { name: 'Autres', value: 8, color: '#D1D5DB' }
          ]
        },
        chequier: 5,
        virementRapide: 10,
        virementProgramme: 3
      },
      { 
        id: 1, 
        username: '07014860453', 
        password: '260823', 
        name:'Alexandre Roussel', 
        email: 'Alexandreroussel07050@gmail.com',
        phone: '+33 07 56 84 42 55',
        accountNumber: '20250000002',
        country: 'France',
        city: 'Lyon',
        location: 'Lyon, France',
        manager: 'Lucien Vollet',
        balance: 58600.00,
        isBlocked: false,
        unlockFee: 7000.00,
        blockReason: 'Votre compte est bloqué en raison de plusieurs tentative de connexion echouées. Il sera debloquer dans 72h après verification ',
        rib: {
          iban: 'FR76 3000 5000 0102 0123 4567 880',
          bankCode: '30004',
          branchCode: '00001',
          accountNumber: '00123456789',
          key: '80'
        },
        cards: [
          {
            id: 1,
            type: 'Visa Premier',
            cardNumber: '4532 0001 7892 2345',
            maskedNumber: '4532 **** **** 2345',
            cvv: '123',
            expiryDate: '10/27',
            status: 'blocked',
            dailyWithdrawalLimit: 500,
            weeklyPaymentLimit: 2000,
            internationalPaymentEnabled: true,
            issueDate: '12/2022',
            cardHolder: 'Alexandre Roussel'
          }
        ],
        accounts: [
          { id: 1, type: 'Compte Courant', number: 'N°*******2284', balance: 58600.00, icon: 'wallet' },
          { id: 2, type: 'Livret A', number: 'N°*******5462', balance: 3000.40, icon: 'piggybank' },
          { id: 3, type: 'Plan Épargne', number: 'N°*******8891', balance: 40000.17, icon: 'trending' }
        ],
        transactions: [
          { id: 1, type: 'Virement entrant', date: '02 Déc 2025', reference: 'IE28 *** 513', amount: 4000.00, isCredit: true },
          { id: 2, type: 'Achat carte', date: '04 Déc 2025', reference: 'CARREFOUR BREST', amount: 85.50, isCredit: false },
          { id: 3, type: 'Virement sortant', date: '25 Nov 2025', reference: 'FR76 *** 657', amount: 1200.00, isCredit: false },
          { id: 4, type: 'Virement entrant', date: '12 Nov 2025', reference: 'US45 *** 234', amount: 3000.00, isCredit: true },
          { id: 5, type: 'Achat carte', date: '11 Déc 2025', reference: 'UBER BREST', amount: 45.20, isCredit: false },
          { id: 6, type: 'Retrait ATM', date: '10 Déc 2025', reference: 'ATM BNP BREST', amount: 100.00, isCredit: false },
          { id: 7, type: 'Virement entrant', date: '08 Déc 2025', reference: 'FR45 *** 891', amount: 500.00, isCredit: true },
          { id: 8, type: 'Achat carte', date: '07 Déc 2024', reference: 'FNAC BREST', amount: 156.80, isCredit: false },
          { id: 9, type: 'Retrait ATM', date: '05 Déc 2024', reference: 'ATM BNP GARE', amount: 200.00, isCredit: false },
          { id: 10, type: 'Achat carte', date: '03 Déc 2024', reference: 'AMAZON FRANCE', amount: 67.99, isCredit: false }
        ],
        expenses: {
          month: 'Décembre 2025',
          categories: [
            { name: 'Logement', value: 45, color: '#3B82F6' },
            { name: 'Alimentation', value: 25, color: '#10B981' },
            { name: 'Transport', value: 10, color: '#F97316' },
            { name: 'Loisirs', value: 12, color: '#6366F1' },
            { name: 'Autres', value: 8, color: '#D1D5DB' }
          ]
        },
        chequier: 5,
        virementRapide: 10,
        virementProgramme: 3
      },
      { 
        id: 2, 
        username: '07885513462', 
        password: '260824', 
        name: 'Caroline Duvins', 
        email: 'carolduv6@gmail.com',
        phone: '+33 07 56 90 26 36',
        accountNumber: '20250000004',
        country: 'France',
        city: 'Toulouse',
        location:  'Toulouse, France',
        manager: 'Jean Vollet',
        balance: 357000.500,
        isBlocked: true,
        unlockFee: 15000.00,
        blockReason: null,
        rib: {
          iban: 'FR76 3000 5000 0102 0123 4567 880',
          bankCode: '30004',
          branchCode: '00001',
          accountNumber: '00123456789',
          key: '80'
        },
        cards: [
          {
            id: 1,
            type: 'Visa Premier',
            cardNumber: '4532 0001 7892 2345',
            maskedNumber: '4532 **** **** 1235',
            cvv: '123',
            expiryDate: '10/27',
            status: 'active',
            dailyWithdrawalLimit: 500,
            weeklyPaymentLimit: 2000,
            internationalPaymentEnabled: true,
            issueDate: '12/2022',
            cardHolder: 'Caroline Duvins'
          }
        ],
        accounts: [
          { id: 1, type: 'Compte Courant', number: 'N°*******2284', balance: 357000.500, icon: 'wallet' },
          { id: 2, type: 'Livret A', number: 'N°*******5462', balance: 3000.40, icon: 'piggybank' },
          { id: 3, type: 'Plan Épargne', number: 'N°*******8891', balance: 50000.17, icon: 'trending' }
        ],
        transactions: [
          { id: 1, type: 'Virement entrant', date: '02 Déc 2025', reference: 'IE28 *** 513', amount: 40000.00, isCredit: true },
          { id: 2, type: 'Achat carte', date: '04 Déc 2025', reference: 'CARREFOUR BREST', amount: 85.50, isCredit: false },
          { id: 3, type: 'Virement sortant', date: '25 Nov 2025', reference: 'FR76 *** 657', amount: 1200.00, isCredit: false },
          { id: 4, type: 'Virement entrant', date: '12 Nov 2025', reference: 'US45 *** 234', amount: 3000.00, isCredit: true },
          { id: 5, type: 'Achat carte', date: '11 Déc 2024', reference: 'UBER PARIS', amount: 45.20, isCredit: false },
          { id: 6, type: 'Retrait ATM', date: '10 Déc 2024', reference: 'ATM BNP PARIS 15', amount: 100.00, isCredit: false },
          { id: 7, type: 'Virement entrant', date: '08 Déc 2024', reference: 'FR45 *** 891', amount: 500.00, isCredit: true },
          { id: 8, type: 'Achat carte', date: '07 Déc 2024', reference: 'FNAC PARIS', amount: 156.80, isCredit: false },
          { id: 9, type: 'Retrait ATM', date: '05 Déc 2024', reference: 'ATM BNP GARE LYON', amount: 200.00, isCredit: false },
          { id: 10, type: 'Achat carte', date: '03 Déc 2024', reference: 'AMAZON FRANCE', amount: 67.99, isCredit: false }
        ],
        expenses: {
          month: 'Décembre 2024',
          categories: [
            { name: 'Logement', value: 45, color: '#3B82F6' },
            { name: 'Alimentation', value: 25, color: '#10B981' },
            { name: 'Transport', value: 10, color: '#F97316' },
            { name: 'Loisirs', value: 12, color: '#6366F1' },
            { name: 'Autres', value: 8, color: '#D1D5DB' }
          ]
        },
        chequier: 5,
        virementRapide: 10,
        virementProgramme: 3
      },
      { 
        id: 2, 
        username: '07885513461', 
        password: '260824', 
        name: 'Ducharme Belinda', 
        email: 'Belindaducharme067@gmail.com',
        phone: '+33 06 44 67 54 97',
        accountNumber: '20250000003',
        country: 'France',
        city: 'Lille',
        location: 'Lille, France',
        manager: 'Luc Vollet',
        balance: 341890.00,
        isBlocked: false,
        unlockFee: 25000.00,
        blockReason: null,
        rib: {
          iban: 'FR76 3000 5000 0102 0123 4567 880',
          bankCode: '30004',
          branchCode: '00001',
          accountNumber: '00123456789',
          key: '80'
        },
        cards: [
          {
            id: 1,
            type: 'Visa Premier',
            cardNumber: '4532 0001 7892 2345',
            maskedNumber: '4532 **** **** 1235',
            cvv: '123',
            expiryDate: '10/27',
            status: 'active',
            dailyWithdrawalLimit: 500,
            weeklyPaymentLimit: 2000,
            internationalPaymentEnabled: true,
            issueDate: '12/2022',
            cardHolder: 'DUCHARME BELINDA'
          }
        ],
        accounts: [
          { id: 1, type: 'Compte Courant', number: 'N°*******2284', balance: 341890.00, icon: 'wallet' },
          { id: 2, type: 'Livret A', number: 'N°*******5462', balance: 3000.40, icon: 'piggybank' },
          { id: 3, type: 'Plan Épargne', number: 'N°*******8891', balance: 50000.17, icon: 'trending' }
        ],
        transactions: [
          { id: 1, type: 'Virement entrant', date: '02 Déc 2025', reference: 'IE28 *** 513', amount: 40000.00, isCredit: true },
          { id: 2, type: 'Achat carte', date: '04 Déc 2025', reference: 'CARREFOUR BREST', amount: 85.50, isCredit: false },
          { id: 3, type: 'Virement sortant', date: '25 Nov 2025', reference: 'FR76 *** 657', amount: 1200.00, isCredit: false },
          { id: 4, type: 'Virement entrant', date: '12 Nov 2025', reference: 'US45 *** 234', amount: 3000.00, isCredit: true },
          { id: 5, type: 'Achat carte', date: '11 Déc 2024', reference: 'UBER PARIS', amount: 45.20, isCredit: false },
          { id: 6, type: 'Retrait ATM', date: '10 Déc 2024', reference: 'ATM BNP PARIS 15', amount: 100.00, isCredit: false },
          { id: 7, type: 'Virement entrant', date: '08 Déc 2024', reference: 'FR45 *** 891', amount: 500.00, isCredit: true },
          { id: 8, type: 'Achat carte', date: '07 Déc 2024', reference: 'FNAC PARIS', amount: 156.80, isCredit: false },
          { id: 9, type: 'Retrait ATM', date: '05 Déc 2024', reference: 'ATM BNP GARE LYON', amount: 200.00, isCredit: false },
          { id: 10, type: 'Achat carte', date: '03 Déc 2024', reference: 'AMAZON FRANCE', amount: 67.99, isCredit: false }
        ],
        expenses: {
          month: 'Décembre 2024',
          categories: [
            { name: 'Logement', value: 45, color: '#3B82F6' },
            { name: 'Alimentation', value: 25, color: '#10B981' },
            { name: 'Transport', value: 10, color: '#F97316' },
            { name: 'Loisirs', value: 12, color: '#6366F1' },
            { name: 'Autres', value: 8, color: '#D1D5DB' }
          ]
        },
        chequier: 5,
        virementRapide: 10,
        virementProgramme: 3
      },
      { 
        id: 3, 
        username: '01234567890', 
        password: '123456', 
        name: 'Marie-Françoise Boignon', 
        email: 'demo@example.com',
        phone: '+33 07 00 00 00 00',
        accountNumber: '20250000001',
        country: 'France',
        city: 'Paris',
        location: 'Paris, France',
        manager: 'Charles Fortunato',
        balance: 987000.00,
        isBlocked: true,
        unlockFee: 25000.00,
        blockReason: 'Frais de maintenance annuels',
        rib: {
          iban: 'FR76 3000 4000 0100 0123 4567 890',
          bankCode: '30004',
          branchCode: '00001',
          accountNumber: '00123456789',
          key: '90'
        },
        cards: [
          {
            id: 1,
            type: 'Visa Premier',
            cardNumber: '4532 0003 7892 1235',
            maskedNumber: '4532 **** **** 1235',
            cvv: '125',
            expiryDate: '12/27',
            status: 'active',
            dailyWithdrawalLimit: 500,
            weeklyPaymentLimit: 2000,
            internationalPaymentEnabled: true,
            issueDate: '12/2022',
            cardHolder: 'MARIE-FRANCOISE BOIGNON'
          }
        ],
        accounts: [
          { id: 1, type: 'Compte Courant', number: 'N°*******2286', balance: 987000.00, icon: 'wallet' },
          { id: 2, type: 'Livret A', number: 'N°*******5464', balance: 0.00, icon: 'piggybank' }
        ],
        transactions: [],
        expenses: {
          month: 'Décembre 2024',
          categories: [
            { name: 'Logement', value: 45, color: '#3B82F6' },
            { name: 'Alimentation', value: 25, color: '#10B981' }
          ]
        },
        chequier: 5,
        virementRapide: 10,
        virementProgramme: 3
      },
      { 
        id: 4, 
        username: '09876543210', 
        password: '654321', 
        name: 'Jean-Pierre Dupont', 
        email: 'client@example.com',
        phone: '+225 07 11 11 11 11',
        accountNumber: '20250000004',
        country: 'Côte d\'Ivoire',
        city: 'Abidjan',
        location: 'Abidjan, Côte d\'Ivoire',
        manager: 'Sophie Martin',
        balance: 456789.50,
        isBlocked: true,
        unlockFee: 15000.00,
        blockReason: 'Validation de documents en attente',
        rib: {
          iban: 'FR76 3000 4000 0200 0234 5678 901',
          bankCode: '30004',
          branchCode: '00002',
          accountNumber: '00234567890',
          key: '01'
        },
        cards: [
          {
            id: 1,
            type: 'Visa Premier',
            cardNumber: '4532 0004 3456 1236',
            maskedNumber: '4532 **** **** 1236',
            cvv: '456',
            expiryDate: '09/26',
            status: 'active',
            dailyWithdrawalLimit: 500,
            weeklyPaymentLimit: 2000,
            internationalPaymentEnabled: true,
            issueDate: '09/2021',
            cardHolder: 'JEAN-PIERRE DUPONT'
          }
        ],
        accounts: [
          { id: 1, type: 'Compte Courant', number: 'N°*******3345', balance: 456789.50, icon: 'wallet' },
          { id: 2, type: 'Livret A', number: 'N°*******7823', balance: 12500.00, icon: 'piggybank' }
        ],
        transactions: [],
        expenses: {
          month: 'Décembre 2024',
          categories: [
            { name: 'Logement', value: 35, color: '#3B82F6' },
            { name: 'Alimentation', value: 30, color: '#10B981' }
          ]
        },
        chequier: 3,
        virementRapide: 8,
        virementProgramme: 2
      }
    ];
  }

  async createTransfer(userId, transferData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (DEV_MODE) console.log('💸 Virement:', userId, transferData);
        const user = this.users.find(u => u.id === userId);
        if (!user) { reject(new Error('Utilisateur non trouvé')); return; }
        if (user.balance < transferData.amount) { reject(new Error('Solde insuffisant')); return; }
        
        user.balance -= transferData.amount;
        const compteCourant = user.accounts.find(acc => acc.type === 'Compte Courant');
        if (compteCourant) compteCourant.balance -= transferData.amount;
        
        const newTransaction = { 
          id: Date.now(), 
          type: 'Virement sortant', 
          date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }), 
          reference: transferData.iban ? `${transferData.iban.substring(0, 4)} *** ${transferData.iban.slice(-3)}` : 'Virement', 
          amount: transferData.amount, 
          isCredit: false
        };
        
        user.transactions.unshift(newTransaction);
        this.saveToStorage();
        if (DEV_MODE) console.log('✅ Nouveau solde:', user.balance);
        resolve({ success: true, newBalance: user.balance, transaction: newTransaction });
      }, 1000);
    });
  }

  async authenticate(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!username || !password) { reject(new Error('Identifiant et mot de passe requis')); return; }
        if (!/^\d{11}$/.test(username)) { reject(new Error('L\'identifiant doit contenir 11 chiffres')); return; }
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) { 
          const { password, ...userWithoutPassword } = user; 
          resolve(userWithoutPassword); 
        } else { 
          reject(new Error('Identifiant ou mot de passe incorrect')); 
        }
      }, 1000);
    });
  }

  async getUserById(userId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (DEV_MODE) console.log('🔍 getUserById:', userId);
        const user = this.users.find(u => u.id === userId);
        if (user) { 
          const { password, ...userWithoutPassword } = user;
          if (DEV_MODE) console.log('✅ User trouvé:', userWithoutPassword.name, 'Balance:', userWithoutPassword.balance);
          resolve(userWithoutPassword); 
        } else { 
          reject(new Error('Utilisateur non trouvé')); 
        }
      }, 100);
    });
  }

  async getUserCards(userId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.users.find(u => u.id === userId);
        if (user) resolve(user.cards || []); 
        else reject(new Error('Utilisateur non trouvé'));
      }, 500);
    });
  }

  async toggleCardStatus(userId, cardId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.users.find(u => u.id === userId);
        if (!user) { reject(new Error('Utilisateur non trouvé')); return; }
        const card = user.cards.find(c => c.id === cardId);
        if (!card) { reject(new Error('Carte non trouvée')); return; }
        card.status = card.status === 'active' ? 'blocked' : 'active';
        this.saveToStorage();
        resolve(card);
      }, 1000);
    });
  }

  async updateCardLimits(userId, cardId, limits) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.users.find(u => u.id === userId);
        if (!user) { reject(new Error('Utilisateur non trouvé')); return; }
        const card = user.cards.find(c => c.id === cardId);
        if (!card) { reject(new Error('Carte non trouvée')); return; }
        if (limits.dailyWithdrawalLimit !== undefined) card.dailyWithdrawalLimit = limits.dailyWithdrawalLimit;
        if (limits.weeklyPaymentLimit !== undefined) card.weeklyPaymentLimit = limits.weeklyPaymentLimit;
        this.saveToStorage();
        resolve(card);
      }, 500);
    });
  }

  async toggleInternationalPayment(userId, cardId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.users.find(u => u.id === userId);
        if (!user) { reject(new Error('Utilisateur non trouvé')); return; }
        const card = user.cards.find(c => c.id === cardId);
        if (!card) { reject(new Error('Carte non trouvée')); return; }
        card.internationalPaymentEnabled = !card.internationalPaymentEnabled;
        this.saveToStorage();
        resolve(card);
      }, 500);
    });
  }

  async orderNewCard(userId, cardType = 'Visa Premier') {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.users.find(u => u.id === userId);
        if (!user) { reject(new Error('Utilisateur non trouvé')); return; }
        const newCardId = user.cards.length + 1;
        const cardNumber = `4532 ${String(userId).padStart(4, '0')} ${Math.floor(Math.random() * 10000).toString().padStart(4, '0')} ${String(1234 + userId + newCardId).padStart(4, '0')}`;
        const newCard = { 
          id: newCardId, 
          type: cardType, 
          cardNumber, 
          maskedNumber: `4532 **** **** ${cardNumber.slice(-4)}`, 
          cvv: Math.floor(100 + Math.random() * 900).toString(), 
          expiryDate: '12/29', 
          status: 'active', 
          dailyWithdrawalLimit: 500, 
          weeklyPaymentLimit: 2000, 
          internationalPaymentEnabled: false, 
          issueDate: new Date().toLocaleDateString('fr-FR', { month: '2-digit', year: 'numeric' }), 
          cardHolder: user.name.toUpperCase() 
        };
        user.cards.push(newCard);
        this.saveToStorage();
        resolve(newCard);
      }, 2000);
    });
  }

  async unlockAccount(userId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
          this.users[userIndex].isBlocked = false;
          this.users[userIndex].unlockFee = 0;
          this.users[userIndex].blockReason = null;
          this.saveToStorage();
          const { password, ...userWithoutPassword } = this.users[userIndex];
          resolve(userWithoutPassword);
        } else { 
          reject(new Error('Utilisateur non trouvé')); 
        }
      }, 1000);
    });
  }

  async updateUser(userId, updates) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
          this.users[userIndex] = { ...this.users[userIndex], ...updates };
          this.saveToStorage();
          const { password, ...userWithoutPassword } = this.users[userIndex];
          resolve(userWithoutPassword);
        } else { 
          reject(new Error('Utilisateur non trouvé')); 
        }
      }, 500);
    });
  }

  async changePassword(userId, oldPassword, newPassword) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.users.find(u => u.id === userId);
        if (!user) { reject(new Error('Utilisateur non trouvé')); return; }
        if (user.password !== oldPassword) { reject(new Error('Ancien mot de passe incorrect')); return; }
        if (!/^\d+$/.test(newPassword) || newPassword.length < 6) { 
          reject(new Error('Le mot de passe doit contenir au moins 6 chiffres')); 
          return; 
        }
        user.password = newPassword;
        this.saveToStorage();
        resolve({ success: true, message: 'Mot de passe modifié avec succès' });
      }, 500);
    });
  }

  async createUser(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!/^\d{11}$/.test(userData.username)) {
          reject(new Error('L\'identifiant doit contenir 11 chiffres'));
          return;
        }
        if (!/^\d+$/.test(userData.password) || userData.password.length < 6) {
          reject(new Error('Le mot de passe doit contenir au moins 6 chiffres'));
          return;
        }
        const existingUser = this.users.find(u => u.username === userData.username || u.email === userData.email);
        if (existingUser) {
          reject(new Error('Cet identifiant ou email existe déjà'));
          return;
        }
        const newUserId = Math.max(...this.users.map(u => u.id)) + 1;
        const newUser = {
          id: newUserId,
          username: userData.username,
          password: userData.password,
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
          country: userData.country || '',
          city: userData.city || '',
          location: `${userData.city || ''}, ${userData.country || ''}`,
          accountNumber: `2025${String(newUserId).padStart(7, '0')}`,
          manager: this.managers[Math.floor(Math.random() * this.managers.length)],
          balance: 0,
          isBlocked: false,
          unlockFee: 0,
          blockReason: null,
          rib: {
            iban: `FR${Math.floor(Math.random() * 90) + 10} 30004 ${String(10000 + newUserId).padStart(5, '0')} ${String(Math.floor(Math.random() * 100000000000)).padStart(11, '0')} ${Math.floor(Math.random() * 90) + 10}`,
            bankCode: '30004',
            branchCode: String(10000 + newUserId).padStart(5, '0'),
            accountNumber: String(Math.floor(Math.random() * 100000000000)).padStart(11, '0'),
            key: String(Math.floor(Math.random() * 90) + 10)
          },
          cards: [{
            id: 1,
            type: 'Visa Premier',
            cardNumber: `4532 ${String(newUserId).padStart(4, '0')} ${Math.floor(Math.random() * 10000).toString().padStart(4, '0')} 1235`,
            maskedNumber: '4532 **** **** 1235',
            cvv: Math.floor(100 + Math.random() * 900).toString(),
            expiryDate: '12/29',
            status: 'active',
            dailyWithdrawalLimit: 0,
            weeklyPaymentLimit: 0,
            internationalPaymentEnabled: false,
            issueDate: new Date().toLocaleDateString('fr-FR', { month: '2-digit', year: 'numeric' }),
            cardHolder: userData.name.toUpperCase()
          }],
          accounts: [
            { id: 1, type: 'Compte Courant', number: `N°*******${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, balance: 0, icon: 'wallet' },
            { id: 2, type: 'Livret A', number: `N°*******${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, balance: 0, icon: 'piggybank' }
          ],
          transactions: [],
          expenses: { month: 'Décembre 2024', categories: [] },
          chequier: 0,
          virementRapide: 0,
          virementProgramme: 0
        };
        this.users.push(newUser);
        this.saveToStorage();
        const { password, ...userWithoutPassword } = newUser;
        resolve(userWithoutPassword);
      }, 1000);
    });
  }
}

export default new UserService();