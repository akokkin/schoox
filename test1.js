import { Builder, By } from "selenium-webdriver"
import fs from "fs";
import { expect } from "chai";
import { login } from './shared/utils.js';

describe("Test 1 - Schoox Assignment", () => {

    let driver;

    before(function () {
        driver = new Builder().forBrowser('chrome').build();
    });

    after(function () {
        return driver.quit();
    });

    describe("tests that require auth", () => {
        beforeEach(async () => {

            const credentialsPath = './fixtures/loginCredentials.json';
            const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));

            // Use the login method
            const loginSuccessful = await login(driver, credentials.email, credentials.password);

            // Assert the login was successful (modify this based on your application behavior)
            // expect(loginSuccessful).is.true; TODO Uncomment
        });

        it("Tests the list contains specific courses", async (done) => {
            // Navigate to training
            await driver.get('http://qatest.schoox.com/training');

            const categoryList = await driver.findElement(By.css('#course_catalogue > div.category_listing'));
            const categoryItems = await categoryList.findElements(By.css('i'));

            let qaCategoryItemFound = false;

            for (const categoryItem of categoryItems) {
                const categoryItemName = await categoryItem.getText();

                if (categoryItemName === 'QA') {
                    qaCategoryItemFound = true;
                    await categoryItem.click();
                    break;
                }

            }

            expect(qaCategoryItemFound).is.true;

            const expectedCourseTitles = ["QA Course", "BA Course", "Μάθημα για τους Devs", "Μάθημα για Automation"];
            const courseTitleElements = await driver.findElements(By.css(".course_title > b"));
            const unresolvedTextPromises = courseTitleElements.map(x => x.getText());
            const elementsTexts = await Promise.all(unresolvedTextPromises);
            expect(elementsTexts).includes.members(expectedCourseTitles)
            console.log(`@@ TEXTS: ${elementsTexts}`);
            console.log('Test passed successfully!');

            done();
        })
    })
})

