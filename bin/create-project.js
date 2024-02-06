#!/usr/bin/env node


const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');
const { generateApplet } = require('./generate-applet');

function createProject(projectName, firstAppletName) {
    const projectPath = path.resolve(projectName);
    const gitRepoUrl = 'https://github.com/fframes/create-fframe-app.git';

    // clone the repository
    console.log(`cloning the template into ${projectPath}`);
    execSync(`git clone ${gitRepoUrl} "${projectPath}"`);

    // remove the .git directory
    fs.rmSync(path.join(projectPath, '.git'), { recursive: true, force: true });

    // update package.json
    const packageJsonPath = path.join(projectPath, 'package.json');
    let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.name = projectName;
    const cfaVersion = packageJson.version;
    packageJson.version = '0.1.0';
    delete packageJson.author;
    delete packageJson.keywords;
    delete packageJson.repository;
    delete packageJson.license;
    delete packageJson.bin;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // remove the bin directory
    const binPath = path.join(projectPath, 'bin');
    if (fs.existsSync(binPath)) {
        fs.rmSync(binPath, { recursive: true, force: true });
    }

    // remove the example directory
    const examplePath = path.join(projectPath, 'src/app/api/example');
    if (fs.existsSync(examplePath)) {
        fs.rmSync(examplePath, { recursive: true, force: true });
    }

    const envExamplePath = path.join(projectPath, '.env.example');
    const envPath = path.join(projectPath, '.env');

    // generate .env file for local server
    if (fs.existsSync(envExamplePath)) {
        fs.copyFileSync(envExamplePath, envPath);
        fs.unlinkSync(envExamplePath);
    } else {
        console.log('.env.example does not exist, skipping copy and remove operations');
    }

    // run npm install
    console.log('installing dependencies...');
    execSync('npm install', { cwd: projectPath, stdio: 'inherit' });

    // create first applet
    generateApplet(firstAppletName, projectPath);

    // update readme with create-fframe-app version
    const readmePath = path.join(projectPath, 'README.md');
    const prependText = `<!-- generated by create-fframe-app version ${cfaVersion} -->\n\n`;
    if (fs.existsSync(readmePath)) {
        const originalReadmeContent = fs.readFileSync(readmePath, { encoding: 'utf8' });
        const updatedReadmeContent = prependText + originalReadmeContent;
        fs.writeFileSync(readmePath, updatedReadmeContent);
    } else {
        fs.writeFileSync(readmePath, prependText);
    }

    // initialize a new git repository
    console.log('initializing a new git repository...');
    execSync('git init', { cwd: projectPath });
    execSync('git add .', { cwd: projectPath });
    execSync('git commit -m "initial commit from create-fframe-app"', { cwd: projectPath });

    console.log(`🔲✅ ${projectName} has been initialized with git and dependencies installed ✅🔲\n`);
}

function main() {
    const readline = require('readline');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('enter the name of your project: ', function (projectName) {
        rl.question('enter your first fframe name (default is project name): ', function (fframeName) {
            fframeName = fframeName.trim() || projectName;
            createProject(projectName, fframeName);
            rl.close();
        });
    });

    rl.on('close', function () {
        console.log(`🔲✅ fframe app successfully generated ✅🔲\n`);
        process.exit(0);
    });
}

module.exports = { createProject: main };