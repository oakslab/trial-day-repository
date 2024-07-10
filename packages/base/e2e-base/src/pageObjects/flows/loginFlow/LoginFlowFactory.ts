import { type Page } from '@playwright/test';

import { LoginFlow } from './LoginFlow';

export class LoginFlowFactory {
  static getInstance(page: Page): LoginFlow {
    return new LoginFlow(page);
  }
}
