import { Builder, By, until } from "selenium-webdriver"
import { beforeEach, describe } from 'mocha';
import { expect } from 'chai';
import { Options } from "selenium-webdriver/chrome.js";
import { login, isClickable } from './shared/utils.js';


describe("Schoox Assignments", () => {

    let driver;

    before(function () {
        const options = new Options();
        options.addArguments("--incognito");
        driver = new Builder().forBrowser('chrome').setChromeOptions(options).build();
    });

    after(async function () {
        await driver.quit();
    });

    describe("Tests that require auth", () => {
        beforeEach(async () => {
            const loginSuccess = await login(driver);
            expect(loginSuccess).is.true;
        })

        it("Tests the list contains specific courses", async () => {
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
            const elementsTexts = await Promise.all(courseTitleElements.map(x => x.getText()));
            expect(expectedCourseTitles).includes.members(elementsTexts);
        });

        it("Tests the course enrolment functionality", async () => {
            await driver.get('http://qatest.schoox.com/6/steps');

            const enrollButton = await driver.findElement(By.className('enroll'));
            await driver.wait(until.elementIsVisible(enrollButton), 4000);
            const enrollButtonIsClickable = await isClickable(enrollButton);
            expect(enrollButtonIsClickable).is.true;

            await enrollButton.click();
            const courseProgressElement = await driver.findElement(By.className('top_course_progress'));
            expect(await courseProgressElement.isDisplayed()).is.true;

            const courseStepsRightElements = await driver.findElements(By.className('course_steps_right'));
            const courseStepsAreClickable = await Promise.all(courseStepsRightElements.map(x => isClickable(x)));
            expect(courseStepsAreClickable.every(Boolean)).is.true;

            await new Promise(async (resolve) => {
                for (let i = 0; i < courseStepsRightElements.length; i++) {
                    const anElement = await driver.findElement(By.css(`.course_steps_right > .dot`))
                    await anElement.click()

                    const alert = driver.switchTo().alert();
                    await alert.accept()
                }

                resolve()
            })

            const courseProgressElementNew = await driver.findElement(By.className('top_course_progress'));
            expect(await courseProgressElementNew.isDisplayed()).is.true;
            const courseProgressText = await courseProgressElementNew.getText();
            const courseProgressPercentage = courseProgressText.replace("Course Progress: ", "");
            expect(courseProgressPercentage).eqls("100.00%")
        });
    });
});