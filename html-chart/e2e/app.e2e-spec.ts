import { HtmlChartPage } from './app.po';

describe('html-chart App', function() {
  let page: HtmlChartPage;

  beforeEach(() => {
    page = new HtmlChartPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
