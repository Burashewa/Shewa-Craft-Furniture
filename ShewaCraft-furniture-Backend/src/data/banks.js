export const banks = [
  {
    id: 1,
    bankName: 'Chase Bank',
    accountName: 'ShewaCraft Furniture',
    accountNumber: '**** **** **** 4532',
  },
  {
    id: 2,
    bankName: 'Bank of America',
    accountName: 'ShewaCraft Furniture',
    accountNumber: '**** **** **** 8291',
  },
  {
    id: 3,
    bankName: 'Wells Fargo',
    accountName: 'ShewaCraft Furniture',
    accountNumber: '**** **** **** 1047',
  },
  {
    id: 4,
    bankName: 'PayPal',
    accountName: 'payments@shewacraft.com',
    accountNumber: '',
  },
];

export function findBank(bankId) {
  const id = Number(bankId);
  return banks.find((bank) => bank.id === id) || null;
}
