import { PsiNgPage } from './app.po';

describe('psi-ng App', () => {
  let page: PsiNgPage;

  beforeEach(() => {
    page = new PsiNgPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
