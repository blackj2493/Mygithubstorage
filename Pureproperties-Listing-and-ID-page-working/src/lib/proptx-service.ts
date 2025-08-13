import { getSession } from '@auth0/nextjs-auth0';

const PROPTX_API_BASE = 'https://query.ampre.ca/odata/';

export class PropTxService {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async fetchWithAuth(endpoint: string) {
    const response = await fetch(`${PROPTX_API_BASE}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`PropTx API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getMetadata() {
    return this.fetchWithAuth('$metadata?$format=json');
  }

  async getProperties(top: number = 20, skip: number = 0) {
    return this.fetchWithAuth(`Property?$top=${top}&$skip=${skip}`);
  }

  async getProperty(id: string) {
    return this.fetchWithAuth(`Property('${id}')`);
  }
} 