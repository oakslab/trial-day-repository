import type { Page } from '@playwright/test';

import { type LoginPageApi } from './LoginPageApi';

export class LoginPage implements LoginPageApi {
  constructor(private page: Page) {}

  async setEmail(email: string) {
    await this.page.locator('input[name="email"]').fill(email);
  }

  async setPassword(password: string) {
    await this.page.locator('input[name="password"]').fill(password);
  }

  async submit() {
    await this.page.click('button[type="submit"]');
  }
}
