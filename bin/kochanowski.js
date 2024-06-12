#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import inquirer from "inquirer";
import chalk from "chalk";

async function createKochanowskiProject() {
  const questions = [
    {
      type: "input",
      name: "projectName",
      message: "What is the name of your new Kochanowski project?",
      validate: (input) => (input ? true : "Project name cannot be empty"),
    },
  ];

  const answers = await inquirer.prompt(questions);
  const projectName = answers.projectName;
  const projectPath = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    console.error(
      chalk.red(
        `Directory ${projectName} already exists. Please choose a different name.`
      )
    );
    process.exit(1);
  }

  fs.mkdirSync(projectPath);
  process.chdir(projectPath);

  console.log(
    chalk.blue(`Initializing a new Kochanowski project in ${projectPath}`)
  );
  execSync("npm init -y", { stdio: "inherit" });

  console.log(chalk.blue("Installing Kochanowski package..."));
  execSync("npm install kochanowski", { stdio: "inherit" });

  createHelloWorldFile();
  addStartScript();

  console.log(chalk.green("Kochanowski project created successfully!"));
}

function addStartScript() {
  const packageJsonPath = path.join(process.cwd(), "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.start = "kochanowski indeks.kpl";

  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2),
    "utf8"
  );
  console.log(chalk.green("Added start script to package.json."));
}

function createHelloWorldFile() {
  const helloWorldContent = `Spłódź zmienną pierwsza liczba o wartości równej 1.
Spłódź zmienną druga liczba o wartości równej 0.
Spłódź zmienną trzecia liczba o wartości równej 0.

Powtórz przez 10 powtórzeń następujące polecenia.

Zmiennej trzecia liczba przypisz pierwsza liczba dodać druga liczba.
Zmiennej pierwsza liczba przypisz druga liczba.
Zmiennej druga liczba przypisz trzecia liczba.

Drukuj druga liczba.

Przejdź do następnej iteracji.`;
  fs.writeFileSync("indeks.kpl", helloWorldContent, "utf8");
  console.log(chalk.green("Created indeks.kpl with sample content."));
}

createKochanowskiProject().catch((error) => {
  console.error(chalk.red("An error occurred:"), error);
  process.exit(1);
});
