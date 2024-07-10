import { type Page } from '@playwright/test';
import { LoginPageFactory } from '../../features/auth/LoginPage/LoginPageFactory';

export class LoginFlow {
  constructor(private page: Page) {}

  logingUser = async (email: string, password: string) => {
    const loginPage = LoginPageFactory.getInstance(this.page);
    await loginPage.setEmail(email || '');
    await loginPage.setPassword(password || '');
    await loginPage.submit();
  };
}
