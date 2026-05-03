package com.library;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.time.Duration;

public class PasswordValidationTest {

    private WebDriver driver;
    private WebDriverWait wait;
    
    // Change this URL if your frontend is running on a different port
    private final String REGISTER_URL = "http://localhost:5173/register";

    @BeforeClass
    public void setup() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        // options.addArguments("--headless"); // Uncomment if you don't want to see the browser UI
        driver = new ChromeDriver(options);
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @Test(dataProvider = "invalidPasswordsData")
    public void testPasswordConstraints(String password, String errorMessage) {
        // Navigate to the registration page
        driver.get(REGISTER_URL);
        
        // Let React render
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@placeholder='John Doe']")));

        // Fill out valid inputs for other fields
        driver.findElement(By.xpath("//input[@placeholder='John Doe']")).sendKeys("Test User");
        driver.findElement(By.xpath("//input[@placeholder='21CSE...']")).sendKeys("21CSE001");
        driver.findElement(By.xpath("//input[@placeholder='CSE']")).sendKeys("CSE");
        
        // Enter the invalid password and confirm password
        WebElement passwordInput = driver.findElements(By.xpath("//input[@placeholder='••••••••']")).get(0);
        WebElement confirmPasswordInput = driver.findElements(By.xpath("//input[@placeholder='••••••••']")).get(1);
        
        passwordInput.sendKeys(password);
        confirmPasswordInput.sendKeys(password);
        
        // Click the submit button
        driver.findElement(By.xpath("//button[@type='submit']")).click();
        
        // Wait for error message to appear
        WebElement errorDiv = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[contains(@class, 'text-red-700')]")));
        
        // Verify the error message
        String actualError = errorDiv.getText().replace("Error:\n", "").replace("Error: ", "").trim();
        System.out.println("Tested password: '" + password + "' -> Expected Error: '" + errorMessage + "', Actual: '" + actualError + "'");
        Assert.assertTrue(actualError.contains(errorMessage), "Expected error containing '" + errorMessage + "' but got '" + actualError + "'");
    }

    @DataProvider(name = "invalidPasswordsData")
    public Object[][] invalidPasswordsData() {
        return new Object[][]{
            // 1. Less than 8 chars
            {"Aa1!aaa", "Password must be between 8 and 15 characters"},
            // 1. More than 15 chars
            {"Aa1!aaaaaaaaaaaa", "Password must be between 8 and 15 characters"},
            // 2. No digit
            {"Aaaaaaa!", "Password must contain at least one digit"},
            // 3. No uppercase
            {"aaaaa1!!", "Password must contain at least one upper case alphabet"},
            // 4. No lowercase
            {"AAAAA1!!", "Password must contain at least one lower case alphabet"},
            // 5. No special char
            {"Aaaaa111", "Password must contain at least one special character"},
            // 6. Contains whitespace
            {"Aaaa a1!", "Password must not contain any white space"}
        };
    }

    @Test
    public void testValidPassword() {
        // Wait until driver is ready
        driver.get(REGISTER_URL);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@placeholder='John Doe']")));

        driver.findElement(By.xpath("//input[@placeholder='John Doe']")).sendKeys("Valid User");
        driver.findElement(By.xpath("//input[@placeholder='21CSE...']")).sendKeys("21CSE002");
        driver.findElement(By.xpath("//input[@placeholder='CSE']")).sendKeys("CSE");

        // Use a valid password
        String validPwd = "Valid1Password!";
        WebElement passwordInput = driver.findElements(By.xpath("//input[@placeholder='••••••••']")).get(0);
        WebElement confirmPasswordInput = driver.findElements(By.xpath("//input[@placeholder='••••••••']")).get(1);
        
        passwordInput.sendKeys(validPwd);
        confirmPasswordInput.sendKeys(validPwd);

        driver.findElement(By.xpath("//button[@type='submit']")).click();
        
        // If password is valid, there should be no such error msg div OR it should throw timeout if it doesn't appear
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[contains(@class, 'text-red-700')]")));
            // If it appears, get the text and fail if it's a validation error
            String actualError = driver.findElement(By.xpath("//div[contains(@class, 'text-red-700')]")).getText();
            if(actualError.contains("Password must")) {
                Assert.fail("No password error should have appeared, but got: " + actualError);
            }
        } catch (org.openqa.selenium.TimeoutException e) {
            // Expected, meaning either network request goes through, or no error validation text shows up
            Assert.assertTrue(true);
        }
    }

    @AfterClass
    public void teardown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
