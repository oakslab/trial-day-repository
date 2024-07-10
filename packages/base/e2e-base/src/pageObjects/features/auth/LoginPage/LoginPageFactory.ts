import { type Page } from '@playwright/test';

import { LoginPage } from './LoginPage';
import { type LoginPageApi } from './LoginPageApi';

export class LoginPageFactory {
  static getInstance(page: Page): LoginPageApi {
    return new LoginPage(page);

    // const viewport = this.page.viewportSize();
    // if (viewport && viewport.width <= 768) {
    //   return Container.get(MobileUserService);
    // } else {
    //   return Container.get(DesktopUserService);
    // }
  }
}
