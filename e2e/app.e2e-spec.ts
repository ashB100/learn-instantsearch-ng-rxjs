import { InstantSearchPage } from './app.po';

describe('instant-search App', () => {
  let page: InstantSearchPage;

  beforeEach(() => {
    page = new InstantSearchPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
