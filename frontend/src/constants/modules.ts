export interface Module {
  id: string;
  name: string;
  description: string;
  features: string[];
}

export const AVAILABLE_MODULES: Module[] = [
  {
    id: 'recovery',
    name: 'Account Recovery',
    description: 'Enable social recovery and backup mechanisms for your account',
    features: [
      'Social recovery through trusted contacts',
      'Time-locked recovery',
      'Backup key management'
    ]
  },
  {
    id: 'batching',
    name: 'Transaction Batching',
    description: 'Execute multiple transactions in a single operation',
    features: [
      'Bundle multiple transactions',
      'Gas optimization',
      'Atomic execution'
    ]
  },
  {
    id: 'automation',
    name: 'Smart Automation',
    description: 'Automate recurring transactions and conditions',
    features: [
      'Scheduled transactions',
      'Conditional transfers',
      'Gas price automation'
    ]
  },
  {
    id: 'security',
    name: 'Enhanced Security',
    description: 'Additional security features for your account',
    features: [
      'Multi-signature support',
      'Transaction limits',
      'Address whitelisting'
    ]
  }
]; 