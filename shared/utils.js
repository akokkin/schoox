import { By } from "selenium-webdriver"
import fs from "fs";

async function login(driver) {

    const credentialsPath = './fixtures/loginCredentials.json';
    const { email, password } = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));

    await driver.get('http://qatest.schoox.com/login');

    const emailField = await driver.findElement(By.css('#root > div.login > form > div:nth-child(2) > input[type=email]'));
    await emailField.sendKeys(email);

    const passwordField = await driver.findElement(By.css('#root > div.login > form > div:nth-child(3) > input[type=password]'));
    await passwordField.sendKeys(password);

    await driver.findElement(By.css('#root > div.login > form > button[type=submit]')).click();
    const mainElement = await driver.findElement(By.css('#main'));

    return mainElement.isDisplayed();
}


async function isClickable(element) {
    if (!element) {
        return false;
    }
    const isVisible = await element.isDisplayed();
    const isEnabled = await element.isEnabled();
    return isVisible && isEnabled;
}

export { login, isClickable }