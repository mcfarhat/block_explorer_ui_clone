import { Locator, Page, expect } from "@playwright/test";

export class BlockPage {
  readonly page: Page;
  readonly blockPageSearch: Locator;
  readonly blockPageBlockDetails: Locator;
  readonly blockPageOperationList: Locator;
  readonly blockDetailsBlockNumber: Locator;
  readonly producedData: Locator;
  readonly jsonView: Locator;
  readonly operationType: Locator;
  readonly blockProducer: Locator;
  readonly hash: Locator;
  readonly prevHash: Locator;
  readonly operations: Locator;
  readonly virtualOperations: Locator;
  readonly seeMoreDetailsBtn: Locator;
  readonly detailedOperationCard: Locator;

  constructor(page: Page) {
    this.page = page;
    this.blockPageSearch = page.getByTestId('block-page-search');
    this.blockPageBlockDetails = page.getByTestId('block-page-block-details');
    this.blockPageOperationList = page.getByTestId('block-page-operation-list');
    this.blockDetailsBlockNumber = page.getByTestId('block-number');
    this.producedData = page.locator("[data-testid='produced-data'] > p:nth-of-type(2)")
    this.jsonView = page.locator('pre')
    this.operationType = page.locator('.text-explorer-orange')
    this.blockProducer = page.getByTestId('block-producer-name');
    this.hash = page.getByTestId('hash');
    this.prevHash = page.getByTestId('prev-hash');
    this.operations = page.locator('.my-2').nth(1);
    this.virtualOperations = page.locator('.my-2').nth(2);
    this.seeMoreDetailsBtn = page.getByRole('button', {name: "See more details"})
    this.detailedOperationCard = page.getByTestId("detailed-operation-card")
  }

  async validateBlockPageIsLoaded() {
    await this.page.waitForLoadState("networkidle");
    await expect(this.blockPageSearch).toBeVisible();
    await expect(this.blockPageBlockDetails).toBeVisible();
    await expect(this.blockPageOperationList).toBeVisible();
  }

  async validateBlockNumber(blockNumber: string){
    await expect(this.blockDetailsBlockNumber).toContainText(blockNumber);
  }

  async validateBlockProducerName(blockProducer: string){
    await expect(this.blockProducer).toContainText(blockProducer);
  }
}
