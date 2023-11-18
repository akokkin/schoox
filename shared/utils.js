import { By } from "selenium-webdriver"

async function login(driver, email, password) {

    await driver.get('http://qatest.schoox.com/login');

    const emailField = await driver.findElement(By.css('#root > div.login > form > div:nth-child(2) > input[type=email]'));
    await emailField.sendKeys(email);

    const passwordField = await driver.findElement(By.css('#root > div.login > form > div:nth-child(3) > input[type=password]'));
    await passwordField.sendKeys(password);

    // Submit the login form (adjust the selector based on your HTML structure)
    await driver.findElement(By.css('#root > div.login > form > button[type=submit]')).click();

    return true;
}

export { login }