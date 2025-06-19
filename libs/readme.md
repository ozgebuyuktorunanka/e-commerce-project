# Managing Local NestJS Libraries (Libs) and Integrating with Microservices

This guide explains how to integrate your common NestJS libraries (like those found in your `libs` folder) into your microservice projects. Two primary methods are presented: manual installation via `tgz` files and the recommended `npm/yarn workspaces` for monorepo projects.

---

## Method 1: Installation with Local `.tgz` File (Temporary / For Testing)

This method is useful for adding a specific snapshot of your `libs` package to your other microservices. However, it does not automatically reflect changes you make in the `libs` folder in your microservices; you'll need to regenerate and reinstall the `.tgz` file after every modification.

### Step 1: Package the `libs` Folder as an NPM Package

First, you need to turn your code in the `libs` folder into a `.tgz` file. This file is a compressed archive of your `libs` package.

1.  **Navigate to the `libs` folder:**
    ```bash
    cd /path/to/your/ecommerce-microservices/libs
    ```
2.  **Create the package:**
    ```bash
    npm pack
    ```
    This command will create a file named `libs-1.0.0.tgz` (or another name based on the `name` and `version` values in your `package.json` file) inside the `libs` folder. Make a note of the exact name and location of the generated `.tgz` file.

### Step 2: Install the `.tgz` File into Microservices

Now, you can install the `.tgz` file you created into each microservice project where you want to use it.

1.  **Navigate to the target microservice folder:**
    For example, let's assume you want to install it into `products-microservice`:
    ```bash
    cd /path/to/your/ecommerce-microservices/products-microservice
    ```
2.  **Install the local `.tgz` file:**
    Use the `npm install` command, specifying the **relative or absolute path** to the `.tgz` file. Typically, the `libs` folder is in a parent directory, so the relative path would be something like `../libs/your-package-name-version.tgz`.

    ```bash
    npm install ../libs/libs-1.0.0.tgz
    ```

    _(Replace `../libs/libs-1.0.0.tgz` in the path above with the actual path in your project.)_

When this command is run, a dependency entry using the `file:` protocol will be added to the target microservice's `package.json` file:

```json
// Example start in products-microservice/package.json
"dependencies": {
  "libs": "file:../libs/libs-1.0.0.tgz",
}
```
