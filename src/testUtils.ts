/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import * as Mocha from "mocha";
import * as path from "path";
import * as fs from "fs";
import * as vscode from "vscode";
import * as properties from "java-properties";


/**
 * The Setup allows the user to inject workbenches into the workspace using a
 * java-properties file.
 */
export async function Setup() {
    const ewSetupFile = process.env["ew-setup-file"];
    if (ewSetupFile) {
        console.log(`Reading stages from ${ewSetupFile}`);

        const values = properties.of(ewSetupFile);

        const ewPaths: string[] = [];
        for (const key of values.getKeys()) {
            const newPath = values.get(key) as string;
            if (!ewPaths.includes(newPath)) {
                console.log("Adding " + newPath);
                ewPaths.push(newPath);
            }
        }

        try {
            // Set an env variable for the debug plugin to use
            process.env["ewPaths"] = JSON.stringify(ewPaths);
            // The debug plugin cannot set this, since it does not contribute this setting
            await vscode.workspace.getConfiguration("iar-build").update("iarInstallDirectories", ewPaths, vscode.ConfigurationTarget.Global);
        } catch (e) {
            console.error(e);
        }
        console.log("EW Setup complete");
    }
}

/**
 * The mocha test promise that runs the actual test using mocha and produces the junit results.
 * @param testsRoot
 * @returns
 */
export async function getTestPromise(testsRoot: string, localTimeout = 2000): Promise<void> {
    await Setup();

    const rootSuiteName = process.env["rootName"];
    const junitFile = `/junit-vs-${path.basename(testsRoot)}-${rootSuiteName ?? ""}-[hash].xml`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: any = {ui: "tdd", timeout: localTimeout};
    if (process.env["junit"]) {
        console.log("Adding junit file " + junitFile);
        options.reporter = "mocha-junit-reporter";
        options.reporterOptions = {
            mochaFile: testsRoot + junitFile,
            jenkinsMode: true,
            useFullSuiteTitle: true,
            rootSuiteTitle: rootSuiteName,
        };
    }

    const onlyRunTestsIncluding = process.env["mocha-fgrep"];
    if (onlyRunTestsIncluding) {
        options.fgrep = onlyRunTestsIncluding;
        console.log(`Filtering for ${onlyRunTestsIncluding}`);
    }

    const mocha = new Mocha(options);

    return new Promise((c, e) => {
        // run all test files in this directory
        fs.readdir(testsRoot, (err, files) => {
            if (err) {
                return e(err);
            }
            files = files.filter(file => file.endsWith(".test.js"));

            // Add files to the test suite
            files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

            try {
                // Run the mocha test
                mocha.run(failures => {
                    if (failures > 0) {
                        e(new Error(`${failures} tests failed.`));
                    } else {
                        c();
                    }
                });
            } catch (err) {
                e(err);
            }
        });
    });
}


export namespace TestUtils {

    /**
     * Replaces the $TARGET$ string in the @param testEwpFile with @param targetName
     * and produces a copy placed alongside which can be used for testing.
     * @param targetName
     * @param testEwpFile
     */
    export function patchEwpFile(targetName: string, testEwpFile: string, outputFile: string): void {
        let fileContent: string = fs.readFileSync(testEwpFile, {encoding:"utf8"});
        fileContent = fileContent.replace("$TARGET$", targetName);
        fs.writeFileSync(outputFile, fileContent, {encoding:"utf8"});
    }

    /**
     * Recursively delete a folder and its content.
     * @param root
     */
    export function deleteDirectory(root: string) {
        fs.rmdirSync(root, {recursive: true});
    }

}
